"use client"
import {useRouter} from "next/navigation";
import { Button } from "@/components/ui/button";
export default function Home() {
  const router=useRouter();
  return (
    <Button className="hover:cursor-pointer dark:bg-amber-500 w-19 h-9 flex justify-center items-center" onClick={()=>{
      router.push('/product');
    }}>
      hello
    </Button> 
  );
}
