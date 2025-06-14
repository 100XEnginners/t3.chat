import { z } from "zod";
import { env } from "@/env";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import axios from "axios";
  
export const chatRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ message: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.message}`,
      };
    }),
  createChat: protectedProcedure.input(z.object({ message: z.string(), model: z.string() })).mutation(async ({ ctx, input }) => {
    if(!ctx.session.user){
      return {
        message: "Unauthorised access",
        success: false,
      }
    }
    console.log(input, env.TYPEGPT_API_URL, env.TYPEGPT_API_KEY)
    try {
      const response = await axios.post(
        "https://fast.typegpt.net/v1/chat/completions", // Add /chat/completions
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: input.message }],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${env.TYPEGPT_API_KEY}`,
          },
        }
      );
      console.log(response.data.choices[0].message.content)

      return {
        message: response.data.choices[0].message.content,
        success: true,
      }
    } catch (error) {
      console.log(error)
      return {
        message: "Something went wrong",
        success: false,
      }
    }
  }),
});
