import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { ArrowLeft, CircleUser, Search, Send } from 'lucide-react-native';

import Loading from '@/components/shared/Loading';
import { useAuth } from '@/contexts/AuthContext';
import { getChatSocket } from '@/utils/getChatSocket';

export default function Chats() {
	
	const { user } = useAuth();
	const [selectedChat, setSelectedChat] = useState(null);
    const [currentChatMessages, setCurrentChatMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const currentChatMessagesEndRef = useRef(null);
    const socketRef = useRef(null);

    useEffect(() => {
        setupInitialSocketEvents();
    }, [getChatSocket]);

    useEffect(() => {
        scrollToEnd(currentChatMessagesEndRef);
    }, [currentChatMessages]);

    const setupInitialSocketEvents = () => {
		socketRef.current = getChatSocket(user.access_token)
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
			case 'contact_list_update':
				prependContact(response.data);
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

	const prependContact = (newContact) => {
		setContacts((prevContacts) => {
			const contactExists = prevContacts.some(contact => contact.id === newContact.id);
			
			return contactExists ? prevContacts : [newContact, ...prevContacts];
		});
	};

    const sendMessageToSocket = (messageData) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(messageData));
        }
    };

	const scrollToEnd = () => {
	  if (currentChatMessagesEndRef.current) {
	    currentChatMessagesEndRef.current.scrollToEnd({ animated: true });
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
		<KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
			<View className="flex-1 w-full max-w-7xl mx-auto px-5 py-5 bg-white">
				<View className={`${selectedChat ? 'hidden' : 'block'} h-full overflow-y-auto`}>

					<View className="flex-row items-center border border-gray-300 rounded-md px-3">
						<TextInput className="flex-1 p-2 border-0" value={searchQuery}
							onChangeText={setSearchQuery} placeholder="Search chats by name..."
						/>
						<Text className="p-2"><Search color="hsl(203, 87%, 30%)" size={20} /></Text>
					</View>

					{/*chat list */}
					<FlatList data={filteredContacts} keyExtractor={(item) => item.id.toString()}
						renderItem={({ item }) => (
							<TouchableOpacity className={`flex items-center p-3 mt-3 rounded-md cursor-pointer ${selectedChat?.id === item.id ? 'bg-accent' : 'bg-white'}`}
								onPress={() => selectChat(item)}
							>
								<View className="flex-row items-center justify-between w-full gap-4">
									<CircleUser size={40} color="grey" />
									<View className="flex-1">
										<View className='flex-row justify-between items-center'>
											<Text className="text-primary font-semibold text-lg">{item.name}</Text>
											<Text className="text-gray-500 text-sm mt-1">{item.date}</Text>
										</View>
										<Text className="text-gray-500" numberOfLines={1} ellipsizeMode="tail" style={{ width: 270 }}>
											{/* {(chatHistory[item.id]?.slice(-1)[0]?.message) || "No currentChatMessages yet"} */}
											{item.last_message_preview}
										</Text>
									</View>
								</View>

							</TouchableOpacity>
						)}
						ListEmptyComponent={<Text>No chats yet.</Text>}
					/>
				</View>

				<View className={`flex-1 bg-white h-full overflow-y-auto ${!selectedChat ? 'hidden' : 'block'}`}>
					{selectedChat && (
						<View className="flex-1">

							<View className="border-b border-gray-300 pb-3 mb-2">
								<View className="flex-row items-center justify-start w-full gap-3">
									<TouchableOpacity onPress={goBackToList}>
										<ArrowLeft color='grey' className="text-gray-500 cursor-pointer" />
									</TouchableOpacity>
									<CircleUser size={40} color="grey" />
									<Text className="text-primary font-semibold text-lg">{selectedChat.name}</Text>
								</View>
							</View>

							<FlatList
								data={currentChatMessages}
								keyExtractor={(msg) => msg.id.toString()}
								renderItem={({ item }) => (
									<View style={{ alignItems: item.user === "You" ? "flex-end" : "flex-start", width: '100%' }} className="my-2">
										<View className={`px-4 py-3 rounded-md border border-gray-200 ${item.user === "You" ? "bg-accent text-white" : "bg-white text-gray-700"}`}
											style={{ maxWidth: 380 }}
										>
											<Text className='text-gray-700'>{item.message}</Text>
										</View>
									</View>
								)}
								ref={currentChatMessagesEndRef}
								onContentSizeChange={scrollToEnd}
							/>

							<View className="flex flex-row items-center border-t border-gray-300 gap-3 pt-4 mt-2">
								<View className="flex-row items-center border border-gray-300 rounded-md px-3" style={{ width: 280 }}>
									<TextInput className="flex-1 p-2 border-0" value={newMessage}
										onChangeText={setNewMessage} placeholder="Type a message..."
									/>
								</View>
								<TouchableOpacity onPress={handleSubmit}>
									<Send size={25} color="hsl(203, 87%, 30%)" />
								</TouchableOpacity>
							</View>

						</View>
					)}
				</View>
			</View>
		</KeyboardAvoidingView>
	);
}