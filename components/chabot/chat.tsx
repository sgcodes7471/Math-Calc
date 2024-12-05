'use client'

import { Chats } from "@/app/constants"
import Image from "next/image"
import mic from '@/assets/mic.svg'
import mute from '@/assets/mute.svg'
import { useEffect, useState } from "react"

export default function Chat({chat,index}:{chat:Chats,index:number}){

    const [talking , setTalking] = useState<boolean>(false)

    function handleVoiceClick(){
        if(talking){
            setTalking(false);
            return
        }
        voice();
    }

    function voice(){
        if("speechSynthesis" in window){
            let speech = new SpeechSynthesisUtterance(chat.text);
            setTalking(true);
            speechSynthesis.speak(speech);
            speech.onend=()=>setTalking(false);
        }else console.log('Your Browser does not support Voice assistance');
    }

    useEffect(()=>{
        console.log(talking)
        if(!talking) speechSynthesis.cancel();
    },[talking])

    return(
        <div className="w-[60%] rounded-xl p-2 font-medium flex items-center text-md" 
        style={{background:chat.prompt?'#bcbcbc':'linear-gradient(to left , #5C5CFE , #E94986)',
        textAlign:chat.prompt?'right':'left',color:chat.prompt?'#000':'#fff'}}>
            <span>
            {!chat.prompt && <Image src={!talking?mic:mute} alt="" width={20} height={20} 
            className="inline mr-2 cursor-pointer" id={`voice-btn-${index}`} onClick={handleVoiceClick}/>} 
            {chat.text}
            </span>
        </div>
    )
}