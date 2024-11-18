import { NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import JSZip from "jszip";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authConfig);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    fal.config({
      credentials: process.env.FAL_API_KEY,
    });

    const { images, modelName } = await request.json();

    // Validate required fields
    if (!images || !modelName) {
      return NextResponse.json(
        { success: false, error: "Images and modelName are required." },
        { status: 400 }
      );
    }

    const zip = new JSZip();

    // Add each image to the zip file
    images.forEach((image: string, index: number) => {
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      const imageBuffer = Buffer.from(base64Data, "base64");
      zip.file(`image_${index}.jpg`, imageBuffer);
    });

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
    const file = new File([zipBuffer], `${modelName}-${Date.now()}.zip`, {
      type: "application/zip",
    });

    const url = await fal.storage.upload(file);

    // Start the training process
    const response = await fal.subscribe("fal-ai/flux-lora-fast-training", {
      input: {
        images_data_url: url,
        steps: 2,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });

    // TODO: Remove the log.
    console.log(`FAL response: ${JSON.stringify(response)}`);

    const user = await prisma.user.findUnique({
      where: {
        email: session?.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found." },
        { status: 404 }
      );
    }

    // Create new Lora and increment user's lora_amount in a transaction
    const createdLora = await prisma.$transaction(async (prisma) => {
      const lora = await prisma.lora.create({
        data: {
          user_id: user.id,
          request_id: response.requestId,
          lora_name: modelName,
          lora_path: response.data.diffusers_lora_file.url,
          lora_file_content_type: response.data.diffusers_lora_file.content_type,
          config_file_url: response.data.config_file.url,
          config_file_content_type: response.data.config_file.content_type
        },
      });
      
      await prisma.user.update({
        where: {
          id: user.id
        },
        data: {
          lora_amount: {
            increment: 1
          }
        }
      });

      return lora;
    });

    console.log(`created data: ${JSON.stringify(createdLora)}`);
    return NextResponse.json(
      { success: true, data: createdLora },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Error creating model:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create model",
        details: error.response ? error.response.data : error.message,
      },
      { status: 500 }
    );
  }
}