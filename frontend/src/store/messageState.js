import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { authState } from "./userAuth";

export const messageState = create((set, get) => ({
  message: [],
  user: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/message/user");
      set({ user: res.data });
      toast.success("Users Loaded");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  setSelectedUser: (user) => {
    // Clean up previous chat when selecting new user
    get().submess();
    set({ selectedUser: user, message: [] }); // Clear previous messages
  },

  messageWindowState: async () => {
    const selectedUser = get().selectedUser;
    if (!selectedUser) return;

    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${selectedUser._id}`);
      set({ message: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sentMessage: async (text) => {
    const selectedUser = get().selectedUser;
    if (!selectedUser) {
      toast.error("Select a user first");
      return;
    }

    try {
      const res = await axiosInstance.post(
        `/message/send/${selectedUser._id}`,
        { text }
      );
      
      // Only add message if we're still in the same chat
      const currentSelectedUser = get().selectedUser;
      if (currentSelectedUser && currentSelectedUser._id === selectedUser._id) {
        set((state) => ({
          message: [...state.message, res.data],
        }));
      }
      
      toast.success("Message sent");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send message");
    }
  },

  // Store reference to the current message handler
  currentMessageHandler: null,

  mess: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    
    const socket = authState.getState().socket;
    if (!socket) return;

    // Always clean up first
    get().submess();

    // Get current user ID for comparison
    const currentUserId = authState.getState().useAuth?._id;
    if (!currentUserId) return;

    // Create message handler with proper filtering
    const messageHandler = (newMessage) => {
      const currentSelectedUser = get().selectedUser;
      
      // Double check we still have a selected user
      if (!currentSelectedUser) return;
      
      // Only process messages that belong to this specific chat
      const isRelevantMessage = 
        // Message sent TO the selected user FROM current user
        (newMessage.senderId === currentUserId && newMessage.receiverId === currentSelectedUser._id) ||
        // Message sent FROM the selected user TO current user  
        (newMessage.senderId === currentSelectedUser._id && newMessage.receiverId === currentUserId);
      
      if (isRelevantMessage) {
        // Additional safety check - make sure we're still in the same chat
        const stillSelectedUser = get().selectedUser;
        if (stillSelectedUser && stillSelectedUser._id === currentSelectedUser._id) {
          set((state) => ({
            message: [...state.message, newMessage],
          }));
        }
      }
    };

    // Store handler and attach listener
    set({ currentMessageHandler: messageHandler });
    socket.on("new", messageHandler);
  },

  submess: () => {
    const socket = authState.getState().socket;
    const { currentMessageHandler } = get();
    
    if (socket && currentMessageHandler) {
      socket.off("new", currentMessageHandler);
      console.log("Removed socket listener"); // Debug log
    }
    set({ currentMessageHandler: null });
  },

  // Add cleanup method for when component unmounts
  cleanup: () => {
    get().submess();
    set({ 
      selectedUser: null, 
      message: [], 
      currentMessageHandler: null 
    });
  }
}));
