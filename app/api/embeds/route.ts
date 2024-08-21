// pages/api/embed.js
import { pipeline } from "@xenova/transformers";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { usePipeline } from "@/lib/hooks/use-pipeline";

/**
 * Transform string content into 306 dimesnion vector array
 */
async function loadPipeline() {
  const { pipeline } = await import("@xenova/transformers");
  return { pipeline };
}

export const config = {
  maxDuration: 300,
};

export async function GET(
  request: NextApiRequest,
  NextResponse: NextApiResponse
) {
  const { pipeline } = await loadPipeline();
  const cache_dir = "/tmp/";
  const generateEmbedding = await pipeline(
    "feature-extraction",
    "Supabase/gte-small",
    { cache_dir }
  );

  try {
    const { content } = request.query;
    const output = await generateEmbedding(content!, {
      pooling: "mean",
      normalize: true,
    });
    const embedding = JSON.stringify(Array.from(output.data));

    return NextResponse.json(embedding);
  } catch (error) {

    return NextResponse.json({ error: error });
  }
}

// Add the PUT method to your existing bots function
export default async function embedding(
  request: NextApiRequest,
  NextResponse: NextApiResponse
) {
  switch (request.method) {
    case "GET":
      return await GET(request, NextResponse);

    default:
      return NextResponse.json({ error: "fuck" });
  }
}
