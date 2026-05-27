import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
    }

    const openaiForm = new FormData();
    openaiForm.append("file", file);

    // 🔥 PROMPT MÉTIER (important)
    openaiForm.append(
      "prompt",
      `Transcris cet audio sous forme de compte rendu professionnel structuré :
      
- Titre de la réunion
- Participants (si détectables)
- Résumé exécutif
- Points abordés
- Décisions prises
- Actions à mener (avec responsables si possible)

Le texte doit être clair, structuré et directement exploitable.`,
    );

    openaiForm.append("model", "gpt-4o-transcribe");

    const response = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_KEY!}`,
        },
        body: openaiForm,
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: errorText },
        { status: response.status },
      );
    }

    const data = await response.json();

    /**
     * Exemple réponse :
     * {
     *   text: "..."
     * }
     */

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur serveur", details: error },
      { status: 500 },
    );
  }
}
