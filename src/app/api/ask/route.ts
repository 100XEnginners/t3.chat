import { env } from "@/env";
import { auth } from "@/server/auth";
import { fetchChatCompletion } from "@/models/service";
import { DEFAULT_MODEL_ID, getModelById } from "@/models/constants";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface TypeGPTPayload {
  messages: ChatMessage[];
  model?: string;
}

interface TypeGPTErrorResponse {
  error?: {
    message: string;
    type: string;
    code?: string;
  };
  status?: number;
  message?: string;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const authResult = await auth();
    if (!authResult?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { messages, model = DEFAULT_MODEL_ID } =
      (await req.json()) as TypeGPTPayload;

    const modelInfo = getModelById(model);
    if (!modelInfo) {
      return new Response(
        JSON.stringify({ error: `Model ${model} not supported` }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const headers = new Headers();
    headers.set("Content-Type", "text/event-stream");
    headers.set("Cache-Control", "no-cache");
    headers.set("Connection", "keep-alive");

    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();

    void (async () => {
      try {
        const response = await fetchChatCompletion({
          modelId: model,
          messages,
          stream: true,
          fallbackToDefaultModel: true,
        });

        if (!response.ok) {
          const errorData = (await response.json()) as TypeGPTErrorResponse;
          const errorMessage = `API error: ${response.status} ${JSON.stringify(errorData)}`;
          const encoder = new TextEncoder();
          await writer.write(
            encoder.encode(
              `data: ${JSON.stringify({ error: errorMessage })}\n\n`,
            ),
          );
          await writer.close();
          return;
        }

        const reader = response.body?.getReader();
        if (!reader) {
          const encoder = new TextEncoder();
          await writer.write(
            encoder.encode(
              `data: ${JSON.stringify({ error: "No reader available from API" })}\n\n`,
            ),
          );
          await writer.close();
          return;
        }

        const encoder = new TextEncoder();
        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              await writer.write(encoder.encode("data: [DONE]\n\n"));
              await writer.close();
              break;
            }

            await writer.write(value);
          }
        } catch (error) {
          console.error("Error processing stream:", error);
          await writer.abort(error as Error);
        }
      } catch (error) {
        console.error("Error in chat API:", error);
        const encoder = new TextEncoder();
        await writer.write(
          encoder.encode(
            `data: ${JSON.stringify({ error: "Failed to communicate with API" })}\n\n`,
          ),
        );
        await writer.close();
      }
    })();


    return new Response(readable, { headers });
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
