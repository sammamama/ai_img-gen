"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageIcon, Loader2, Download } from "lucide-react";
import Image from "next/image";
import { Textarea } from "./ui/textarea";

const aiModels = [
  { value: "none", label: "No AI model" },
  { value: "https://storage.googleapis.com/fal-flux-lora/3722696153fa4f6fa9c82707d3dc7b66_lora.safetensors", label: "Model" },
];

export default function AIImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [seed, setSeed] = useState("");
  const [model, setModel] = useState("stable-diffusion");
  const [imageCount, setImageCount] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<{url: string}[]>([]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    const result = await fetch('/api/fal/generateImage',
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: prompt,
          loraId: "https://storage.googleapis.com/fal-flux-lora/3722696153fa4f6fa9c82707d3dc7b66_lora.safetensors"
        }),
      }
    )
    if (!result.ok){ setIsGenerating(false); }
    
    const data = await result.json();
    
    setGeneratedImages(data.data.data.images)
    
    setIsGenerating(false);
  };

  return (
    <div className="h-screen bg-gray-100 p-4 lg:p-8">
      <div className="max-w-7xl h-full mx-auto bg-white rounded-xl shadow-md flex flex-col">
        <div className="flex-1 flex flex-col lg:flex-row min-h-0">
          {/* Left column (Controls) */}
          <div className="lg:w-1/3 p-6 lg:p-8 bg-gray-50 overflow-y-auto">
            <h1 className="text-3xl font-bold mb-6 text-center lg:text-left">
              AI Image Generator
            </h1>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="prompt">Prompt</Label>
                <Textarea
                  id="prompt"
                  placeholder="Enter your image prompt here"
                  className="resize-none"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  autoComplete={"off"}
                  rows={4}
                  wrap="hard"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seed">Seed (optional)</Label>
                <Input
                  id="seed"
                  type="number"
                  placeholder="Enter a seed number"
                  value={seed}
                  onChange={(e) => setSeed(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">AI Model</Label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger id="model">
                    <SelectValue placeholder="Select AI model" />
                  </SelectTrigger>
                  <SelectContent>
                    {aiModels.map((aiModel) => (
                      <SelectItem key={aiModel.value} value={aiModel.value}>
                        {aiModel.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image-count">
                  Number of Images ({imageCount})
                </Label>
                <Slider
                  id="image-count"
                  min={1}
                  max={8}
                  step={1}
                  value={[imageCount]}
                  onValueChange={(value) => setImageCount(value[0])}
                />
              </div>
              <button
                className={`w-full flex items-center justify-center p-2 rounded-lg text-neutral-100 bg-purple-400 hover:cursor-pointer active:bg-purple-600`}
                onClick={handleGenerate}
                disabled={isGenerating || !prompt}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Generate Images
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right column (Generated Images) */}
          <div className="lg:w-2/3 p-6 lg:p-8 overflow-y-auto flex-1">
            <h2 className="text-2xl font-bold mb-4 lg:hidden">
              Generated Images
            </h2>
            {generatedImages.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                {generatedImages.map((src, index) => (
                  <div key={index} className="relative group">
                    <Image
                      src={src.url}
                      alt={`Generated image ${index + 1}`}
                      width={300}
                      height={300}
                      className="w-full h-auto object-cover rounded-lg shadow-md"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                      <Button variant="secondary" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 text-center">
                  Generated images will appear here.
                  <br />
                  Start by entering a prompt and clicking &quot;Generate
                  Images&quot;.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}