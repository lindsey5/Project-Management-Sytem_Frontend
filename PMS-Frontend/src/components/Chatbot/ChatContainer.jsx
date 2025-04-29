import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { IconButton, TextField } from '@mui/material';
import { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import MicIcon from '@mui/icons-material/Mic';

const ai = new GoogleGenAI({ apiKey: "AIzaSyA4CX6hyhMv2Xb4y9-l3zh8t-ZCplI13SU" }); 

const ChatbotContainer = ({ onClose, show}) => {
    const [message, setMessage] = useState('');
    const [chats, setChats] = useState([
        { from: 'bot', message: 'Hello. How can I help you today?' }
    ]);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const [isRecording, setIsRecording] = useState(false);
    const [isAudioSending, setIsAudioSending] = useState(false);
    const [selectedVoice, setSelectedVoice] = useState(null);

    useEffect(() => {
        const loadVoices = () => {
          const availableVoices = window.speechSynthesis.getVoices();
          const femaleVoices = availableVoices.filter(voice => voice.name.toLowerCase().includes('female'));
          if (femaleVoices.length > 0) {
            setSelectedVoice(femaleVoices[0]); 
          }
        };
    
        window.speechSynthesis.onvoiceschanged = loadVoices;
        loadVoices();

        return () => speechSynthesis.cancel();
      }, []);

    const handleSubmit = async () => {
        if (!message.trim()) return;
        setChats(prev => [...prev, { from: 'user', message }]);
        setMessage('');
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: message,
                config: {
                    systemInstruction: "You are a chatbot for project management system don't use asterisk",
                },
            });
            const text = response.text; 
            if (text) {
                speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(text.replace(/\*/g, ''));
                utterance.voice = selectedVoice;
                speechSynthesis.speak(utterance);
                setChats(prev => [...prev, { from: 'bot', message: text }]);
            } else {
                console.error('AI Response Error: No text in response');
                setChats(prev => [...prev, { from: 'bot', message: 'Sorry, I didn\'t get a text response.' }]);
            }
        } catch (error) {
            setChats(prev => [...prev, { from: 'bot', message: 'Sorry, there was an error communicating with the AI.' }]);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = async () => {
                speechSynthesis.cancel();
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' }); 
                const audioUrl = URL.createObjectURL(audioBlob);
                setChats(prev => [...prev, { from: 'user', type: "audio", message: audioUrl }]);
                audioChunksRef.current = [];
                setIsAudioSending(true);
                try {
                    const arrayBuffer = await audioBlob.arrayBuffer();
                    const base64Audio = btoa(new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));

                    const response = await ai.models.generateContent({
                        model: "gemini-2.0-flash",
                        contents: [{
                            parts: [{
                                inlineData: {
                                    data: base64Audio,
                                    mimeType: 'audio/webm',
                                },
                            }],
                        }],
                        config: {
                            systemInstruction: "You are a chatbot for project management system. Transcribe and answer the user's query from the audio.",
                        },
                    });
                    const text = response.text;
                    if (text) {
                        const utterance = new SpeechSynthesisUtterance(text.replace(/\*/g, ''));
                        utterance.voice = selectedVoice;
                        speechSynthesis.speak(utterance);
                        setChats(prev => [...prev, { from: 'bot', message: text }]);
                    } else {
                        console.error('AI Audio Response Error: No text in response');
                        setChats(prev => [...prev, { from: 'bot', message: 'Sorry, I didn\'t understand the audio.' }]);
                    }
                } catch (error) {
                    console.error('AI Audio Error:', error);
                    setChats(prev => [...prev, { from: 'bot', message: 'Sorry, I couldn\'t process the audio.' }]);
                } finally {
                    setIsRecording(false);
                    setIsAudioSending(false);
                }
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error('Failed to start recording:', err);
            setChats(prev => [...prev, { from: 'bot', message: 'Failed to access your microphone.' }]);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
    };

    return (
        <div className={`flex flex-col absolute bg-white w-[350px] h-[500px]
            transition-all duration-500 ease-in-out -top-127 left-1/2
            -translate-x-full rounded-lg shadow-md ${show ? 'flex' : 'hidden'}`}>
            <div className='bg-black p-3 rounded-tl-md rounded-tr-md flex justify-between items-center'>
                <h1 className='text-white font-bold text-xl'>ProjexBot</h1>
                <IconButton size='medium' onClick={onClose}>
                    <CloseIcon fontSize='inherit' sx={{ color: 'white' }} />
                </IconButton>
            </div>
            <div className='flex-1 flex flex-col overflow-y-auto' id="container">
                {chats.map((chat, index) => (
                    <div key={index} className={`w-full p-3 flex gap-5 p-3 list-none items-center ${chat.from === 'bot' ? 'justify-start' : 'justify-end'}`}>
                        <li
                            className={`border-1 border-gray-200 shadow-sm p-3 rounded-md ${chat.from === 'bot' ?  'bg-white shadow-purple-500' : 'bg-black text-white'}`}
                        >{chat.type === 'audio' ? <audio controls src={chat.message} className="mt-4"></audio> : chat.message}</li>
                    </div>
                ))}
            </div>

            <div className='w-full p-3 flex gap-3 items-center'>
                {!isAudioSending && !isRecording && <TextField
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                    sx={{
                        flex: 1,
                        '& .MuiOutlinedInput-root': {
                            height: '45px',
                            '&:hover fieldset': {
                                borderColor: '#9137db',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#9137db',
                            },
                        },
                        input: { fontSize: '15px', borderColor: 'black' }
                    }}
                />} 
                {!isAudioSending && isRecording && <div className='flex-1'>Recording audio...</div>}
                {isAudioSending && <div className='flex-1'>Bot is thinking...</div>}
                <div>
                    {!isRecording && <IconButton onClick={handleSubmit} disabled={isAudioSending}>
                        <SendIcon sx={{ color: 'black' }} />
                    </IconButton>}
                    <IconButton onClick={!isRecording ? startRecording : stopRecording} disabled={isAudioSending}>
                        {!isRecording ? <MicIcon sx={{ color: 'black' }} /> : <CloseIcon />}
                    </IconButton>
                </div>
            </div>
        </div>
    );
};

export default ChatbotContainer;