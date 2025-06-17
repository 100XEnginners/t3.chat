import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { z } from "zod";

export const chatRouter = createTRPCRouter({
  createChat: protectedProcedure
    .mutation(async ({ ctx }) => {
      if (!ctx.session.user) {
        return {
          message: "Unauthorised access",
          success: false,
        };
      }

      try {
        const newChat = await db.chat.create({
          data:{
            userId: ctx.session.user.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

        return {
          message: "Chat created successfully",
          success: true,
          chatId: newChat.id,
        };
      } catch (error) {
        console.log(error);
        return {
          message: "Something went wrong. Please try again.",
          success: false,
        };
      }
    }),

  getAllChats: protectedProcedure.query(async ({ ctx }) => {

    if (!ctx.session.user) {
      return {
        message: "Unauthorised access",
        success: false,
        chats: [],
      };
    }

    const chats = await db.chat.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        id: true,
        messages: {
          select: {
            content: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return chats;
  }),

  getChatMessages: protectedProcedure
    .input(z.object({
      chatId: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      if (!ctx.session.user) {
        return {
          message: "Unauthorised access",
          success: false,
          messages: [],
        };
      }

      try {
        // Verify the chat belongs to the user
        const chat = await db.chat.findFirst({
          where: {
            id: input.chatId,
            userId: ctx.session.user.id,
          },
          include: {
            messages: {
              orderBy: {
                createdAt: "asc",
              },
            },
          },
        });

        if (!chat) {
          return {
            message: "Chat not found or access denied",
            success: false,
            messages: [],
          };
        }

        return {
          message: "Messages retrieved successfully",
          success: true,
          messages: chat.messages.map((message) => ({
            id: message.id,
            content: message.content,
            role: message.role,
            createdAt: message.createdAt,
          })),
        };
      } catch (error) {
        console.error("Error getting messages:", error);
        return {
          message: "Something went wrong. Please try again.",
          success: false,
          messages: [],
        };
      }
    }),

  saveMessage: protectedProcedure
    .input(z.object({
      chatId: z.string(),
      content: z.string(),
      role: z.enum(["USER", "ASSISTANT"]),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user) {
        return {
          message: "Unauthorised access",
          success: false,
        };
      }

      try {
        // Verify the chat belongs to the user
        const chat = await db.chat.findFirst({
          where: {
            id: input.chatId,
            userId: ctx.session.user.id,
          },
        });

        if (!chat) {
          return {
            message: "Chat not found or access denied",
            success: false,
          };
        }

        const message = await db.message.create({
          data: {
            chatId: input.chatId,
            content: input.content,
            role: input.role,
          },
        });

        // Update chat's updatedAt timestamp
        await db.chat.update({
          where: { id: input.chatId },
          data: { updatedAt: new Date() },
        });

        return {
          message: "Message saved successfully",
          success: true,
          messageId: message.id,
        };
      } catch (error) {
        console.error("Error saving message:", error);
        return {
          message: "Something went wrong. Please try again.",
          success: false,
        };
      }
    }),
});
