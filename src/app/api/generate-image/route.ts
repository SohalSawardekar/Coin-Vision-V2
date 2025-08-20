export const runtime = "edge"; // optional

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const response = await fetch("https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    if (!response.ok) {
      const error = await response.text();
      return new Response(JSON.stringify({ error }), { status: 500 });
    }

    const blob = await response.blob();
    const buffer = await blob.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const imageUrl = `data:image/png;base64,${base64}`;

    return new Response(JSON.stringify({ imageUrl }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Something went wrong." }), { status: 500 });
  }
}

