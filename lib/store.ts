import AsyncStorage from '@react-native-async-storage/async-storage';

export const _store = async(val:string)=>{
  try{
    return await AsyncStorage.setItem('log',val)
  }catch(e){
    console.log(e);
  }
}

export const _retrieve = async()=>{
  try{
    return await AsyncStorage.getItem('log')
  }catch(e){
    console.log(e);
  }
 }

 export const _clear = async()=>{
  try{
    return await AsyncStorage.removeItem('log')
  }catch(e){
    console.log(e);
  }
 }

 export const _storeData = async(key:string,val:string)=>{
  try{
    return await AsyncStorage.setItem(key,JSON.stringify(val))
  }catch(e){
    console.log(e);
  }
}

export const _retrieveData = async(key:string)=>{
  try{
    return await AsyncStorage.getItem(key)
  }catch(e){
    console.log(e);
  }
 }
