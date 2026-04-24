// app/components/LiveTranscription.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Mic } from "lucide-react";

interface LiveTranscriptionProps {
  isActive: boolean;
  onTranscriptUpdate: (text: string) => void;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
}

declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognition;
    SpeechRecognition: new () => SpeechRecognition;
  }
}

export function LiveTranscription({
  isActive,
  onTranscriptUpdate,
}: LiveTranscriptionProps) {
  const [segments, setSegments] = useState<
    { speaker: string; text: string; timestamp: string }[]
  >([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const finalTranscriptRef = useRef("");

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      const SpeechRecognitionConstructor =
        window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognitionConstructor();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "fr-FR";

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0].transcript;

          if (result.isFinal) {
            finalTranscriptRef.current += transcript + " ";
            // Simuler détection de locuteur
            const newSegment = {
              speaker: `Participant ${Math.floor(Math.random() * 3) + 1}`,
              text: transcript,
              timestamp: new Date().toLocaleTimeString(),
            };
            setSegments((prev) => [...prev, newSegment]);
            onTranscriptUpdate(finalTranscriptRef.current);
          } else {
            interimTranscript += transcript;
          }
        }
      };

      recognitionRef.current.onerror = (event: Event) => {
        console.error("Erreur reconnaissance:", event);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscriptUpdate]);

  useEffect(() => {
    if (isActive && recognitionRef.current) {
      recognitionRef.current.start();
    } else if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, [isActive]);

  return (
    <div className="space-y-4 h-[500px] overflow-y-auto">
      {segments.length === 0 ? (
        <div className="text-center text-muted-foreground py-20">
          <Mic className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>La transcription apparaîtra ici en temps réel</p>
          <p className="text-sm">
            Démarrez l&apos;enregistrement pour commencer
          </p>
        </div>
      ) : (
        segments.map((segment, idx) => (
          <div key={idx} className="flex gap-3 p-3 rounded-lg bg-muted/30">
            <div className="font-semibold text-sm min-w-[100px]">
              {segment.speaker}
              <span className="text-xs text-muted-foreground ml-2">
                {segment.timestamp}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm">{segment.text}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
