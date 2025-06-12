import { NextRequest, NextResponse } from "next/server";

import { headers } from "next/headers";
import { auth } from "@/server/auth";
import { db } from "@/server/db";

export async function POST(req: NextRequest) {
    try {
        const { query } = await req.json()

        const session = await auth()
        if (!session) {
            return NextResponse.json({ message: "Unauthorised access", success: false }, { status: 400 });
        }

        const chat = await db.chat.create({
            data: {
                userId: session.user.id,
            }
        })

        // if query then please add the entry in the messages table

        if (query) {
            await db.message.create({
                data: {
                    chatId: chat.id,
                    content: query,
                    role: 'user',
                    createdAt: new Date(),
                },
            });
        }
        console.log(chat.id)
        return NextResponse.json({ chatId: chat.id, success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            message: "Failed to create  + " + error,
            success: false
        }, { status: 200 });
    }

}
