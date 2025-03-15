import { View, Text, Alert, FlatList, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as FileSystem from "expo-file-system";
import { router, useRouter } from 'expo-router';
import * as Sharing from "expo-sharing";
import { SafeAreaView } from 'react-native-safe-area-context';
import icons from '@/lib/icons';

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
     w-full bg-slate-800 h-full'>
      <Text className="text-3xl mt-10 font-bold text-green-400 text-start w-full">Downloaded Files:</Text>
      {userFiles.length === 0 ? (
        <Text>No files found.</Text>
      ) : (
        <FlatList
          data={userFiles}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <View className=' flex flex-row justify-between items-center w-full px-3 mt-8'>
              <Text className='max-w-[240px] text-xl text-blue-400'
                  numberOfLines={1} 
                  ellipsizeMode="tail"
              >{item}</Text>
                <TouchableOpacity onPress={() => handleOpen(item)}>
                  <Image source={icons.share} className='size-10' />
                </TouchableOpacity>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default Downloaded;
