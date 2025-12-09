"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UploadCloud, X, FileImage } from "lucide-react"

interface FileUploadProps {
  onFileSelect: (file: File) => void
}

export function FileUpload({ onFileSelect }: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      // Create local preview URL
      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)
      onFileSelect(file)
    }
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg'] },
    maxFiles: 1
  })

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPreview(null)
  }

  return (
    <Card className="border-dashed border-2 hover:bg-muted/50 transition-colors">
      <CardContent className="p-6">
        <div
          {...getRootProps()}
          className="flex flex-col items-center justify-center min-h-[200px] cursor-pointer text-center space-y-4"
        >
          <input {...getInputProps()} />
          
          {preview ? (
            <div className="relative w-full max-w-[300px] aspect-3/4 rounded-lg overflow-hidden border">
              <img src={preview} alt="Preview" className="object-cover w-full h-full" />
              <Button 
                variant="destructive" 
                size="icon" 
                className="absolute top-2 right-2 h-6 w-6 cursor-pointer"
                onClick={clearFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <div className="p-4 bg-muted rounded-full">
                <UploadCloud className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {isDragActive ? "Drop it here!" : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-muted-foreground">
                  JPG or PNG (Max 5MB)
                </p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}