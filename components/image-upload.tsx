"use client"

import type React from "react"
import { api } from "@/lib/api" // Import centralized API utility

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, Loader2 } from "lucide-react"

interface ImageUploadProps {
  onImageUpload: (url: string) => void
  currentImage?: string
  className?: string
}

export function ImageUpload({ onImageUpload, currentImage, className }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImage || null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const previewUrl = URL.createObjectURL(file)
    setPreview(previewUrl)
    setUploading(true)

    try {
      const result = await api.uploadImage(file)

      if (result.success && result.url) {
        onImageUpload(result.url)
        setPreview(result.url)
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      console.error("Upload failed:", error)
      setPreview(currentImage || null)
      alert("Upload failed. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const removeImage = () => {
    setPreview(null)
    onImageUpload("")
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {preview ? (
        <div className="relative">
          <img
            src={preview || "/placeholder.svg"}
            alt="Product preview"
            className="w-full h-48 object-cover rounded-lg border-2 border-amber-200"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={removeImage}
            disabled={uploading}
          >
            <X className="h-4 w-4" />
          </Button>
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          )}
        </div>
      ) : (
        <div className="border-2 border-dashed border-amber-300 rounded-lg p-8 text-center">
          <Upload className="h-12 w-12 text-amber-600 mx-auto mb-4" />
          <p className="text-amber-800 mb-4">Click to upload product image</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload"
            disabled={uploading}
          />
          <Button
            type="button"
            variant="outline"
            className="border-amber-600 text-amber-800 hover:bg-amber-50 bg-transparent"
            onClick={() => document.getElementById("image-upload")?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Select Image
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
