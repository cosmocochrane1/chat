import { createClient } from "@supabase/supabase-js";
const model = new Supabase.ai.Session("gte-small");

// These are automatically injected
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

Deno.serve(async (req) => {
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

  //This is creating the embedding
  const { id, combinedString } = await req.json();
  const content = combinedString;
  const output = (await model.run(content, {
    mean_pool: true,
    normalize: true,
  })) as number[];

  const embedding = JSON.stringify(output);

  const { error } = await supabase
    .from("doctors")
    .update({
      embedding: embedding,
    })
    .eq("id", id);

  if (error) {
    console.error(`Failed to save embedding on doctors table with id ${id}`);
    return new Response(JSON.stringify({ error: "Failed to save embedding" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(null, {
    status: 204,
    headers: { "Content-Type": "application/json" },
  });
});
