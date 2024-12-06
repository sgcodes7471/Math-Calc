'use client'

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import {COLORS} from './constants'
import { Button } from "@/components/ui/button";
import ColorBtn from "@/components/colorBtn";
import axios from "axios";
import Draggable from "@/components/draggable";
import bot from "@/assets/bot.svg"
import BG from "@/components/chabot/bg";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

interface Response {
    expr:string;
    result:string;
    assign:boolean;
}

interface GeneratedResult {
    expression:string;
    answer:string;
}

export default function Home(){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing , setIsDrawing] = useState(false);
    const [color , setColor]=useState('rgb(255,255,255)');
    const [reset , setReset] = useState<boolean>(false);
    const [result , setResult] = useState<GeneratedResult>();
    const [dictOfVars , setDictOfVars] = useState({});
    const [latexExpression , setLatexExpression] = useState<Array<string>>([]);
    const [botOpen , setBotOpen] = useState<boolean>(false);
    const session = useSession();
    const router = useRouter();

    async function handleLogout() {
        router.replace('/login');
        await signOut({redirect:false});
    }

    useEffect(()=>{
        if(reset){
            resetCanvas();
            setLatexExpression([]);
            setResult(undefined);
            setDictOfVars({});
            setReset(false);
        }
    },[reset])

    useEffect(()=>{ 
        if(latexExpression.length>0 && window.MathJax){
            setTimeout(()=>{
                window.MathJax.Hub.Queue(["Typeset",window.MathJax.Hub]);
            },0)
        }
    },[latexExpression])

    const sendData = async  ()=>{
        const canvas = canvasRef.current;
        if(canvas){
            try {
              const response = await axios.post(`http://localhost:3000/api/calculate`,{
                      image:canvas.toDataURL('/image/png'),
                      dictOfVars:dictOfVars
              },{ headers: {
                  'Content-Type': 'application/json',
              }})
              const data = response.data;
              const answers = data?.answers;
              console.log(answers);
              answers.forEach((answer:Response) => {
                if(answer.assign) 
                    setDictOfVars({
                ...dictOfVars,[data.expr]:data.result})
              });
              const ctx = canvas.getContext('2d');
            const imageData = ctx!.getImageData(0,0,canvas.width,canvas.height);
            let minX = canvas.width , minY=canvas.height, maxX=0,maxY=0;
            for (let y = 0; y < canvas.height; y++) {
                for (let x = 0; x < canvas.width; x++) {
                    const i = (y * canvas.width + x) * 4;
                    if (imageData.data[i + 3] > 0) { 
                        minX = Math.min(minX, x);
                        minY = Math.min(minY, y);
                        maxX = Math.max(maxX, x);
                        maxY = Math.max(maxY, y);
                    }
                }
            }
            answers.forEach((data:Response) => {
                setTimeout(() => {
                    setResult({
                        expression: data.expr,
                        answer: data.result,
                    });
                }, 1000);
            });
            } catch (error) {
              console.log(`Sending Error:${error}`)
            }
        }
    }



    useEffect(()=>{
        if(result){
            renderLatextToCanvas(result.expression , result.answer);
        }
    },[result])

    const renderLatextToCanvas=(expression:string , answer:string )=>{
        const latex = `${expression} : ${answer}`;
        setLatexExpression([...latexExpression,latex]);
        const canvas = canvasRef.current;
        if(canvas){
            const ctx = canvas.getContext('2d');
            if(ctx){
                ctx.clearRect(0,0,canvas.width ,canvas.height);
            }
        }
    }

    const resetCanvas= ()=>{
        const canvas = canvasRef.current;
        if(canvas){
            const ctx = canvas.getContext('2d');
            if(ctx){
                ctx.clearRect(0,0,canvas.width , canvas.height );
            }
        }
    }

    useEffect(()=>{
        const canvas = canvasRef.current;
        if(canvas){
            const ctx = canvas.getContext('2d');
            if(ctx){
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight - canvas.offsetTop;
                ctx.lineCap = 'round';
                ctx.lineWidth = 3;
            }
        }
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/config/TeX-MML-AM_CHTML.js" integrity="sha512-sSiFmRCsRZQ0GzQp9OJedvfgVoUIC9YzvssYpoL6smxpXHQuPhB1bmbPIxBOXdzVu4/1mgZbxeMaKefjpd4suQ==" crossorigin="anonymous" referrerpolicy="no-referrer'
        script.async = true;
        document.head.appendChild(script);

        script.onload = ()=>{
            window.MathJax.Hub.Config({
                tex2jax:{inlineMath:[['$','$'],['\\(','\\)']]}
            })
        }

        return ()=>{
            document.head.removeChild(script);
        }
    },[])

    const startDrawing = (e:React.MouseEvent<HTMLCanvasElement>)=>{
        const canvas = canvasRef.current;
        if(canvas) {
            canvas.style.background='black';
            const ctx = canvas.getContext('2d');
            if(ctx){
                ctx.beginPath();
                ctx.moveTo(e.nativeEvent.offsetX , e.nativeEvent.offsetY )
                setIsDrawing(true);
            }
        }
    }

    const stopDrawing= ()=>{
        setIsDrawing(false)
    }

    const draw = (e:React.MouseEvent<HTMLCanvasElement>)=>{
        if(!isDrawing) return;
        const canvas = canvasRef.current;
        if(canvas){
            const ctx = canvas.getContext('2d');
            if(ctx){
                ctx.strokeStyle = color;
                ctx.lineTo(e.nativeEvent.offsetX , e.nativeEvent.offsetY);
                ctx.stroke();
            }
        }
    }
    return(
        <>
        <div className="flex justify-evenly items-center bg-black py-[10px]">
            <Button onClick={()=>setReset(true)} variant='default' color="black" style={{background:'linear-gradient(to left , #5C5CFE , #E94986)'}}
            className="z-20 border-1 rounded px-[12px] py-[5px] font-bold">Reset</Button> 
    
            <Button onClick={sendData}variant='default' color="black" style={{background:'linear-gradient(to left , #5C5CFE , #E94986)'}}
            className="z-20 border-1  rounded px-[12px] py-[5px] font-bold">Calculate</Button> 

                {COLORS.map((item:string)=>{
                    return(
                      <span key={item} onClick={()=>setColor(item)} className="p-1 z-20" 
                      style={{borderRadius:'1000px',width:'max-content',border:color===item?'1px solid white':'none'}}>
                      <ColorBtn color={item}/>
                      </span>   
                    )       
                })}

            {
                session.status === 'authenticated' &&
                <Button variant='default' color="black" style={{background:'linear-gradient(to left , #5C5CFE , #E94986)'}}
                className="z-20 border-1  rounded px-[12px] py-[5px] font-bold" onClick={handleLogout}>LogOut</Button>
            }
            {
                session.status === 'unauthenticated' &&
                <Button variant='default' color="black" style={{background:'linear-gradient(to left , #5C5CFE , #E94986)'}}
                className="z-20 border-1  rounded px-[12px] py-[5px] font-bold" onClick={()=>router.replace('/login')}>LogIn</Button>
            }
            {
                session.status === 'authenticated' &&
                <Button variant='default' color="black" style={{background:'linear-gradient(to left , #5C5CFE , #E94986)'}}
                className="z-20 border-1  rounded px-[12px] py-[5px] font-bold">Saved</Button> 
            }
          
        </div>
        <canvas id="canvas" onMouseDown={startDrawing} onMouseOut={stopDrawing} onMouseUp={stopDrawing} onMouseMove={draw}
        className="absolute top-0 left-0 w-full h-full" ref={canvasRef}/>

        {latexExpression && latexExpression.map((latex , index)=>{
           return(
            <Draggable key={index}>
                {latex}
            </Draggable>
           )
        })}

        {
            botOpen &&
            <BG close={setBotOpen}/>
        }

        {
        !botOpen &&
        <div className="absolute right-5 bottom-5">
            <Image src={bot} alt="" width={40} height={40} onClick={()=>setBotOpen(true)}/>
        </div>}
        </>
    )
}