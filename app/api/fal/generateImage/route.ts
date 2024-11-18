import { authConfig } from "@/lib/auth";
import { imageGen } from "@/lib/fal";
import prisma from "@/lib/prisma";
import { fal } from "@fal-ai/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authConfig);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    // TODO: See if auth is required similar to session
    fal.config({
      credentials: process.env.FAL_API_KEY,
    });

    const body = await request.json();

    const {prompt, loraPath} = body;

    console.log(loraPath)

    console.log(prompt);

    const result = await imageGen({ prompt, loraPath });

    console.log("res "+JSON.stringify(result))

    if(!result?.success) return NextResponse.json({success: false, "message": "Image could note be created"}, {status: 400});

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email
      }
    });

    if(!user) return "No access"

    await prisma.image.create({
      data: {
        url: result.data.images[0].url,
        Dimensions: `${result.data.images[0].width}x${result.data.images[0].height}`,
        prompt: result.data.prompt,
        status: "SUCESS",
        seed: 20,
        request_id: result.requestId,
        lora: {
          connect: {
            lora_path: loraPath,
          }
        },
        user: {
          connect: {
            id: user.id
          }
        }
      }
    })

    console.log("result " + JSON.stringify(result));
    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error generating image:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    } else {
      console.error("Unexpected error:", error);
      return NextResponse.json(
        { success: false, error: "An unexpected error occurred." },
        { status: 500 }
      );
    }
  }
}
