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

  setSelectedUser: (user) => set({ selectedUser: user }),

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

    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.post(
        `/message/send/${selectedUser._id}`,
        { text }
      );
      set((state) => ({
        message: [...state.message, res.data],
      }));
      toast.success("Message sent");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send message");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  mess: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    const socket = authState.getState().socket;

    socket.on("new", (newMessage) => {
      set((state) => ({
        message: [...state.message, newMessage],
      }));
    });
  },

  submess: () => {
    const socket = authState.getState().socket;
    const { handleNewMessage } = get();
    if (handleNewMessage) {
      socket.off("new", handleNewMessage);
      set({ handleNewMessage: null });
    }
  },
}));
