import { NextRequest, NextResponse } from "next/server";
import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { auth } from "@/server/auth";
import { db } from "@/server/db";

const generatePrompt = (userQuery: string) => {
    return `You are an chatbot which tells answers to user as per their query and you are an helpful assistant who assists user into their query, ALways answers user query in the markdown when asked for code or explaining something but for some short answers you may also avoid it , make sure you dont mess up while generating markdown , suppose you have to highlight some words then dont use code block instaed use backtics to get it highlioghted and please remeber other such details , User query is : ${userQuery}`
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return NextResponse.json(
            { error: "No messages provided" },
            { status: 400 }
        );
    }
    const userQuery = messages[messages.length - 1].content;

    const ragPrompt = generatePrompt(userQuery);

    // Stream the response using Gemini
    const result = streamText({
        model: google("gemini-2.0-flash"),
        system: ragPrompt,
        messages,
    });

    // Return the streaming response
    return result.toDataStreamResponse();
}