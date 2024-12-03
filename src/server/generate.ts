// src/server/generate.ts
export async function generateImage(
    prompt: string,
    endpoint: string,
    options: {
      height: number;
      width: number;
      lora?: string;
      batchSize?: number;
      lora_strength?: number;
    }
  ): Promise<string> {
    const { height, width, lora, batchSize = 1, lora_strength } = options;
  
    const inputs: Record<string, string | number> = {
      prompt,
      height,
      width,
      batch: batchSize,
    };
  
    if (lora) inputs["lora"] = lora;
    if (lora_strength !== undefined) inputs["lora_strength"] = lora_strength;
  
    console.log("Enviando solicitud a ComfyDeploy con los siguientes datos:", inputs);
  
    try {
      const response = await fetch("https://api.comfydeploy.com/api/run/queue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.COMFY_DEPLOY_API_KEY}`,
        },
        body: JSON.stringify({
          inputs,
          webhook: `${endpoint}/api/status`,
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`ComfyDeploy API Error: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`ComfyDeploy API responded with status ${response.status}`);
      }
  
      const result = await response.json();
      console.log("Respuesta exitosa de ComfyDeploy:", result);
  
      return result.run_id;
    } catch (error) {
      console.error("Error llamando a la API de ComfyDeploy:", error);
      throw new Error("Failed to generate image");
    }
  }
  