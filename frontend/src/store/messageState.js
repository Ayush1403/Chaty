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
  handleNewMessage: null, // stores the socket listener

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

  // Set selected user and clear messages
  setSelectedUser: (user) => {
    // Unsubscribe old socket before switching
    get().unsubscribeMessages();

    set({ selectedUser: user, messages: [] });

    // Fetch messages for the new user
    get().messageWindowState();

    // Subscribe to new socket events
    get().subscribeMessages();
  },

  // Fetch messages for selected user
  messageWindowState: async () => {
    const selectedUser = get().selectedUser;
    if (!selectedUser) return;

    const userId = selectedUser._id; // capture userId to prevent race condition
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      // Only update messages if selected user hasn't changed
      if (get().selectedUser?._id === userId) {
        set({ messages: res.data });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // Send a message
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

  // Subscribe to socket messages for the selected user
  subscribeMessages: () => {
    const { selectedUser, handleNewMessage } = get();
    if (!selectedUser) return;

    const socket = authState.getState().socket;
    if (!socket) return;

    // Remove old listener if exists
    if (handleNewMessage) {
      socket.off("new", handleNewMessage);
    }

    // Create listener
    const listener = (newMessage) => {
      const selectedUserId = get().selectedUser?._id;
      if (!selectedUserId) return;

      // Only add message if it belongs to selected user
      if (
        newMessage.senderId === selectedUserId ||
        newMessage.receiverId === selectedUserId
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
