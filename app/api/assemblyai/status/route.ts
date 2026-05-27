import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.ASSEMBLYAI_API_KEY!;
const BASE_URL = "https://api.assemblyai.com/v2";

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    const res = await fetch(`${BASE_URL}/transcript/${id}`, {
      headers: { authorization: API_KEY },
    });

    const transcript = await res.json();

    if (transcript.status === "completed") {
      const text = transcript.text?.trim();

      // =========================
      // Prompt compte rendu FR
      // =========================
      const compteRenduPrompt = `
Tu es un expert en rédaction de comptes rendus professionnels.

Respecte STRICTEMENT ce format :

## Compte Rendu

- Résumé :
- Points clés discutés :
- Décisions prises :
- Actions à mener :
- Prochaines étapes :

Contraintes :
- Ne pas inventer
- Être clair et structuré
`;

      const llmRes = await fetch(
        "https://llm-gateway.assemblyai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            authorization: API_KEY,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-6",
            messages: [
              {
                role: "user",
                content: `${compteRenduPrompt}

Transcription:
${text}`,
              },
            ],
            max_tokens: 2000,
          }),
        },
      );

      const llmData = await llmRes.json();

      return NextResponse.json({
        status: "completed",
        transcript: text,
        compteRendu: llmData.choices?.[0]?.message?.content || "",
      });
    }

    return NextResponse.json(transcript);
  } catch (error: unknown) {
    console.error("STATUS ERROR:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error" },
      { status: 500 },
    );
  }
}
