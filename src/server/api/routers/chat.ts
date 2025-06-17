import { z } from "zod";
import { env } from "@/env";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import axios from "axios";
import { fetchChatCompletion } from "@/models/service";
import { DEFAULT_MODEL_ID } from "@/models/constants";


interface ChatCompletionResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export const chatRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ message: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.message}`,
      };
    }),
  createChat: protectedProcedure
    .input(z.object({ message: z.string(), model: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user) {
        return {
          message: "Unauthorised access",
          success: false,
        };
      }

      try {

        const response = await fetchChatCompletion({
          modelId: input.model ?? DEFAULT_MODEL_ID,
          messages: [{ role: "user", content: input.message }],
          stream: false,
          fallbackToDefaultModel: true,
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = (await response.json()) as ChatCompletionResponse;
        const message = data.choices?.[0]?.message?.content ?? "No response";

        return {
          message,
          success: true,
        };
      } catch (error) {
        console.log(error);
        return {
          message: "Something went wrong. Please try with a different model.",
          success: false,
        };
      }
    }),
});
