export async function POST(req: Request) {
  const { audio_url } = await req.json();

  const response = await fetch("https://api.gladia.io/v2/pre-recorded", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-gladia-key": process.env.GLADIA_API_KEY!,
    },
    body: JSON.stringify({
      audio_url,
      language: "fr",
    }),
  });

  const data = await response.json();

  return Response.json(data);
}
