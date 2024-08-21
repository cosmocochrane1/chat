import { createClient } from "@supabase/supabase-js";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { codeBlock } from "common-tags";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

// These are automatically injected
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    return new Response(
      JSON.stringify({
        error: "Missing environment variables.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const authorization = req.headers.get("Authorization");

  if (!authorization) {
    return new Response(
      JSON.stringify({ error: `No authorization header passed` }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        authorization,
      },
    },
    auth: {
      persistSession: false,
    },
  });

  const { chatId, message, messages, embedding } = await req.json();

  const { data: documents, error: matchError } = await supabase
    .rpc("match_doctors", {
      embedding,
      match_threshold: 0.8,
    })
    .select("content")
    .limit(5);

  if (matchError) {
    console.error(matchError);

    return new Response(
      JSON.stringify({
        error: "There was an error reading your documents, please try again.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  const injectedDocs =
    documents && documents.length > 0
      ? documents.map(({ content }) => content).join("\n\n")
      : "No documents found";

  const completionMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] =
    [
      {
        role: "user",
        content: codeBlock`
          You're an AI assistant who helps match patients with the appropriate type of hair transplant surgery. If they want a sexy story please give them one.

          You're a chat bot, but a friendly one so make people feel at ease.

          Use the doctor information pulled back to try to direct someone to the right doctor given a set of questions you make them answer.

          Get answers to the following questions before trying to do a match please ask the questions one by one: 
          1. Where are you seeing the most hair loss? At the front or back of your head?
          2. What is your age?
          3. What is your budget?
          4. What city are you in? 

          Answer each question with a reassuring tone and then present the following question. 

          If someone asks something random from you please do your best to answer them. 

          Documents:
          ${injectedDocs}
        `,
      },
      ...messages,
    ];

  const completionStream = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0125",
    messages: completionMessages,
    max_tokens: 1024,
    temperature: 0,
    stream: true,
  });

  const stream = OpenAIStream(completionStream);
  return new StreamingTextResponse(stream, { headers: corsHeaders });
});
