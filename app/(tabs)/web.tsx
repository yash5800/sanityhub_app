import React, { useContext, useState } from "react";
import { View, ActivityIndicator, StyleSheet, Image, Text } from "react-native";
import { WebView } from "react-native-webview";
import { context } from "../_layout";
import icons from "@/lib/icons";

const Web = () => {
  const { key,offline } = useContext(context);
  const [loading, setLoading] = useState(true);
  

  return (
    <>{!offline ?
       <View style={styles.container}>
         {/* WebView */}
         <WebView
           source={{ uri: `https://sanityhub.vercel.app/user/${key}` }}
           onLoadStart={() => setLoading(true)} // Show loader when loading starts
           onLoad={() => setLoading(false)} // Hide loader when page loads
           onError={() => setLoading(false)} // Hide loader on error
           style={loading ? { opacity: 0 } : { opacity: 1 }} // Hide WebView when loading
         />
   
         {/* Loader (only shown when loading) */}
         {loading && (
           <View style={styles.loader}>
             <ActivityIndicator size="large" color="#007AFF" />
           </View>
         )}
       </View>
       :
        <View className="flex-1 justify-center items-center  bg-[#001729]">
          <Image source={icons.oops} className="w-full" resizeMode="contain" />
        </View>
       }
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1, // Ensure the loader stays on top
  },
});

export default Web;
