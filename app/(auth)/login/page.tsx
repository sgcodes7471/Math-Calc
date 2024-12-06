'use client'

import { Input } from "@/components/ui/input";
import { useEffect , useState,ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function Login(){

    const [email , setEmail] = useState<string>('');
    const [password , setPassword] = useState<string>('');
    const [issue , setIssue] = useState<string|null>(null);
    const router = useRouter();

    useEffect(()=>{
        const Timeout = setTimeout(()=>{
            setIssue(null);
        },4000)
        return()=>{clearTimeout(Timeout)}
    },[issue])

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        if (email.trim() === '' || password.trim() === '') return;
        try {
            const result = await signIn('credentials', {
                redirect: false,
                identifier: email,
                password: password
            });
            if (result?.error) throw new Error('Could not Login due to wrong credentials');
            if (result?.url) router.replace('/');
        } catch (error: any) {
            setIssue(error.message);
        }
    }
    
    return(
        <div className="w-[100vw] h-[100vh] flex items-center justify-center">
             <div className="form-wrapper w-[40%]" style={{background:'linear-gradient(to left , #5C5CFE , #E94986)',borderRadius:'14px',padding:'6px'}}>
                <div className="p-10" style={{borderRadius:'8px',background:'#fbfbfb'}}>
                <form className="flex flex-col items-center justify-center gap-6" onSubmit={(e)=>{
                    e.preventDefault();
                    handleLogin(e);
                }}>
                    <Input type="email" name="identifier" placeholder="Enter your Email" 
                    onChange={(e:ChangeEvent<HTMLInputElement>)=>setEmail(e.target.value)}/>
                    <Input type="password" name="password" placeholder="Enter your Password" 
                    onChange={(e:ChangeEvent<HTMLInputElement>)=>setPassword(e.target.value)}/>
                    <Input type="submit" value='Login' className="w-[10vw] text-white cursor-pointer" 
                    style={{fontSize:'1.1rem',background:'linear-gradient(to left , #5C5CFE , #E94986)'}}/>
                </form>
                <div className="text-blue-500 my-2 cursor-pointer" onClick={()=>{router.replace('/signup')}}>Do not have an account?</div>
                <div className="text-red-500 text-left mt-2 h-[20px] font-semibold">{issue}</div>
                </div>
            </div>
        </div>
    )
}