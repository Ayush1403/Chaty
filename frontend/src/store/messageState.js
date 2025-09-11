import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { authState } from "./userAuth";

export const messageState = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  handleNewMessage: null, // store socket listener reference

  // Fetch all users
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/message/user");
      set({ users: res.data });
      toast.success("Users Loaded");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // Set currently selected user
  setSelectedUser: (user) => set({ selectedUser: user }),

  // Fetch messages for selected user
  messageWindowState: async () => {
    const selectedUser = get().selectedUser;
    if (!selectedUser) return;

    const userId = selectedUser._id; // capture userId to prevent race condition
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      // only update if selected user hasn't changed
      if (get().selectedUser?._id === userId) {
        set({ messages: res.data });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // Send a message to the selected user
  sendMessage: async (text) => {
    const selectedUser = get().selectedUser;
    if (!selectedUser) {
      toast.error("Select a user first");
      return;
    }

    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, { text });
      set((state) => ({
        messages: [...state.messages, res.data],
      }));
      toast.success("Message sent");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send message");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // Subscribe to socket messages for selected user
  subscribeMessages: () => {
    const { selectedUser, handleNewMessage } = get();
    if (!selectedUser) return;

    const socket = authState.getState().socket;
    if (!socket) return;

    // Remove existing listener if any
    if (handleNewMessage) {
      socket.off("new", handleNewMessage);
    }

    // Create new listener
    const listener = (newMessage) => {
      // Only add message if it belongs to selected user
      if (
        newMessage.senderId === selectedUser._id ||
        newMessage.receiverId === selectedUser._id
      ) {
        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
      }
    };

    socket.on("new", listener);
    set({ handleNewMessage: listener });
  },

  // Unsubscribe from socket messages
  unsubscribeMessages: () => {
    const socket = authState.getState().socket;
    const { handleNewMessage } = get();
    if (socket && handleNewMessage) {
      socket.off("new", handleNewMessage);
      set({ handleNewMessage: null });
    }
  },
}));
