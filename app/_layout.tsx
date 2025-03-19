import { Stack } from "expo-router";
import React, { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";

export const context = createContext<{
  key:string,setKey:Dispatch<SetStateAction<string>>,
  offline:boolean,
  check_status:()=>void,
  background:boolean,
  setBackground:Dispatch<SetStateAction<boolean>>
}>({
  key:"",
  setKey:()=>{},
  offline:true,
  check_status:()=>{},
  background:true,
  setBackground:()=>{}
});

export default function RootLayout() {
  const [background,setBackground] = useState<boolean>(true)
  const [key,setKey]=useState("");
  const [offline,setof] = useState<boolean>(true)

  const check_status = async ()=>{
    console.log('Loading...')
    const url = "https://www.google.com/";
    try {
      const response = await fetch(url);
      if (response.ok) {
        setof(false)
      }
    } catch (error:any) {
    }
  }


  useEffect(()=>{
    check_status();
  },[])

  return (
    <context.Provider value={{key,setKey,offline,check_status,background,setBackground}}>
      <Stack>
       <Stack.Screen name="(tabs)" options={{headerShown:false}} />
       <Stack.Screen name="index" options={{headerShown:false}} />
      </Stack>
    </context.Provider>
  );
}
