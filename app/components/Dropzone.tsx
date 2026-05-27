// app/components/Dropzone.tsx
"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

type UploadResult = {
  file: File;
  transcript: string;
  // compteRendu: string;
  raw: unknown;
};

interface DropzoneProps {
  onUpload: (data: UploadResult) => void;
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

  //   const handleUpload = async () => {
  //   if (!file) return;

  //   setIsUploading(true);
  //   setUploadProgress(5);

  //   try {
  //     // =========================
  //     // 1. UPLOAD
  //     // =========================
  //     const formData = new FormData();
  //     formData.append("file", file);

  //     const uploadRes = await fetch("/api/gladia/upload", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     setUploadProgress(25);

  //     if (!uploadRes.ok) {
  //       const errorData = await uploadRes.json();
  //       throw new Error(errorData.error || "Erreur upload");
  //     }

  //     const { audio_url } = await uploadRes.json();

  //     if (!audio_url) {
  //       throw new Error("audio_url manquant");
  //     }

  //     // =========================
  //     // 2. LANCER TRANSCRIPTION
  //     // =========================
  //     const transcriptRes = await fetch("/api/gladia/transcribe", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         audio_url,
  //         language: "fr",
  //       }),
  //     });

  //     setUploadProgress(50);

  //     if (!transcriptRes.ok) {
  //       const errorData = await transcriptRes.json();
  //       throw new Error(errorData.error || "Erreur transcription");
  //     }

  //     const transcriptData = await transcriptRes.json();

  //     const jobId = transcriptData?.id;

  //     if (!jobId) {
  //       throw new Error("ID de transcription manquant");
  //     }

  //     // =========================
  //     // 3. POLLING RESULTAT
  //     // =========================
  //     let status = "processing";
  //     let resultData: unknown = null;

  //     while (status === "processing") {
  //       await new Promise((r) => setTimeout(r, 2000));

  //       const resultRes = await fetch(`/api/gladia/result?id=${jobId}`);

  //       if (!resultRes.ok) {
  //         throw new Error("Erreur récupération résultat");
  //       }

  //       const result = await resultRes.json();

  //       status = result.status;
  //       resultData = result;

  //       console.log("Status:", status);

  //       // progression dynamique
  //       setUploadProgress((prev) => Math.min(prev + 5, 90));
  //     }

  //     // =========================
  //     // 4. EXTRACTION TEXTE
  //     // =========================
  //     const finalResult = resultData as {
  //       result?: {
  //         transcription?: {
  //           full_transcript?: string;
  //         };
  //       };
  //     };

  //     const text = finalResult?.result?.transcription?.full_transcript || "";

  //     setUploadProgress(100);

  //     // =========================
  //     // 5. CALLBACK
  //     // =========================
  //     onUpload({
  //       file,
  //       audioUrl: audio_url,
  //       transcript: text,
  //       raw: resultData,
  //     });
  //   } catch (error: unknown) {
  //     if (error instanceof Error) {
  //       console.error("Erreur:", error.message);
  //     } else {
  //       console.error("Erreur inconnue:", error);
  //     }
  //   } finally {
  //     setTimeout(() => {
  //       setIsUploading(false);
  //       setFile(null);
  //       setUploadProgress(0);
  //     }, 1200);
  //   }
  // };

  // OPENAI
  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(10);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/openai/transcribe", {
        method: "POST",
        body: formData,
      });

      setUploadProgress(70);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erreur transcription");
      }

      const data = await res.json();

      /**
       * data = { text: "..." }
       */
      const text = data.text || "";

      console.log("Transcript:", data);
      setUploadProgress(100);

      onUpload({
        file,
        transcript: text,
        raw: data,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("Erreur inconnue", error);
      }
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setFile(null);
        setUploadProgress(0);
      }, 1000);
    }
  };

  // Assemblyai
  // const handleUpload = async () => {
  //   if (!file) return;

  //   setIsUploading(true);
  //   setUploadProgress(10);

  //   try {
  //     const formData = new FormData();
  //     formData.append("file", file);

  //     // =========================
  //     // 1. Start transcription
  //     // =========================
  //     const res = await fetch("/api/assemblyai/transcribe", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     if (!res.ok) {
  //       throw new Error("Erreur démarrage transcription");
  //     }

  //     const { id } = await res.json();

  //     setUploadProgress(30);

  //     // =========================
  //     // 2. Polling
  //     // =========================
  //     let completed = false;

  //     while (!completed) {
  //       const statusRes = await fetch(`/api/assemblyai/status?id=${id}`);
  //       const statusData = await statusRes.json();

  //       console.log("Status:", statusData);

  //       if (statusData.status === "completed") {
  //         completed = true;

  //         setUploadProgress(90);

  //         onUpload({
  //           file,
  //           transcript: statusData.transcript,
  //           compteRendu: statusData.compteRendu,
  //           raw: statusData,
  //         });

  //         setUploadProgress(100);
  //       } else if (statusData.status === "error") {
  //         throw new Error(statusData.error || "Erreur transcription");
  //       }

  //       await new Promise((r) => setTimeout(r, 3000));
  //     }
  //   } catch (error) {
  //     console.error("UPLOAD ERROR:", error);
  //   } finally {
  //     setTimeout(() => {
  //       setIsUploading(false);
  //       setFile(null);
  //       setUploadProgress(0);
  //     }, 1500);
  //   }
  // };

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
