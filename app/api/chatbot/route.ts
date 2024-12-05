"use server";
import { chatInstructions, GEMINI_API_KEY } from "@/app/constants";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(`${GEMINI_API_KEY}`);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: chatInstructions()});

export async function POST(req:NextRequest){
    try {
        const {prompt} = await req.json();
        const response = await model.generateContent(prompt);
        const result = response.response.text();
        console.log(result);
        return NextResponse.json({result:result});
    } catch (error) {
        console.log(error);
        return NextResponse.json({error:true});
    }
}