import { Link, useRouter } from "expo-router";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import './globals.css'
import { context } from "./_layout";
import { useContext, useEffect, useState } from "react";
import icons from "@/lib/icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { _retrieve, _store } from "@/lib/store";

export default function Index() {
  const {key,setKey} = useContext(context);
  const router = useRouter();
  const [er,seter] = useState<boolean>(false);
  
  useEffect(()=>{
    _retrieve().then((val)=>{
      console.log(val)
      if(val){
        setKey(val);
        router.push('/files')
      }
    })
  },[])

  const handleSubmit = async()=>{
    if(key.length<4){
      seter(true);
      return;
    }
    await _store(key);
    router.push('/files')
  }
  return (
    <SafeAreaView
      className="flex flex-col justify-evenly items-center h-full w-full px-5 bg-slate-950"
    >
      <Text className="text-3xl font-bold text-blue-400"><Text className="text-gray-500">Welcome to</Text> SanityHub!</Text>
      <View className="flex items-center justify-center object-contain">
         <Image source={icons.server} className="w-[280px] h-[250px] rounded-2xl" />
      </View>

      <View className="flex flex-col items-center justify-center mt-6 w-full gap-5">
        <Text className="text-orange-500 text-lg font-semibold">Enter your unique key to access your files</Text>
        <TextInput 
          onChangeText={(text)=>setKey(text)}
          placeholder="..."
          defaultValue={key}
          className={`${'placeholder:text-gray-400'} h-[50px] w-[230px] rounded-md text-white border-2 active:border-orange-400 text-xl border-gray-400 font-semibold px-3`}
          maxLength={40}
        />
        {er&&<Text className="text-red-500 text-sm">Key must be at least 4 characters</Text>}
        <TouchableOpacity className="px-14 py-4 bg-orange-600 rounded-full" onPress={handleSubmit}><Text className="text-white text-base font-bold">Submit</Text></TouchableOpacity>
      </View>
      <Text
       className="text-gray-400 text-start px-5 font-light text-base"
      >
        {"Securely store and manage your files with our fast and reliable storage solution powered by Sanity. Simply provide your unique key to upload and access your data—no hassle, just seamless storage!"}
      </Text>
    </SafeAreaView>
  );
}
