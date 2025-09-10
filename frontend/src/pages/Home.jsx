import React, { useEffect, useState, useRef } from "react";
import { messageState } from "../store/messageState";
import { authState } from "../store/userAuth";
import { Loader, PanelLeft, Send ,MessageSquare} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Home = () => {
  const [sideBAr, setsideBAr] = useState(false);
  const [newMessage, setNewMessage] = useState({ text: "" });
  const messageEndRef = useRef(null);

  const {
    user,
    message,
    selectedUser,
    isUsersLoading,
    isMessagesLoading,
    getUsers,
    setSelectedUser,
    messageWindowState,
    sentMessage,
    mess,
    submess,
  } = messageState();

  const { onlineUser } = authState(); // ✅ online users array from socket

  const handleChange = () => setsideBAr((prev) => !prev);
  const handleChanges = (e) =>
    setNewMessage({ ...newMessage, [e.target.name]: e.target.value });

  const isUserOnline = (id) => onlineUser.includes(id);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    if (selectedUser) {
      messageWindowState();
      mess();
      return () => submess();
    }
  }, [selectedUser, messageWindowState, mess, submess]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.text.trim()) {
      toast.error("Cannot send empty message");
      return;
    }
    try {
      await sentMessage(newMessage.text);
      setNewMessage({ text: "" });
    } catch {
      toast.error("Failed to send message");
    }
  };

  return (
    <main className="min-h-screen flex bg-base-200 w-full">
      {isUsersLoading ? (
        <div className="flex flex-col items-center justify-center w-64 bg-base-300">
          <Loader className="animate-spin mb-2" />
          <h1>Loading Users...</h1>
        </div>
      ) : (
        <div
          className={`${
            sideBAr ? "w-64" : "w-20"
          } transition-all duration-300 bg-base-300 h-screen flex flex-col`}
        >
          <div className="p-4 border-b border-base-200 flex items-center justify-between">
            <h2 className={`${!sideBAr && "hidden"} font-bold text-lg`}>
              Users
            </h2>
            <PanelLeft
              onClick={handleChange}
              className={`cursor-pointer ${
                sideBAr ? "text-blue-500" : "text-gray-500"
              }`}
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {user.map((u) => (
              <Link
                key={u._id}
                onClick={() => setSelectedUser(u)}
                className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                  selectedUser?._id === u._id
                    ? "bg-blue-500 text-white"
                    : "hover:bg-base-100"
                }`}
              >
                {/* avatar + online dot */}
                <div className="relative">
                  <img
                    src={u.profilepic || "/image/logo.svg"}
                    alt={u.username}
                    className="size-10 object-cover border-2 rounded-full"
                  />
                  <span
                    className={`absolute bottom-0 right-0 block w-3 h-3 rounded-full border-2 ${
                      isUserOnline(u._id)
                        ? "bg-green-500 border-white"
                        : "bg-gray-400 border-white"
                    }`}
                  />
                </div>
                {sideBAr && <span>{u.username}</span>}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col flex-1 h-screen">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-base-300 flex items-center gap-3 bg-base-100">
              <img
                src={selectedUser.profilepic || "/image/logo.svg"}
                alt={selectedUser.username}
                className="size-10 object-cover rounded-full border"
              />
              <div>
                <h2 className="font-semibold">{selectedUser.username}</h2>
                <p className="text-sm text-gray-500">
                  {isUserOnline(selectedUser._id) ? "Online" : "Offline"}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-base-100 flex flex-col gap-2">
              {isMessagesLoading ? (
                <div className="flex items-center justify-center text-gray-500">
                  <Loader className="animate-spin mr-2" /> Loading messages...
                </div>
              ) : message.length > 0 ? (
                message.map((msg, index) => (
                  <div
                    key={index}
                    ref={index === message.length - 1 ? messageEndRef : null}
                    className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm break-words shadow-sm ${
                      msg.senderId !== selectedUser._id
                        ? "bg-blue-500 text-white self-end rounded-br-none"
                        : "bg-gray-200 text-black self-start rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center mt-10">
                  No messages yet. Start the conversation 🚀
                </p>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-base-300 flex items-center bg-base-200">
              <form
                onSubmit={handleSend}
                className="flex w-full items-center gap-2"
              >
                <textarea
                  name="text"
                  rows={1}
                  placeholder="Type a message..."
                  className="flex-1 resize-none px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={newMessage.text}
                  onChange={handleChanges}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e);
                    }
                  }}
                />
                <button
                  type="submit"
                  disabled={!newMessage.text.trim()}
                  className={`p-2 rounded-lg transition ${
                    newMessage.text.trim()
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-300 text-black cursor-not-allowed"
                  }`}
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex  flex-col flex-1 items-center justify-center text-gray-400">
            <div className='bg-zinc-600/60 text-white mb-10 animate-bounce w-20 h-20 flex justify-center items-center p-2 rounded-full'>
          <MessageSquare className=" text-[5rem]"/>
        </div>
        <h1>Chaty</h1>
                
            Select a user to start chatting
          </div>
        )}
      </div>
    </main>
  );
};

export default Home;
