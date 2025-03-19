import { View, Text, Alert, FlatList, TouchableOpacity, Image, ScrollView, RefreshControl } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import * as FileSystem from "expo-file-system";
import { router, useRouter } from 'expo-router';
import * as Sharing from "expo-sharing";
import { SafeAreaView } from 'react-native-safe-area-context';
import icons from '@/lib/icons';
import * as IntentLauncher from 'expo-intent-launcher';
import { Platform, Linking } from 'react-native';
import { DevSettings } from 'react-native';
import weeks from '@/lib/weeks';
import { context } from '../_layout';

const downloadsDir = FileSystem.documentDirectory + 'downloads/';

const Downloaded = () => {
  const {check_status,background} = useContext(context);
  const [userFiles, setUserFiles] = useState<string[]>([]);
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const listFiles =async ()=>{
    const downloadsDir = FileSystem.documentDirectory + "downloads/";
  
    try{
      if (downloadsDir) {
  
        const files = await FileSystem.readDirectoryAsync(downloadsDir);
  
        return files;
      } else {
        console.error("Document directory is null");
      }
    }catch(err:any){
      Alert.alert('Error', 'Could not fetch files.');
    }
  }


const handleOpen = async (item: string) => {
  const fileUri = FileSystem.documentDirectory + "downloads/" + item;

  try {
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (!fileInfo.exists) {
      console.error("File not found:", fileUri);
      return;
    }
    const extention = item.split('.')[(item.split('.')).length - 1].toLowerCase()
    // You might want to dynamically determinethe MIME type
    let mimeType = '*/*';
    console.log(extention)

    if(extention == "pdf"){
      mimeType = 'application/pdf';
    }
    else if(extention == 'csv'){
      mimeType = 'text/csv';
    }
    else if(extention == "json"){
      mimeType = 'application/json';
    }
    else if(extention == "xml"){
      mimeType = 'application/xml';
    }
    else if(extention == "zip"){
      mimeType = 'application/zip';
    }
    else if(extention == "txt"){
      mimeType = 'text/plain';
    }
    else if(extention == "html"){
      mimeType = 'text/html';
    }
    else if(extention == "css"){
      mimeType = 'text/css';
    }
    else if(extention == "jpeg" || extention == "jpg"){
      mimeType = 'image/jpeg ';
    }
    else if(extention == "png"){
      mimeType = 'image/png';
    }
    else if(extention == "gif"){
      mimeType = 'image/gif';
    }
    else if(extention == "mp4"){
      mimeType = 'video/mp4';
    }
    else if(extention == "webm"){
      mimeType = 'video/webm';
    }    
    else if(extention == "docx" || extention == "doc"){
      mimeType = 'application/msword';
    } 

    if (Platform.OS === 'android') {
      // On Android, get a content URI that can be shared with other apps.
      const contentUri = await FileSystem.getContentUriAsync(fileUri);
      await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
        data: contentUri,
        flags: 1,
        type: mimeType,
      });
    } else {
      // On iOS (and other platforms), attempt to open the file URL.
      await Linking.openURL(fileUri);
    }
  } catch (error) {
    console.error("Error opening file:", error);
  }
};


  const handleShare = async (item: string) => {
    const fileUri = FileSystem.documentDirectory + "downloads/" + item;
  
    try {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (!fileInfo.exists) {
        console.error("File not found:", fileUri);
        return;
      }
  
      // Share the file using the system's share sheet
      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.error("Error opening file:", error);
    }
  };

  const fetchFiles = async () => {
    const res = await listFiles();
    if (res) {
        setUserFiles(res);
    }
   };
    
   const onRefresh = useCallback(async () => {
    setRefreshing(true);

    check_status();
    fetchFiles();

    setTimeout(() => setRefreshing(false), 2000);
  },[setRefreshing,fetchFiles,check_status]);

  useEffect(() => {
      fetchFiles();
    }, []);

  const day = new Date().getDay();

  return (
    <SafeAreaView className='flex justify-start items-center
     w-full bg-[#001729] h-full'>
     {background && <Image source={day>1?(day>3?weeks.save_bg:weeks.save_bg_2):weeks.save_bg_3} className='w-full h-full absolute z-0 opacity-55' resizeMode='cover' />}

    <ScrollView 
       showsVerticalScrollIndicator={false}
       contentContainerStyle={{paddingBottom:100}}
       refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
      {userFiles.length === 0 ? (
        <Text className='text-sm text-gray-300 text-center mt-5 font-normal flex-1'>No files found.</Text>
      ) : (
        <>
        <FlatList
          data={userFiles}
          keyExtractor={(item) => item}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View className=' flex flex-col justify-between items-center bg-black rounded-xl w-full px-5 py-7 mt-8 shadow-black relative gap-5 border-[0.2px] border-white'>
              <View className='flex-1 justify-start items-center flex-col gap-2'>
                   <Text className='font-thin text-sm text-gray-300'>File Name:</Text>
                   <Text className='max-w-[240px] text-xl font-light text-white'
                      numberOfLines={1} 
                      ellipsizeMode="tail"
                     >{item}</Text>
              </View>
              <View className='flex-1 justify-center items-center flex-row gap-5'>
                <TouchableOpacity className='rounded-2xl flex flex-row justify-center items-center px-3 py-3 bg-orange-400 gap-2' onPress={()=> handleOpen(item)}>
                  <Image source={icons.view} className='size-5' resizeMode='contain' />
                  <Text className='text-white font-bold'>View</Text>
                </TouchableOpacity>
                <TouchableOpacity className='rounded-2xl flex flex-row justify-center items-center px-3 py-3 bg-blue-400 gap-2' onPress={() => handleShare(item)}>
                <Image source={icons.send} className='size-5' resizeMode='contain' />
                <Text className='text-white font-bold'>share</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
        </>
      )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Downloaded;
