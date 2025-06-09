import { z } from "zod";
import OpenAI from "openai";
import { env } from "@/env";

console.log(env.OPENAI_API_KEY);
const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export const chatWithLLM = async (message: string) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: message }],
  });
  return response.choices[0]?.message.content ?? "No response from LLM";
};