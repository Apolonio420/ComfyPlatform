"use client";

import { useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "./ui/card";
import { WandSparklesIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function App() {
  const [formData, setFormData] = useState({
    prompt: "beautiful scenery nature glass bottle landscape, purple galaxy bottle",
    height: 1152,
    width: 896,
    lora: "",
    loraStrength: 0.5,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [runId, setRunId] = useState<string | null>(null);

  const handleSelection = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok && result.runId) {
        toast.success("¡Generación de imagen iniciada!");
        setRunId(result.runId);
        mutate("userRuns");
      } else {
        toast.error(result.error || "Fallo al iniciar la generación de imagen.");
      }
    } catch (error) {
      console.error("Error generando imagen:", error);
      toast.error("Ocurrió un error al generar la imagen.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed z-50 bottom-0 md:bottom-2 flex flex-col gap-2 w-full md:max-w-lg mx-auto">
      <Card className="p-2 shadow-lg rounded-none md:rounded-2xl">
        <div className="flex flex-col gap-4">
          {/* Input del Prompt */}
          <Input
            id="input"
            className="rounded-xl text-base sm:text-sm z-10"
            value={formData.prompt}
            onChange={(e) => handleSelection("prompt", e.target.value)}
            placeholder="Enter a prompt to generate an image"
          />

          {/* Selector de Tamaño */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Height & Width:</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { height: 512, width: 512, label: "512x512" },
                { height: 1024, width: 768, label: "1024x768" },
                { height: 1152, width: 896, label: "1152x896" },
              ].map((option) => (
                <Button
                  key={option.label}
                  className={cn(
                    "rounded-md p-2",
                    formData.height === option.height && formData.width === option.width
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  )}
                  onClick={() => {
                    handleSelection("height", option.height);
                    handleSelection("width", option.width);
                  }}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Selector de LoRA */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">LoRA:</label>
            <select
              value={formData.lora}
              onChange={(e) => handleSelection("lora", e.target.value)}
              className="w-full border rounded-md p-2"
            >
              <option value="">Select LoRA</option>
              <option value="flux-RealismLora.safetensors">Realism Lora</option>
              <option value="anime-lora">Anime Lora</option>
            </select>
          </div>

          {/* Selector de LoRA Strength */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">LoRA Strength:</label>
            <input
              type="number"
              value={formData.loraStrength}
              onChange={(e) => handleSelection("loraStrength", parseFloat(e.target.value))}
              min={0}
              max={1}
              step={0.1}
              className="border rounded-md p-2"
            />
          </div>

          {/* Botón de Generación */}
          <Button
            variant="expandIcon"
            className={cn(
              "rounded-xl transition-all w-full p-3",
              isGenerating && "opacity-50 cursor-not-allowed"
            )}
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
