import { NextRequest, NextResponse } from "next/server";
import { generateImage } from "@/server/generate";

export async function POST(request: NextRequest) {
  try {
    const { prompt, height, width, lora, lora_strength, batchSize } = await request.json();

    if (!prompt || !height || !width) {
      return NextResponse.json(
        { error: "Missing required fields: prompt, height, width" },
        { status: 400 }
      );
    }

    const runId = await generateImage(prompt, request.nextUrl.origin, {
      height,
      width,
      lora,
      batchSize,
      lora_strength,
    });

    return NextResponse.json({ runId });
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      { error: "Error generating image", details: (error as Error).message },
      { status: 500 }
    );
  }
}
