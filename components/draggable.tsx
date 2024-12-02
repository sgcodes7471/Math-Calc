"use client"

import { ReactNode, useEffect, useRef, useState } from "react";

export default function Draggable({children}:{children:ReactNode}){

    const [x,setX] = useState<number>();
    const [y,setY] = useState<number>();
    const dragRef = useRef(null);
    const [isTracking , setIsTracking] = useState<boolean>(false);

    useEffect(()=>{
        function setXY(event:MouseEvent):void{
           if(isTracking){
            setX(event.clientX);
            setY(event.clientY);
           }
        }
        function handleMouseUp():void{
            setIsTracking(false);
        }

        window.addEventListener('mousemove' , setXY);
        window.addEventListener('mouseup' , handleMouseUp)
        return ()=>{
            window.removeEventListener('mousemove',setXY);
            window.removeEventListener('mouseup',handleMouseUp);
        }
    },[isTracking])

    return(
        <div ref={dragRef} className="absolute flex text-white rounded p-2 cursor-grab" onMouseDown={()=>setIsTracking(true)} 
        style={{top:`${y}px` , left:`${x}px`,border:isTracking?'1px solid white':'none'}}>
        {children}
        </div>
    )
}