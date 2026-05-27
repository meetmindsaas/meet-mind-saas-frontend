import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id manquant" }, { status: 400 });
  }

  const response = await fetch(`https://api.gladia.io/v2/pre-recorded/${id}`, {
    method: "GET",
    headers: {
      "x-gladia-key": process.env.GLADIA_API_KEY!,
    },
  });

  const data = await response.json();

  return NextResponse.json(data, { status: response.status });
}
