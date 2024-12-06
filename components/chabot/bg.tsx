"use client"

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import cross from "@/assets/cross.svg"
import mic from '@/assets/mic.svg'
import { Input } from "../ui/input";
import send from '@/assets/send.svg'
import Chat from "./chat";
import axios from "axios";
import { useChatContext } from "@/context/chatContext";
import SpeechRecognition , {useSpeechRecognition } from 'react-speech-recognition'


export default function BG({close}:{close:React.Dispatch<React.SetStateAction<boolean>>}){
    const [prompt , setPrompt] = useState<string>('');
    const {history  , setHistory} = useChatContext();
    const chatRef = useRef<HTMLDivElement|null>(null);
    const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

    function handleSpeech(){
        if(!browserSupportsSpeechRecognition){
            console.log('Your browser does not support speech recognition');
            return
        }
        if(listening){
            console.log('stop');
            SpeechRecognition.stopListening;
            setPrompt(transcript);
            resetTranscript();
            return;
        }
        console.log('start');
        SpeechRecognition.startListening;
    }

    useEffect(()=>{
        if(chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
    },[history])
    
    
    useEffect(()=>{
        const btn = document.getElementById(`send-btn`);
        function fnSend(event:KeyboardEvent){
            if(btn && event.key === 'enter') {
                console.log('enter')
                btn.click();}
        }
        document.addEventListener("keypress" ,fnSend);
        return ()=>document.removeEventListener("keypress",fnSend);
    },[prompt])

    async function apiCall() {
        if(prompt.length === 0) return
        const chat = {text:prompt , prompt:true};
        setPrompt('');
        setHistory([...history , chat , {text:'...',prompt:false}]);
        try {
            const response = await axios.post('http://localhost:3000/api/chatbot' , {prompt} , {
                headers: {
                'Content-Type': 'application/json',
                }
            })
            if(response.data.error) throw new Error();
            const result = {text:response.data.result , prompt:false};
            setHistory([...history , chat , result]);
        }catch (error) {
            console.log(`some error in chatbot api call\n${error}`);
        }
    }

    return(
        <div className="absolute bottom-10 right-10 flex justify-between rounded-2xl flex-col w-[400px] h-[40vw] bg-white">

            <div className=" w-[100%] h-[10%] p-2 flex justify-between items-start top-0" 
            style={{background:'linear-gradient(to left , #5C5CFE , #E94986)',borderTopLeftRadius:'1rem',borderTopRightRadius:'1rem'}}>
                <div className="text-xl font-bold flex items-center h-full" style={{color:'white'}}>MathBOT</div>
                <Image src={cross} alt="" width={20} height={20} onClick={()=>close(false)} className="cursor-pointer"/>
            </div>

            <div className="h-[30vw] overflow-y-hidden relative">
                <div ref={chatRef} className="h-[30vw] relative" style={{overflowY:'scroll'}}>
                    <div className="px-2" style={{height:'fit-content'}}>
                        {history?.length !== 0 &&
                            history.map((chat, index) => {
                                return (
                                    <div key={index} className="w-[100%] flex py-1"
                                    style={{ justifyContent:chat.prompt?'right':'left'}}>
                                        <Chat chat={chat} index={index}/>
                                    </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            <div className="w-[100%] px-2 py-4 flex" style={{background:'linear-gradient(to left , #5C5CFE , #E94986)',
            borderBottomLeftRadius:'1rem',borderBottomRightRadius:'1rem'}}>
                <Image src={mic} alt="" width={30} height={30} onClick={handleSpeech}/>
                <Input type="text" value={prompt} placeholder="Enter your Prompts" onChange={(e)=>setPrompt(e.target.value)}/>
                <Image src={send} alt="" width={30} height={30} id="send-btn" className="cursor-pointer"
                style={{transform:'rotateZ(-60deg)',marginLeft:'10px'}} onClick={apiCall}/>
            </div>
        </div>
    )
}