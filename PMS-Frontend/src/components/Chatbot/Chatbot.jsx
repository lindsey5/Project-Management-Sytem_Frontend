import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useState } from 'react';
import ChatbotContainer from './ChatContainer';
import { Button } from '@mui/material';

const ChatBot = () => {
    const [showChat, setShowChat] = useState(false);

    return <div className="z-10 fixed flex justify-center items-center w-[70px] h-[70px] bottom-5 right-5 rounded-full shadow-lg shadow-purple-500 bg-white">
           <ChatbotContainer onClose={() => setShowChat(false)} show={showChat}/>
            <Button 
                onClick={() => setShowChat(!showChat)}
                sx={{ borderRadius: '50%'}}
            >
                <DotLottieReact
                    src="https://lottie.host/a7bc4fcd-39fc-41b3-88a1-8adbe4f51da9/KdGQ7SD26W.lottie"
                    loop
                    autoplay
                    width={'100%'}
                    height={'100%'}
                />
            </Button>
    </div>
}

export default ChatBot