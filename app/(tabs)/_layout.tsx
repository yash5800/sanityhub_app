import { View, Text, Image } from 'react-native'
import React, { useContext } from 'react'
import { Tabs } from 'expo-router'
import icons from '@/lib/icons'
import { context } from '../_layout'

interface TabBarProps{
  focused:boolean,
  title:string,
  icon:any
}



const TabBar= ({focused,title,icon}:TabBarProps)=>{
   return(
    <View className={`flex flex-col justify-center items-center bg-transparent rounded-full h-14 mt-7 `} >
         <View className='flex-1 flex-col justify-center items-center min-w-[50px]'>
          <Image source={icon} className='size-6' resizeMode='contain' tintColor={`${focused?'#2596be':'#808080'}`} />
          <Text className={`${focused?"text-[#2596be]":"text-gray-500"} text-sm font-semibold`}>{title}</Text>
          </View>
    </View>
   )
}

const Layout = () => {
  const {offline} = useContext(context);

  return (
    <Tabs
     screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
      tabBarStyle:{
        backgroundColor:'black',
        position:'absolute',
        height:60,
        borderColor:'black',
        borderTopLeftRadius:50,
        borderTopRightRadius:50
      }
     }}
    >
      <Tabs.Screen
      name='files'
      options={{
        title:'Files',
        tabBarIcon:({focused})=>{
          return <TabBar focused={focused} title={"Files"} icon={focused?icons.docment:icons.file} />
        }
      }}
      />
      <Tabs.Screen
      name='downloaded'
      options={{
        title:'Saved',
        tabBarIcon:({focused})=>{
          return <TabBar focused={focused} title={"Saved"} icon={focused?icons.bookmark:icons.save}/>
        }
      }}
      />
      <Tabs.Screen
      name='web'
      options={{
        title:'Web',
        tabBarIcon:({focused})=>{
          return <TabBar focused={focused} title={"Web"} icon={!offline?(focused?icons.f_gloab:icons.globe):icons.globe_cancel}/>
        }
      }}
      />

    </Tabs>
  )
}

export default Layout