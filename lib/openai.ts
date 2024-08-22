import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_SECRET_KEY, // This is the default and can be omitted
});

export default openai;
