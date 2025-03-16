import { View, Text, Alert, FlatList, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as FileSystem from "expo-file-system";
import { router, useRouter } from 'expo-router';
import * as Sharing from "expo-sharing";
import { SafeAreaView } from 'react-native-safe-area-context';
import icons from '@/lib/icons';
import * as IntentLauncher from 'expo-intent-launcher';
import { Platform, Linking } from 'react-native';

const downloadsDir = FileSystem.documentDirectory + 'downloads/';

const Downloaded = () => {
  const [userFiles, setUserFiles] = useState<string[]>([]);
  const router = useRouter();

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
    

  useEffect(() => {
      const fetchFiles = async () => {
          const res = await listFiles();
          if (res) {
              setUserFiles(res);
          }
      };
      fetchFiles();
    }, []);

  return (
    <SafeAreaView className='flex justify-start items-center px-5
     w-full bg-[#001729] h-full pb-20'>
      <Text className="text-3xl mt-10 font-bold text-green-400 text-start w-full mb-5">Downloaded Files:</Text>
      {userFiles.length === 0 ? (
        <Text>No files found.</Text>
      ) : (
        <>
        <FlatList
          data={userFiles}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <View className=' flex flex-row justify-between items-center bg-black rounded-xl w-full px-3 py-5 mt-8 shadow-black relative'>
                <TouchableOpacity onPress={()=> handleOpen(item)}>
                  <Text className='max-w-[240px] text-xl font-light text-white'
                    numberOfLines={1} 
                    ellipsizeMode="tail"
                   >{item}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleShare(item)}>
                  <Image source={icons.share} className='size-10' />
                </TouchableOpacity>
            </View>
          )}
        />
        </>
      )}
    </SafeAreaView>
  );
};

export default Downloaded;
