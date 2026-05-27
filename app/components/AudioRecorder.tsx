// app/components/AudioRecorder.tsx
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Mic,
  Pause,
  Play,
  Square,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  CircleAlert,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AudioRecorderProps {
  onRecordingComplete?: (audioBlob: Blob, duration: number) => void;
  maxDuration?: number;
}

export function AudioRecorder({
  onRecordingComplete,
  maxDuration = 300,
}: AudioRecorderProps) {
  const [recordingState, setRecordingState] = useState<
    "idle" | "recording" | "paused" | "completed"
  >("idle");
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [volume, setVolume] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPermissionGranted, setIsPermissionGranted] = useState<
    boolean | null
  >(null);

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isMountedRef = useRef(true);

  // Nettoyage
  const cleanup = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  // Vérifier la permission microphone
  useEffect(() => {
    let mounted = true;

    const checkPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        if (mounted) {
          stream.getTracks().forEach((track) => track.stop());
          setIsPermissionGranted(true);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setIsPermissionGranted(false);
          setError(
            "Permission microphone refusée. Veuillez autoriser l'accès au microphone.",
          );
        }
      }
    };

    checkPermission();

    return () => {
      mounted = false;
      cleanup();
    };
  }, [cleanup]);

  const stopRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;

    if (
      recorder &&
      (recorder.state === "recording" || recorder.state === "paused")
    ) {
      recorder.stop();
      setRecordingState("idle");

      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }

      toast({
        title: "Enregistrement terminé",
        description: "Vous pouvez écouter ou ré-enregistrer",
        variant: "success",
      });
    }
  }, [toast]);

  const startRecording = useCallback(async () => {
    try {
      setError(null);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Configurer la visualisation du volume
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      sourceRef.current =
        audioContextRef.current.createMediaStreamSource(stream);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

      const updateVolume = () => {
        if (!analyserRef.current || !animationFrameRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setVolume((prev) => [...prev.slice(-30), average]);
        animationFrameRef.current = requestAnimationFrame(updateVolume);
      };
      updateVolume();

      // Configurer l'enregistrement
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setAudioBlob(blob);
        setRecordingState("completed");

        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
        }
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorderRef.current.start(100);
      setRecordingState("recording");
      setDuration(0);

      timerIntervalRef.current = setInterval(() => {
        setDuration((prev) => {
          const newDuration = prev + 1;
          if (newDuration >= maxDuration) {
            stopRecording();
          }
          return newDuration;
        });
      }, 1000);

      toast({
        title: "Enregistrement démarré",
        description: "Parlez librement, votre audio est capturé",
        variant: "success",
      });
    } catch (err) {
      setError("Impossible d'accéder au microphone. Vérifiez vos permissions.");
      toast({
        title: "Erreur",
        description: "Impossible d'accéder au microphone",
        variant: "destructive",
      });
    }
  }, [maxDuration]);

  const pauseRecording = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.pause();
      setRecordingState("paused");
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      toast({
        title: "Enregistrement en pause",
        description: "Cliquez sur Reprendre pour continuer",
      });
    }
  }, []);

  const resumeRecording = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "paused"
    ) {
      mediaRecorderRef.current.resume();
      setRecordingState("recording");
      timerIntervalRef.current = setInterval(() => {
        setDuration((prev) => {
          const newDuration = prev + 1;
          if (newDuration >= maxDuration) {
            stopRecording();
          }
          return newDuration;
        });
      }, 1000);
      toast({
        title: "Enregistrement repris",
      });
    }
  }, [maxDuration]);

  const resetRecording = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setAudioBlob(null);
    setDuration(0);
    setVolume([]);
    setRecordingState("idle");
    setError(null);
    cleanup();
  }, [audioUrl, cleanup]);

  const submitRecording = useCallback(() => {
    if (audioBlob && onRecordingComplete) {
      onRecordingComplete(audioBlob, duration);
      toast({
        title: "Enregistrement soumis",
        description: "Traitement en cours...",
        variant: "success",
      });
      resetRecording();
    }
  }, [audioBlob, onRecordingComplete, duration, resetRecording]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getProgressPercentage = (): number => {
    return (duration / maxDuration) * 100;
  };

  const isNearLimit = duration > maxDuration * 0.9;

  const maxVolume = Math.max(...volume, 1);
  const averageVolume =
    volume.reduce((a, b) => a + b, 0) / (volume.length || 1);

  return (
    <div className="space-y-6">
      {/* État des permissions */}
      {isPermissionGranted === false && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <div className="flex-1">
              <p className="font-medium text-red-700 dark:text-red-400">
                Permission microphone requise
              </p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Zone d'enregistrement */}
      {recordingState !== "completed" &&
        !audioUrl &&
        isPermissionGranted !== false && (
          <div className="space-y-6">
            {/* Visualisation du volume */}
            {(recordingState === "recording" ||
              recordingState === "paused") && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    {recordingState === "recording" ? (
                      <>
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                        </span>
                        <span className="font-medium text-red-500">
                          Enregistrement en cours
                        </span>
                      </>
                    ) : (
                      <>
                        <Pause className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium text-yellow-500">
                          En pause
                        </span>
                      </>
                    )}
                  </span>
                  <Badge
                    variant={isNearLimit ? "destructive" : "secondary"}
                    className="font-mono"
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    {formatTime(duration)} / {formatTime(maxDuration)}
                  </Badge>
                </div>

                <Progress
                  value={getProgressPercentage()}
                  className={`h-2 ${isNearLimit ? "bg-red-500/20" : ""}`}
                />

                <div className="flex items-center justify-center gap-[2px] h-16">
                  {volume.slice(-30).map((level, idx) => {
                    const height = Math.max(4, (level / maxVolume) * 50);
                    const isActive = recordingState === "recording";
                    return (
                      <div
                        key={idx}
                        className="w-1 bg-primary transition-all duration-75 rounded-full"
                        style={{
                          height: isActive ? `${height}px` : "4px",
                          opacity: isActive ? 1 : 0.3,
                        }}
                      />
                    );
                  })}
                </div>

                {isNearLimit && recordingState === "recording" && (
                  <p className="text-center text-xs text-orange-500">
                    ⚠️ Limite de {formatTime(maxDuration)} bientôt atteinte
                  </p>
                )}
              </div>
            )}

            <div className="flex justify-center gap-3">
              {recordingState === "idle" && (
                <Button onClick={startRecording} size="lg" className="gap-2">
                  <Mic className="h-5 w-5" />
                  Démarrer l&apos;enregistrement
                </Button>
              )}

              {recordingState === "recording" && (
                <>
                  <Button onClick={pauseRecording} variant="outline" size="lg">
                    <Pause className="h-5 w-5 mr-2" />
                    Pause
                  </Button>
                  <Button
                    onClick={stopRecording}
                    variant="destructive"
                    size="lg"
                  >
                    <Square className="h-5 w-5 mr-2" />
                    Arrêter
                  </Button>
                </>
              )}

              {recordingState === "paused" && (
                <>
                  <Button onClick={resumeRecording} variant="default" size="lg">
                    <Play className="h-5 w-5 mr-2" />
                    Reprendre
                  </Button>
                  <Button
                    onClick={stopRecording}
                    variant="destructive"
                    size="lg"
                  >
                    <Square className="h-5 w-5 mr-2" />
                    Arrêter
                  </Button>
                </>
              )}
            </div>
          </div>
        )}

      {/* Aperçu de l'enregistrement terminé */}
      {audioUrl && recordingState === "completed" && (
        <div className="space-y-4">
          <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <div className="flex-1">
                <p className="font-medium text-green-700 dark:text-green-400">
                  Enregistrement terminé
                </p>
                <p className="text-xs text-muted-foreground">
                  Durée: {formatTime(duration)} - Intensité:{" "}
                  {Math.round(averageVolume)}%
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-background p-3">
              <audio controls src={audioUrl} className="w-full" />
            </div>

            <div className="flex justify-center gap-3 mt-4">
              <Button variant="outline" onClick={resetRecording}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Ré-enregistrer
              </Button>
              <Button onClick={submitRecording}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Utiliser cet enregistrement
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Erreur */}
      {error && recordingState !== "completed" && !audioUrl && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-center">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Conseils */}
      {recordingState === "idle" &&
        !audioUrl &&
        !error &&
        isPermissionGranted !== false && (
          <div className="text-center text-sm text-muted-foreground">
            <p className="flex items-center gap-2 justify-center">
              <CircleAlert className="h-4 w-4 text-yellow-500" /> Assurez-vous
              que votre microphone est connecté et fonctionnel
            </p>
            <p className="text-xs mt-1">
              L&apos;enregistrement s&apos;arrêtera automatiquement après{" "}
              {formatTime(maxDuration)}
            </p>
          </div>
        )}
    </div>
  );
}
