import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
  
export const chatRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ message: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.message}`,
      };
    }),
  createChat: protectedProcedure.input(z.object({ message: z.string() })).mutation(async ({ ctx, input }) => {

    return {
      message: input.message,
    };
  }),
});
