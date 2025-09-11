import axios from 'axios'
import {create} from 'zustand'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

export const authState = create((set,get)=>({
    useAuth: null,
    isSigninUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAUth: true,
    socket: null,
    onlineUser: [],

    checkAuth: async()=>{
        try{
            const res = await axiosInstance.get("/user/check");

            set({useAuth: res.data})
           get().connectSocket();
        }catch(error){
                  set({useAuth: null})
        }finally{
            set({isCheckingAUth: false })
        }
    },



    signup: async(data)=>{
        set({isSigninUp:true});
        try {
            const res = await axiosInstance.post("/user/signup",data);
            set({
                useAuth: res.data.user,
                isSigninUp: false
               })
               get().connectSocket();
            toast.success("Account created successfully")
        } catch (error) {
                toast.error(error.response.data.message);
                console.log("AXIOS ERROR:", error);
        }finally{
            set({isSigninUp: false})
        }
    },

    logout: async()=>{
        try {
            const res = await axiosInstance.post("/user/logout")
            set ({useAuth:null})
            get().disconnectSocket();
            toast.success("Logged out")
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },

    login: async(data)=>{
        set({isLoggingIn: true})
        try {
            const res = await axiosInstance.post("/user/login",data)
            set({useAuth: res.data,
                isLoggingIn:false
            })
            toast.success("Enjoy your chats")
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        } finally
          { 
             set({isLoggingIn: false})
            }
        
    },


 profile: async (data) => {
  // Set loading state
  set({ isUpdatingProfile: true });

  try {
    // Call backend API
    const res = await axiosInstance.put("/user/update", data);

    // Update user state
    set({ useAuth: res.data, isUpdatingProfile: false });

  } catch (error) {
    console.error("Profile update failed:", error);
    
    // Reset loading state even if it fails
    set({ isUpdatingProfile: false });
  }
},
connectSocket: ()=>{
    const  {useAuth} = get()
    if(!useAuth || get().socket?.connected) return;
    const socket = io(import.meta.env.MODE==="development" ? "http://localhost:5002" : "/",{
        withCredentials: true,
        auth:{userId: useAuth._id}
    })
    socket.connect()
    set({socket : socket});
    socket.on("getOnline",(userIds)=>{
        set({onlineUser : userIds})
    })
},
disconnectSocket: ()=>{
      if(get().socket?.connected) 
        get().socket?.disconnect();
    
  
      
}




}))


