import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { context } from '../_layout';
import {  useRouter } from 'expo-router';
import { _clear, _retrieveData, _storeData } from '@/lib/store';
import icons from '@/lib/icons';
import { fetchPosts } from '@/lib/filefetch';
import * as FileSystem from "expo-file-system";
type Post = {
  _id:string,
  filename:string,
  _createdAt:string,
  fileUrl:string,
}

const Files = () => {
  const {key,setKey} = useContext(context);
  const router = useRouter();
  const [Dload,setDload] = useState<string|null>(null);
  const [data,setData] = useState<Post[]>([]);

  useEffect(()=>{
    const fetch_data = async ()=>{
      console.log('Loading...')
      const url = "https://www.google.com/";
      try {
        const response = await fetch(url);
        if (response.ok) {
          const res = await fetchPosts(key);
          setData(res);
          await _storeData(key,res);
        }
        else{
          const re: string = await _retrieveData(key) ?? '[]';
          setData(JSON.parse(re))
        }
      } catch (error:any) {
        const re: string = await _retrieveData(key) ?? '[]';
        setData(JSON.parse(re))
      }
    }
    fetch_data();
  },[])

  const downloadFile = async(filename:string,fileUrl:string)=>{
    setDload(filename);

    const downloadsDir = FileSystem.documentDirectory + "downloads/";

    const dirInfo = await FileSystem.getInfoAsync(downloadsDir);
    
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(downloadsDir, { intermediates: true });
        console.log("Created downloads folder");
    }

    try{
      const fileUri = FileSystem.documentDirectory + "downloads/" + filename;

      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if(fileInfo.exists){
        Alert.alert(`File Exists at :${fileUri}`);
        setDload(null);
        return;
      }

      const {uri} = await FileSystem.downloadAsync(fileUrl,fileUri)
      Alert.alert("Download Complete",`File Saved to :${uri}`);
      setDload(null);
    }
    catch(err:any){
      setDload(null);
      Alert.alert("failed!,check network status..")
    }
  }
  
  const handleClear = async()=>{
    setKey("");
    await _clear();
    router.push('/')
  }
  return (
    <SafeAreaView className='flex justify-start items-center px-5 w-full bg-[#001729] h-full pb-20'>
      <View className='flex justify-center items-end w-full mt-3'>
        <TouchableOpacity className='flex flex-row justify-center items-center px-5 py-3 rounded-full border-2 border-orange-400 gap-1' onPress={handleClear}>
          <Text className='text-lg font-semibold text-white'>{key}</Text>
          <Image source={icons.clear} style={{tintColor:'orange'}} className='size-7'/>
        </TouchableOpacity>
      </View>
      {data.length>0?
      <>
      <View className='w-full justify-center items-center mt-5'>
      <FlatList
       data={data}
       keyExtractor={item => item._id}
       renderItem={({item})=>(<>
         {item.filename!==null&&item.fileUrl!==null?
         <View className='p-3 w-[280px] h-[100px] bg-black rounded-lg mt-5 flex flex-col justify-between items-center relative'>
            <Image source={
              item.filename.split('.')[1].toLowerCase() == "csv" && icons.csv ||
              item.filename.split('.')[1].toLowerCase() == "pdf" && icons.pdf ||
              item.filename.split('.')[1].toLowerCase() == "txt" && icons.txt ||
              item.filename.split('.')[1].toLowerCase() == "docx" && icons.doc ||
              item.filename.split('.')[1].toLowerCase() == "excel" && icons.xls 
            } className='absolute left-0 -top-3 size-8' />

            <Image source={
              item.filename.split('.')[1].toLowerCase() == "py" && icons.coding ||
              item.filename.split('.')[1].toLowerCase() == "html" && icons.coding ||
              item.filename.split('.')[1].toLowerCase() == "c" && icons.coding ||
              item.filename.split('.')[1].toLowerCase() == "js" && icons.coding 
            } className='absolute left-0 -top-3 size-8' style={{tintColor:'white'}}/>

            <View className=' flex flex-row justify-between items-center w-full px-3'>
              <Text className='max-w-[160px] text-xl text-blue-400'
                  numberOfLines={1} 
                  ellipsizeMode="tail"
              >{item.filename}</Text>
              {Dload !== item.filename?
              <TouchableOpacity className='flex flex-col justify-center items-center' onPress={() => downloadFile(item.filename,item.fileUrl)}>
                  <Image source={icons.disk} style={{tintColor:'green'}} className='size-10'/>
                  <Text className='text-sm font-semibold text-white'>Download</Text>
              </TouchableOpacity>:
              <Text className='text-xl font-bold text-blue-600'>...</Text>
              }
            </View>
            <Text className='text-base text-yellow-500 opacity-80 font-semibold'>{new Date(item._createdAt).toLocaleString()}</Text>
         </View>
         :<Text className='text-white font-thin text-xl mt-5'>Looks like no data Found!</Text>}</>
       )}
      />
      <View className='h-[120px]'></View>
    </View>
    </>:<Text className='text-white font-thin text-xl mt-5'>Looks like no data Found!</Text>}
    </SafeAreaView>
  )
}

export default Files