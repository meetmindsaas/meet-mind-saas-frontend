// app/components/Dropzone.tsx
"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface DropzoneProps {
  onUpload: (file: File) => void;
}

export function Dropzone({ onUpload }: DropzoneProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "audio/*": [".mp3", ".wav", ".m4a"],
      "video/*": [".mp4", ".mov"],
    },
    maxSize: 500 * 1024 * 1024, // 500MB
    multiple: false,
  });

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    // Simuler upload
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setUploadProgress(i);
    }
    onUpload(file);
    setTimeout(() => {
      setIsUploading(false);
      setFile(null);
      setUploadProgress(0);
    }, 1000);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"}
          ${isUploading ? "pointer-events-none opacity-50" : ""}`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="h-12 w-12 mx-auto text-muted-foreground" />
        {isDragActive ? (
          <p className="mt-2 text-sm">Déposez le fichier ici...</p>
        ) : (
          <div>
            <p className="mt-2 text-sm">
              Glissez-déposez un fichier, ou{" "}
              <span className="text-primary">parcourez</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              MP3, WAV, M4A, MP4, MOV jusqu&apos;à 500MB
            </p>
          </div>
        )}
      </div>

      {file && (
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <File className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            {!isUploading && (
              <Button variant="ghost" size="icon" onClick={() => setFile(null)}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {isUploading && (
            <div className="mt-4 space-y-2">
              <Progress value={uploadProgress} />
              <p className="text-xs text-muted-foreground text-center">
                {uploadProgress}% - Upload et transcription en cours...
              </p>
            </div>
          )}
          {!isUploading && (
            <Button onClick={handleUpload} className="w-full mt-4">
              Uploader et générer le CR
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
