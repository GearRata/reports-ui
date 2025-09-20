/* eslint-disable @next/next/no-img-element */
"use client";
import React from 'react';
import { X } from 'lucide-react';

interface ImageCompressorProps {
  selectedImages: string[];
  capturedFiles: File[];
  onImagesChange: (images: string[], files: File[]) => void;
  processing?: boolean;
}

export default function ImageCompressor({
  selectedImages,
  capturedFiles,
  onImagesChange,
  processing = false
}: ImageCompressorProps) {
  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newFiles = capturedFiles.filter((_, i) => i !== index);
    onImagesChange(newImages, newFiles);
  };

  return (
    <div className="space-y-3">
      {/* Image Preview Grid */}
      {selectedImages.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {selectedImages.map((src, index) => (
            <div key={index} className="relative aspect-square">
              <img
                src={src}
                alt={`preview-${index}`}
                className="w-full h-full object-cover rounded border-2 border-gray-200 dark:border-zinc-700"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs hover:bg-red-600"
              >
                <X className="h-2 w-2" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Processing Status */}
      {processing && (
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
          <span className="text-xs">บีบอัด...</span>
        </div>
      )}
    </div>
  );
}