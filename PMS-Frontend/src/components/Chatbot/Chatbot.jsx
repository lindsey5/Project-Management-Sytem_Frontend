import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useState } from 'react';
import ChatbotContainer from './ChatContainer';
import { Button } from '@mui/material';

const ChatBot = () => {
    const [showChat, setShowChat] = useState(false);

    return <div className="fixed bottom-5 right-5 rounded-full shadow-md shadow-purple-500 bg-white">
            {showChat && <ChatbotContainer onClose={() => setShowChat(false)}/>}
            <Button 
                onClick={() => setShowChat(!showChat)}
                sx={{ borderRadius: '50%'}}
            >
                <DotLottieReact
                        src="https://lottie.host/128ca6c6-0619-49f6-93e9-1bd3836e6b79/x6NfdP4MG5.lottie"
                        loop
                        width={32}
                        height={32}
                        autoplay
                    />
            </Button>
    </div>
}

export default ChatBot