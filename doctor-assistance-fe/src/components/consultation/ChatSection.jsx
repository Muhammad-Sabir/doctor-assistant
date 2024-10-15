import React, { useState, useRef, useEffect } from 'react';
import { TbUserCircle } from 'react-icons/tb';
import { Input } from '@/components/ui/input';
import { FaPaperPlane } from 'react-icons/fa';

export default function ChatSection() {
    const [messages, setMessages] = useState([
        { id: 1, user: 'Amina Khan', message: "Hi! I'm looking to work with a designer." },
        { id: 2, user: 'You', message: "That sounds interesting! I'd love to help." },
    ]);

    const [newMessage, setNewMessage] = useState('');
    const messageEndRef = useRef(null);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
            setMessages([...messages, { id: messages.length + 1, user: 'You', message: newMessage }]);
            setNewMessage('');
        }
    };

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const patientName = messages.find((msg) => msg.user !== 'You')?.user || 'Unknown User';

    return (
        <div className="flex flex-col bg-white lg:w-1/3 lg:border-l border-gray-300">
            <h2 className="text-md text-primary font-medium mb-4 mt-2 lg:hidden">Your Chat with {patientName}:</h2>
            <div className="flex items-center justify-start gap-3 border-b border-gray-300 pb-2 px-4 mb-4">
                <TbUserCircle size={35} className='text-primary' />
                <p className="font-medium text-primary">{patientName}</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.user === "You" ? "justify-end" : "justify-start"} mb-4`}>
                        <div className={`max-w-xs px-4 py-2 rounded-md shadow-md ${msg.user === "You" ? "bg-secondary text-white" : "bg-white text-gray-800"}`}>
                            <p className='text-sm'>{msg.user}: {msg.message}</p>
                        </div>
                    </div>
                ))}
                <div ref={messageEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2 border-t p-4 border-gray-300 pt-3">
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
    );
}
