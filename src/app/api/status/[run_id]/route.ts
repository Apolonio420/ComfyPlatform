import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { runId: string } }) {
  const { runId } = params;

  try {
    const response = await fetch(`https://api.comfydeploy.com/api/run/${runId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.COMFY_DEPLOY_API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      throw new Error(
        `ComfyDeploy API Error: ${response.status} ${response.statusText} ${JSON.stringify(
          errorDetails
        )}`
      );
    }

    const statusData = await response.json();
    return NextResponse.json(statusData);
  } catch (error) {
    console.error("Error obteniendo el estado del run:", error);
    return NextResponse.json(
      { error: "Error obteniendo el estado del run", details: (error as Error).message },
      { status: 500 }
    );
  }
}
