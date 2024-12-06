'use client'

import { Input } from "@/components/ui/input";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState , ChangeEvent} from "react";

export default function Signup(){

    const [name , setName] = useState<string>('');
    const [email , setEmail] = useState<string>('');
    const [password , setPassword] = useState<string>('');
    const [confPassword , setConfPassword] = useState<string>('');
    const [issue , setIssue] = useState<string|null>(null);
    const router = useRouter();

    useEffect(()=>{
        const Timeout = setTimeout(()=>{
            setIssue(null);
        },4000)
        return()=>{clearTimeout(Timeout)}
    },[issue])

    async function handleSignup() {
        if(email.length === 0 || password.length === 0 || name.length === 0 || confPassword.length === 0){
            setIssue('Fields cannot be empty');
            return;
        }
        if(password !== confPassword){
            setIssue('Password should match confPassword');
            return;
        }
        try {
            const response = await axios.post('http://localhost:3000/api/signup',{name,email,password},{
                headers:{
                    'Content-Type': 'application/json',
                }
            })
            console.log(response.data);
            if (response.status !== 201) throw new Error(response.data.message);
            router.replace('/login');
        } catch (error:any) {
            setIssue(error.message);
        }
    }
    
    return(
        <div className="w-[100vw] h-[100vh] flex items-center justify-center" style={{background:'#fbfbfb'}}>
            <div className="form-wrapper w-[40%]" style={{background:'linear-gradient(to left , #5C5CFE , #E94986)',borderRadius:'14px',padding:'6px'}}>
                <div className="p-10" style={{borderRadius:'8px',background:'#fbfbfb'}}>
                <form className="flex flex-col items-center justify-center gap-6" onSubmit={(e)=>{
                    e.preventDefault();
                    handleSignup();
                }}>
                    <Input type="text" placeholder="Enter your Name" 
                    onChange={(e:ChangeEvent<HTMLInputElement>)=>setName(e.target.value)}/>
                    <Input type="email" placeholder="Enter your Email" 
                    onChange={(e:ChangeEvent<HTMLInputElement>)=>setEmail(e.target.value)}/>
                    <Input type="password" placeholder="Enter your Password" 
                    onChange={(e:ChangeEvent<HTMLInputElement>)=>setPassword(e.target.value)}/>
                    <Input type="password" placeholder="Comfirm your Password" 
                    onChange={(e:ChangeEvent<HTMLInputElement>)=>setConfPassword(e.target.value)}/>
                    <Input type="submit" value='Sign Up' className="w-[10vw] text-white cursor-pointer" 
                    style={{fontSize:'1.1rem',background:'linear-gradient(to left , #5C5CFE , #E94986)'}}/>
                </form>
                <div className="text-blue-500 my-2 cursor-pointer" onClick={()=>{router.replace('/login')}}>Already have an account?</div>
                <div className="text-red-500 text-left mt-2 h-[20px] font-semibold">{issue}</div>
                </div>
            </div>
        </div>
    )
}