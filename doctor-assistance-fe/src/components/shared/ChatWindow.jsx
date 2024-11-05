import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaArrowLeft } from 'react-icons/fa';
import { TbUserCircle } from "react-icons/tb";
import { PiWechatLogoDuotone } from "react-icons/pi";

import { Input } from '@/components/ui/input';
import Loading from '@/components/shared/Loading';

import { getChatSocket } from '@/utils/chatSocket';
import { formatChatPreviewDate } from '@/utils/date';

export default function ChatWindow() {
    const [selectedChat, setSelectedChat] = useState(null);
    const [currentChatMessages, setCurrentChatMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const currentChatMessagesEndRef = useRef(null);
    const socketRef = useRef(getChatSocket());

    useEffect(() => {
        setupInitialSocketEvents();
    }, []);

    useEffect(() => {
        scrollToEnd(currentChatMessagesEndRef);
    }, [currentChatMessages]);

    const setupInitialSocketEvents = () => {
        socketRef.current.onmessage = handleSocketMessage;

        const messageData = { source: 'contact_list' };
        sendMessageToSocket(messageData);
    };

    const handleSocketMessage = (event) => {
        const response = JSON.parse(event.data);
        switch (response.source) {
            case 'message_send':
                updateChatMessages(response.data);
                break;
            case 'message_list':
                setCurrentChatMessages(response.data.messages);
                break;
            case 'contact_list':
                setContacts(response.data.contacts);
                setLoading(false); 
                break;
            default:
                break;
        }
    };

    const updateChatMessages = (data) => {
        setCurrentChatMessages((prevMessages) => [...prevMessages, data.message]);
        setContacts((prevContacts) =>
            prevContacts.map((contact) =>
                contact.id === data.sender
                    ? { ...contact, last_message_preview: data.message.message, last_message_created_at: data.message.created_at }
                    : contact
            )
        );
    };

    const sendMessageToSocket = (messageData) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(messageData));
        }
    };

    const scrollToEnd = (ref) => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const selectChat = (chat) => {
        setSelectedChat(chat);
        const messageData = { source: 'message_list', receiver_id: chat.id };
        sendMessageToSocket(messageData);
    };

    const goBackToList = () => {
        setSelectedChat(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const messageData = {
            source: 'message_send',
            receiver_id: selectedChat.id,
            message: newMessage,
        };

        const currentDate = new Date().toISOString();

        sendMessageToSocket(messageData);

        setCurrentChatMessages((prevMessages) => [
            ...prevMessages,
            { id: prevMessages.length + 1, user: "You", message: newMessage },
        ]);
        setContacts((prevContacts) =>
            prevContacts.map((contact) =>
                contact.id === selectedChat.id
                    ? { ...contact, last_message_preview: newMessage, last_message_created_at: currentDate }
                    : contact
            )
        );
        setNewMessage("");
    };

    const filteredContacts = contacts.filter((contact) =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="mx-2 flex h-[85vh]">
            {/* Left Sidebar: Chat List */}
            <div className={`w-full lg:w-2/5 bg-slate-100 lg:border-r border-gray-300 p-4 pt-0 ${selectedChat ? 'hidden lg:block' : 'block'} h-[85vh] overflow-y-auto lg:max-h-screen relative`}>
                <div className='sticky top-0 bg-slate-100 z-10 pt-4'>
                    <h2 className="text-md text-primary font-medium mb-4">My Chats</h2>
                    <Input
                        type="text"
                        placeholder="Search by name..."
                        className="mb-3 sticky top-8 bg-slate-100 z-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    {filteredContacts.length > 0 ? (
                        filteredContacts.map(chat => (
                            <div key={chat.id} className={`flex items-center p-3 rounded-md cursor-pointer ${selectedChat?.id === chat.id ? 'bg-accent' : 'bg-slate-100'} hover:bg-slate-200`}
                                onClick={() => selectChat(chat)}>
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center space-x-3">
                                        <TbUserCircle size={30} className='text-primary' />
                                        <div className="flex flex-col">
                                            <p className="text-primary">{chat.name}</p>
                                            <p className="text-gray-500 text-sm w-40 truncate block">
                                                {/* {(chatHistory[chat.id]?.slice(-1)[0]?.message) || "No currentChatMessages yet"} */}
                                                {chat.last_message_preview}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-gray-500 text-xs">{formatChatPreviewDate(chat.last_message_created_at)}</div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No chats yet.</p>
                    )}
                </div>
            </div>

            {/* Right Section: Chat Window */}
            <div className={`p-4 flex-1 flex flex-col bg-slate-100 ${!selectedChat ? 'hidden lg:flex' : 'block'} h-[85vh] overflow-y-auto lg:max-h-screen`}>
                {selectedChat ? (
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-start gap-3 border-b border-gray-300 pb-2 mb-4">
                            <FaArrowLeft className="text-gray-500 cursor-pointer lg:hidden" onClick={goBackToList} />
                            <div className="flex items-center space-x-3">
                                <TbUserCircle size={35} className='text-primary' />
                                <p className="font-medium text-primary">{selectedChat.name}</p>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-2">
                            {currentChatMessages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.user === "You" ? "justify-end" : "justify-start"} mb-4`}>
                                    <div className={`max-w-xs px-4 py-2 rounded-md shadow-md ${msg.user === "You" ? "bg-secondary text-white" : "bg-white text-gray-800"}`}>
                                        <p className='text-sm'>{msg.user}: {msg.message}</p>
                                    </div>
                                </div>
                            ))}
                            <div ref={currentChatMessagesEndRef} />
                        </div>

                        <form onSubmit={handleSubmit} className="flex items-center space-x-2 border-t border-gray-300 pt-3">
                            <Input
                                type="text"
                                placeholder="Type a message..."
                                className="w-full p-2 border rounded-lg"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <button type="submit">
                                <FaPaperPlane className="text-primary cursor-pointer" />
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center gap-3 justify-center text-gray-500">
                        <PiWechatLogoDuotone size={100} />
                        <p>Select a chat to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );
}
