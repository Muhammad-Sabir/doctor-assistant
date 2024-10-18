import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { IoCopyOutline, IoCopy, IoPlayOutline } from 'react-icons/io5';
import { PiPauseLight, PiStop  } from "react-icons/pi";
import { TbUserCircle } from 'react-icons/tb';

import { Button } from '@/components/ui/button';

import Pulse from '@/components/shared/Pulse';
import { dummyTranscript } from '@/assets/data/dummyChats';

export default function TranscriptionPage() {
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [chatMessages, setChatMessages] = useState(dummyTranscript);
  
  const transcriptEndRef = useRef(null);

  const scrollToEnd = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    let timer;
    if (isTranscribing && !isPaused) {
      timer = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTranscribing, isPaused]);

  useEffect(() => {
    scrollToEnd(transcriptEndRef);
  }, [chatMessages]);

  const formatTime = (seconds) => {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${minutes}:${secs}`;
  };

  const handleStart = () => {
    setIsTranscribing(true);
    setElapsedTime(0);
  };

  const handleStop = () => {
    setIsTranscribing(false);
    setIsPaused(false);
    setElapsedTime(0);
  };

  const togglePauseResume = () => {
    setIsPaused((prev) => !prev);
  };

  const handleCopy = () => {
    const textToCopy = chatMessages.map(msg => `${msg.sender}: ${msg.text} (${msg.time})`).join('\n');
    navigator.clipboard.writeText(textToCopy).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1000);
    });
  };

  const handleSend = () => {
    if (additionalInfo.trim()) {
      const newMessage = {
        id: chatMessages.length + 1,
        text: additionalInfo,
        sender: 'Doctor',
        time: formatTime(elapsedTime),
      };
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);
      setAdditionalInfo('');
    }
  };

  const handleEditMessage = (e, id) => {
    const updatedText = e.target.textContent;
    setChatMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === id ? { ...msg, text: updatedText } : msg
      )
    );
    console.log(`Message ${id} updated to:`, updatedText);
  };

  return (
    <div className="mx-2 flex flex-col h-[76vh]">
      <div className="flex-grow overflow-y-auto bg-gray-50">
        {chatMessages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'Doctor' ? 'justify-end' : 'justify-start'} mb-10`}>
            <div className={`flex items-center ${msg.sender === 'Doctor' ? 'flex-row-reverse' : ''} gap-3`}>
              <TbUserCircle size={30} className="text-gray-400" />
              
              <div className={`${msg.sender === 'Doctor' ? 'bg-blue-100' : 'bg-gray-200'} max-w-lg px-4 py-2 rounded-md shadow-md relative`}>
                <div className='flex text-sm text-gray-800 gap-1'>
                  <span>{msg.sender}:</span>
                  <div contentEditable suppressContentEditableWarning={true}  onBlur={(e) => handleEditMessage(e, msg.id)} className="break-words focus:text-primary focus:outline-none">
                    {msg.text}
                  </div>
                </div>
                <p className={`text-xs text-gray-500 absolute -bottom-6 ${msg.sender === 'Doctor' ? 'right-2' : 'left-2'}`}>{msg.time}</p>
              </div>
            
            </div>
          </div>
        ))}
        <div ref={transcriptEndRef} />
      </div>

      <div className="w-full h-5 text-sm my-2 flex items-center justify-center relative">
        {isTranscribing && !isPaused ? (
          <Pulse/>
        ) : (
          <span className="text-gray-400">Waiting for transcription...</span>
        )}
      </div>

      <div className="px-2 py-2 bg-gray-50 flex items-center">
        <textarea
          className="w-full"
          rows="2"
          placeholder="Add additional Info..."
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
        />
        <button onClick={handleSend}>
          <FaPaperPlane className="text-primary cursor-pointer ml-3" />
        </button>
      </div>

      <div className="px-2 pt-2 bg-white flex justify-end gap-3">
        {!isTranscribing ? (
          <Button onClick={handleStart} className="flex items-center gap-2">
            <IoPlayOutline /> Start
          </Button>
        ) : (
          <div className="flex items-center gap-3">
            <Button onClick={handleStop} className="bg-red-600 hover:bg-red-600/90 flex items-center gap-2">
              <PiStop /> Stop
            </Button>
            <Button
              onClick={togglePauseResume}
              className={`flex items-center gap-2 ${isPaused ? 'bg-green-500 hover:bg-green-500/90' : 'bg-yellow-500 hover:bg-yellow-500/90'} text-white px-4 py-2 rounded-lg`}
            >
              {isPaused ? <IoPlayOutline /> : <PiPauseLight />} {isPaused ? 'Resume' : 'Pause'}
            </Button>
          </div>
        )}

        <Button onClick={handleCopy} variant='outline'>
          {isCopied ? <IoCopy /> : <IoCopyOutline />}
        </Button>
      </div>
    </div>
  );
}
