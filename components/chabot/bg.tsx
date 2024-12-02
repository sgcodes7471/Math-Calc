"use client"

import Image from "next/image";
import React, { useEffect, useState } from "react";
import cross from "@/assets/cross.svg"
import { Input } from "../ui/input";

export default function BG({close}:{close:React.Dispatch<React.SetStateAction<boolean>>}){
    const [prompt , setPrompt] = useState<string|null>('');
    useEffect(()=>{
        console.log(prompt)
    },[prompt])
    return(
        <div className="absolute bottom-10 right-10 flex rounded-2xl flex-col w-[20vw] h-[40vw] bg-white">

            <div className=" w-[100%] h-[10%] p-2 flex justify-between items-start top-0" 
            style={{background:'linear-gradient(to left , #5C5CFE , #E94986)',borderTopLeftRadius:'1rem',borderTopRightRadius:'1rem'}}>
                <div className="text-xl font-bold flex items-center h-full" style={{color:'white'}}>MathBOT</div>
                <Image src={cross} alt="" width={20} height={20} onClick={()=>close(false)}/>
            </div>

            <div className="fixed bottom-0 mb-10 w-[20vw] px-2 py-4" style={{background:'linear-gradient(to left , #5C5CFE , #E94986)'}}>
                <Input type="text" placeholder="Enter your Prompts" onChange={(e)=>setPrompt(e.target.value)}/>
            </div>
        </div>
    )
}