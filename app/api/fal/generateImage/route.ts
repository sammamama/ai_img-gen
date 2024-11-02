import { imageGen } from "@/lib/fal";
import { fal } from "@fal-ai/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    fal.config({
      credentials: process.env.FAL_API_KEY,
    });

    const body = await request.json();

    const {prompt, loraId} = body;

    console.log(loraId)

    console.log(prompt);

    const result = await imageGen({ prompt, loraId });
    console.log(result);
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
