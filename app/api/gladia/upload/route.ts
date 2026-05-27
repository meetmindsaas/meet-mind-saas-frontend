import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier fourni" },
        { status: 400 },
      );
    }

    const gladiaForm = new FormData();
    gladiaForm.append("audio", file);

    const response = await fetch("https://api.gladia.io/v2/upload", {
      method: "POST",
      headers: {
        "x-gladia-key": process.env.GLADIA_API_KEY!, // ⚠️ côté serveur uniquement
      },
      body: gladiaForm,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur serveur", details: error },
      { status: 500 },
    );
  }
}
