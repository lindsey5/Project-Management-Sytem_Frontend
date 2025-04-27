import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useState } from 'react';
import ChatbotContainer from './ChatContainer';
import { Button } from '@mui/material';

const ChatBot = () => {
    const [showChat, setShowChat] = useState(false);

    return <div className="fixed flex justify-center items-center w-[70px] h-[70px] bottom-5 right-5 rounded-full shadow-md shadow-purple-500 bg-white">
           <ChatbotContainer onClose={() => setShowChat(false)} show={showChat}/>
            <Button 
                onClick={() => setShowChat(!showChat)}
                sx={{ borderRadius: '50%'}}
            >
                <DotLottieReact
                        src="https://lottie.host/128ca6c6-0619-49f6-93e9-1bd3836e6b79/x6NfdP4MG5.lottie"
                        loop
                        autoplay
                        width={'100%'}
                    />
            </Button>
    </div>
}

export default ChatBot