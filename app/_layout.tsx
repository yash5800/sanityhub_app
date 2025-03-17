import { Stack } from "expo-router";
import React, { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";

export const context = createContext<{key:string,setKey:
  Dispatch<SetStateAction<string>>,offline:boolean
}>({
  key:"",
  setKey:()=>{},
  offline:true
});

export default function RootLayout() {
  const [key,setKey]=useState("");
  const [offline,setof] = useState<boolean>(true)

  useEffect(()=>{
    const fetch_data = async ()=>{
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
    fetch_data();
  },[])

  return (
    <context.Provider value={{key,setKey,offline}}>
      <Stack>
       <Stack.Screen name="(tabs)" options={{headerShown:false}} />
       <Stack.Screen name="index" options={{headerShown:false}} />
      </Stack>
    </context.Provider>
  );
}
