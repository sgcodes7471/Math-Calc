import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { GEMINI_API_KEY, fnPrompt } from "@/app/constants";

const genAI = new GoogleGenerativeAI(`${GEMINI_API_KEY}`);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export interface Answer { 
    expr?:string,
    result?:string,
    assign?:boolean
}
 
export async function POST(req:NextRequest){
    try {
        const data = await req.json();
        const prompt:string = fnPrompt(data.dictOfVars);
        const base64Image = data.image;
        const base64Data = base64Image.split(",")[1];
        const response = await model.generateContent([prompt,base64Data]);
        const r = response.response.text()
        const r2 = r.slice(7,r.length-4)
        const answers = JSON.parse(r2)
        answers.forEach((answer:Answer) => {
            if(!(answer.assign)) answer.assign = false;
            else answer.assign = true; 
        });
        console.log(answers);
        return NextResponse.json({answers:answers})
    } catch (error) {
        console.log(`Post Error\n${error}`);
        return NextResponse.json({error:true})
    }
}