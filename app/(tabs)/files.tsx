import React, { useCallback, useContext, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert, FlatList, Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { context } from '../_layout';
import {  useRouter } from 'expo-router';
import { _clear, _retrieveData, _storeData } from '@/lib/store';
import icons from '@/lib/icons';
import { fetchPosts } from '@/lib/filefetch';
import * as FileSystem from "expo-file-system";
import { DevSettings } from 'react-native';
import weeks from '@/lib/weeks';

type Post = {
  _id:string,
  filename:string,
  _createdAt:string,
  fileUrl:string,
}

const Files = () => {
  const {key,setKey,check_status,background} = useContext(context);
  const router = useRouter();
  const [load,setLoad] = useState<boolean>(true);
  const [Dload,setDload] = useState<string|null>(null);
  const [data,setData] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const {offline} = useContext(context);
  

  const fetch_data = async ()=>{
    try {
      if (!offline) {
        const res = await fetchPosts(key);
        setData(res);
        await _storeData(key,res);
        setLoad(false)
      }
      else{
        const re: string = await _retrieveData(key) ?? '[]';
        setData(JSON.parse(re))
        setLoad(false)
      }
    } catch (error:any) {
      const re: string = await _retrieveData(key) ?? '[]';
      setData(JSON.parse(re))
      setLoad(false)
    }
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    await check_status();
    fetch_data();

    setTimeout(() => setRefreshing(false), 2000);
  },[setRefreshing,fetch_data,check_status]);

  useEffect(()=>{
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

  const day = new Date().getDay();

  return (
    <SafeAreaView className='flex justify-start items-center w-full bg-[#001729] h-full relative'
    >
     {background && <Image source={day>1?(day>3?weeks.file_bg_1:weeks.file_bg_2):weeks.file_bg_3} className='w-full h-full absolute z-0 opacity-55' resizeMode='cover' />}
     <ScrollView className='px-5'
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom:10}}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
     >
      <View className={`flex flex-row justify-between items-center w-full mt-3`}>
        <View className='flex flex-row justify-center items-center gap-1'>
           <Image source={offline ? icons.offline : icons.online} className='size-5' resizeMode='contain' tintColor={offline?'#ef4444':'#22c55e'}/>
           <Text className={`${offline?'text-red-500':'text-green-500'} text-lg font-bol`}>{offline?' offline':'Online'}</Text>
        </View>
        <TouchableOpacity className='flex flex-row justify-center items-center px-5 py-3 rounded-full border-2 border-orange-400 gap-1 ' onPress={handleClear}>
          <Text className='text-lg font-semibold text-white'>{key}</Text>
          <Image source={icons.clear} style={{tintColor:'orange'}} className='size-7'/>
        </TouchableOpacity>
      </View>
      {!load?(data.length>0?
      <>
      <View className='w-full justify-center items-center mt-5'>
      <FlatList
       data={data}
       keyExtractor={item => item._id}
       scrollEnabled={false}
       keyboardShouldPersistTaps="handled"
       renderItem={({item})=>(<>
         {item.filename!==null&&item.fileUrl!==null?
         <View className='p-3 w-[280px] h-[120px] bg-black rounded-lg mt-5 flex flex-row justify-between items-center relative border-[0.2px] border-white'>
            <Image source={
              item.filename.split('.')[1].toLowerCase() == "csv" && icons.csv ||
              item.filename.split('.')[1].toLowerCase() == "pdf" && icons.pdf ||
              item.filename.split('.')[1].toLowerCase() == "txt" && icons.txt ||
              item.filename.split('.')[1].toLowerCase() == "docx" && icons.doc ||
              item.filename.split('.')[1].toLowerCase() == "excel" && icons.xls 
            } className='absolute -left-1 -top-3 size-8' />

            <Image source={
              item.filename.split('.')[1].toLowerCase() == "py" && icons.coding ||
              item.filename.split('.')[1].toLowerCase() == "html" && icons.coding ||
              item.filename.split('.')[1].toLowerCase() == "c" && icons.coding ||
              item.filename.split('.')[1].toLowerCase() == "js" && icons.coding 
            } className='absolute -left-1 -top-3 size-8' style={{tintColor:'white'}}/>

            <View className=' flex flex-col justify-between items-center gap-1 px-5'>
              <View className='flex-1 flex-col justify-start items-start w-full gap-1'>
                 <Text className='font-thin text-sm text-gray-300'>File Name:</Text>
                 <Text className='max-w-[160px] text-lg text-slate-200'
                     numberOfLines={1} 
                     ellipsizeMode="tail"
                 >{item.filename}</Text>
              </View>
              <View className='flex-1 flex-col justify-start items-start w-full gap-1 '>
               <Text className='font-thin text-sm  text-gray-300'>Uploaded Date:</Text>
              <Text className='text-sm text-yellow-200 opacity-80 font-semibold'>{new Date(item._createdAt).toLocaleString()}</Text>
            </View>
          </View>
          <View>
          {Dload !== item.filename?
              <TouchableOpacity className='flex flex-col justify-center items-center' onPress={() => downloadFile(item.filename,item.fileUrl)}>
                  <Image source={icons.disk} style={{tintColor:'green'}} className='size-10'/>
                  <Text className='text-sm font-semibold text-white'>Download</Text>
              </TouchableOpacity>:
              <Text className='text-xl font-bold text-blue-600'>...</Text>
              }
          </View>
         </View>
         :<Text className='text-white font-thin text-xl mt-5'>Looks like no data Found!</Text>}</>
       )}
      />
      <View className='h-[120px]'></View>
    </View>
    </>:<Text className='text-white font-thin text-xl mt-5'>Looks like no data Found!</Text>
    ):<Text className='text-blue-500 font-semibold text-2xl mt-10 text-center'>Loading...</Text>}
     </ScrollView>
    </SafeAreaView>
  )
}

export default Files