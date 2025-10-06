import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini client with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    // Load the model VÄXLA MELLAN PRO OCH FLASH  HÄR
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    // Generate content
    const result = await model.generateContent(prompt);

    const text = result.response.text();

    return NextResponse.json({ text });
  } catch (error: unknown) {
    console.error("Gemini API Error:", error);

    const message = error instanceof Error ? error.message : String(error);

    return NextResponse.json(
      { error: "Failed to generate content", details: message },
      { status: 500 }
    );
  }
}


