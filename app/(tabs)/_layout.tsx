import { View, Text, Image } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import icons from '@/lib/icons'

interface TabBarProps{
  focused:boolean,
  title:string,
  icon:any
}

import { DevSettings } from 'react-native';

// Call this function to reload the app
const reloadApp = () => {
  DevSettings.reload();
};

const TabBar= ({focused,title,icon}:TabBarProps)=>{
   return(
    <View className='flex flex-row justify-center items-center w-full min-w-[50px] rounded-full h-14 mt-4' onTouchStart={()=>reloadApp} >
       {
        focused?
        <>
          <Image source={icon} className='size-7 mr-2' tintColor='#2596be' />
          <Text className={`${focused?"text-[#2596be]":"text-gray-500"} text-base font-semibold`}>{title}</Text>
        </>
        :
        <Image source={icon} className='size-7' tintColor='#A8B5DB' />
       }
    </View>
   )
}

const Layout = () => {
  return (
    <Tabs
     screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
      tabBarItemStyle:{
        width: '100%',
        height:'100%',
        justifyContent:'center',
        alignItems:'center',
      },
      tabBarStyle:{
        borderRadius:50,
        backgroundColor:'black',
        position:'absolute',
        marginHorizontal:20,
        marginBottom:16,
        height:60,
        borderColor:'black'
      }
     }}
    >
      <Tabs.Screen
      name='files'
      options={{
        title:'Files',
        tabBarIcon:({focused})=>{
          return <TabBar focused={focused} title={"Files"} icon={icons.file} />
        }
      }}
      />
      <Tabs.Screen
      name='downloaded'
      options={{
        title:'Saved',
        tabBarIcon:({focused})=>{
          return <TabBar focused={focused} title={"Saved"} icon={icons.save}/>
        }
      }}
      />

    </Tabs>
  )
}

export default Layout