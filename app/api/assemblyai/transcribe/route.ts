import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.ASSEMBLYAI_API_KEY!;
const BASE_URL = "https://api.assemblyai.com/v2";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
    }

    // 🔹 Conversion File → Buffer (IMPORTANT)
    const buffer = Buffer.from(await file.arrayBuffer());

    // =========================
    // 1. Upload fichier
    // =========================
    const uploadRes = await fetch(`${BASE_URL}/upload`, {
      method: "POST",
      headers: {
        authorization: API_KEY,
      },
      body: buffer,
    });

    if (!uploadRes.ok) {
      throw new Error("Erreur upload AssemblyAI");
    }

    const { upload_url } = await uploadRes.json();

    // =========================
    // 2. Lancer transcription
    // =========================
    const transcriptionPrompt = `
Mandatory: Transcrire intégralement et fidèlement l'audio.

Toujours :
- Respecter la langue parlée
- Ajouter une ponctuation correcte
- Structurer les phrases clairement
- Conserver les noms propres et termes techniques
- Identifier les intervenants si possible

Important :
- Ne pas résumer
- Ne pas reformuler
- Ne pas traduire
`;

    const transcriptRes = await fetch(`${BASE_URL}/transcript`, {
      method: "POST",
      headers: {
        authorization: API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        audio_url: upload_url,
        speech_models: ["universal-3-pro", "universal-2"],
        speaker_labels: true,
        prompt: transcriptionPrompt,
      }),
    });

    const data = await transcriptRes.json();

    console.log("TRANSCRIBE DATA:", data);

    if (!transcriptRes.ok) {
      throw new Error(data.error || "Erreur transcription");
    }

    return NextResponse.json({ id: data.id });
  } catch (error: unknown) {
    console.error("TRANSCRIBE ERROR:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error" },
      { status: 500 },
    );
  }
}
