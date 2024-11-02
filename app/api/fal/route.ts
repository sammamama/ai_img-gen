import { NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import JSZip from 'jszip'

export async function POST(request: Request) {
  try {
    fal.config({
      credentials: process.env.FAL_API_KEY,
    });

    const { images, modelName } = await request.json();
    
    // Validate required fields
    if (!images || !modelName) {
      return NextResponse.json({ success: false, error: 'Images and modelName are required.' }, { status: 400 });
    }

    const zip = new JSZip();
    
    // Add each image to the zip file
    images.forEach((image: string, index: number) => {
      // Remove the data URL prefix if present
      const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
      // Convert base64 to binary
      const imageBuffer = Buffer.from(base64Data, 'base64');
      // Add to zip with a proper image extension (adjust based on your image type)
      zip.file(`image_${index}.jpg`, imageBuffer);
    });

    // Generate zip file
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
    
    // Create a File object from the zip buffer
    const file = new File([zipBuffer], `${modelName}-${Date.now()}.zip`, { type: 'application/zip' });
    
    // Upload the zip file
    const url = await fal.storage.upload(file);

    // Start the training process
    const response = await fal.subscribe("fal-ai/flux-lora-general-training", {
      input: {
        images_data_url: url
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });

    return NextResponse.json({ success: true, modelId: response.data.modelId }, { status: 200 });
  } catch (error: any) {
    console.error('Error creating model:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create model',
        details: error.response ? error.response.data : error.message,
      },
      { status: 500 }
    );
  }
}