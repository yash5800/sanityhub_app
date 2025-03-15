import { Stack } from "expo-router";
import React, { createContext, Dispatch, SetStateAction, useState } from "react";

export const context = createContext<{key:string,setKey:
  Dispatch<SetStateAction<string>>
}>({
  key:"",
  setKey:()=>{}
});

export default function RootLayout() {
  const [key,setKey]=useState("");
  return (
    <context.Provider value={{key,setKey}}>
      <Stack>
       <Stack.Screen name="(tabs)" options={{headerShown:false}} />
       <Stack.Screen name="index" options={{headerShown:false}} />
      </Stack>
    </context.Provider>
  );
}
