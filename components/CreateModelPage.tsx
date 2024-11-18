"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Upload, X } from "lucide-react";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { redirect } from "next/navigation";

const modelSchema = z.object({
  name: z.string().min(3, "Model name is required with 3 characters"),
  images: z
    .array(z.instanceof(File))
    // TODO: Change the min image number
    .min(1, "At least 20 images are required"),
});

export default function CreateModelPage() {
  const [modelName, setModelName] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles((prevFiles) => [
        ...prevFiles,
        ...Array.from(event.target.files || []),
      ]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files) {
      setSelectedFiles((prevFiles) => [
        ...prevFiles,
        ...Array.from(event.dataTransfer.files),
      ]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      modelSchema.parse({ name: modelName, images: selectedFiles });
      toast({
        title: "Custom model created",
        description: `Model "${modelName}" created with ${selectedFiles.length} images.`,
      });
      // Reset form after submission
      setModelName("");
      setSelectedFiles([]);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  const handleCustomModel = async () => {
    try {
      // Convert selected files to base64
      const base64Images = await Promise.all(
        Array.from(selectedFiles).map((file) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        })
      );
  
      const response = await fetch("/api/fal/createModel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          images: base64Images,
          modelName: modelName,
        }),
      });
  
      const data: { success: boolean; modelId?: string; error?: string } =
        await response.json();
  
      if (data.success) {
        console.log("response " + JSON.stringify(response));
        console.log("Model created successfully with ID: ", data.modelId);
        redirect('/customModels');
      } else {
        console.error("Model creation failed:", data.error);
      }
    } catch (error) {
      console.error("Error creating model:", error);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 p-4 lg:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 lg:p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Create Custom AI Model
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="model-name">Model Name</Label>
              <Input
                id="model-name"
                placeholder="Enter a name for your custom model"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image-upload">Upload Images</Label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors duration-300"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  id="image-upload"
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple
                  accept="image/*"
                  className="hidden"
                />
                <div className="flex flex-col items-center">
                  <Plus className="w-12 h-12 text-gray-400 mb-4 transition-transform duration-300 transform group-hover:scale-110" />
                  <p className="text-lg font-medium text-gray-700">
                    Select at least 20-30 good quality pictures of yourself
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    or drag and drop your images here
                  </p>
                </div>
              </div>
            </div>
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Files ({selectedFiles.length})</Label>
                <div className="max-h-60 overflow-y-auto border rounded-lg p-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-24 object-cover rounded"
                        width={300}
                        height={300}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <Button
              type="submit"
              className="w-full"
              onClick={handleCustomModel}
            >
              <Upload className="mr-2 h-4 w-4" />
              Create Custom Model
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
