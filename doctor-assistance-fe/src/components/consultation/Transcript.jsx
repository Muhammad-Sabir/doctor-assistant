import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { IoCopyOutline, IoCopy } from 'react-icons/io5';
import { IoPlayOutline } from "react-icons/io5";
import { PiPauseLight } from "react-icons/pi";
import { PiStop } from "react-icons/pi";

import { Button } from '@/components/ui/button';
import Pulse from '../shared/Pulse';

export default function TranscriptionPage() {
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { text: "I've been feeling pain in my lower back.", sender: 'Patient', time: '00:05' },
    { text: "I've been feeling pain in my lower back.", sender: 'Doctor', time: '00:10' },
  ]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

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
        text: additionalInfo,
        sender: 'Doctor',
        time: formatTime(elapsedTime),
      };
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);
      setAdditionalInfo('');
    }
  };

  return (
    <div className="mx-2 flex flex-col h-[76vh]">
      <div className="flex-grow overflow-y-auto bg-gray-50">
        {chatMessages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'Doctor' ? 'justify-end' : 'justify-start'} mb-10`}>
            <div className={`${msg.sender === 'Doctor' ? 'bg-gray-200' : 'bg-blue-100'} max-w-lg px-4 py-2 rounded-md shadow-md relative`}>
              <p className="text-sm text-gray-800 break-words">{msg.sender}: {msg.text}</p>
              <p className={`text-xs text-gray-500 absolute -bottom-6 ${msg.sender === 'Doctor' ? 'right-2' : 'left-2'}`}>{msg.time}</p>
            </div>
          </div>
        ))}
        <div ref={transcriptEndRef} />
      </div>

      <div className="w-full h-5 text-sm my-2 flex items-center justify-center relative">
        {isTranscribing && !isPaused ? (
          <div className="flex items-center gap-2">
            <Pulse/>
            <span className="text-gray-500">Listening...</span>
          </div>
        ) : (
          <span className="text-gray-400">Waiting for transcription...</span>
        )}
      </div>

      <div className="px-2 py-2 bg-gray-50 flex items-center">
        <textarea
          className="w-full"
          rows="2"
          placeholder="Add additional notes..."
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
              {isPaused ? <IoPlayOutline/> : <PiPauseLight />} {isPaused ? 'Resume' : 'Pause'}
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
