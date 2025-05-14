import { Button, Modal, TextField } from "@mui/material"
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import { useEffect, useState } from "react";
import { sendInvitation } from '../../../../services/InvitationService';
import { toast } from "react-toastify";

const ModalStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
}

const Invite = ({ open, handleClose, project_id }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        setError('');
        const response = await sendInvitation({
            project_id,
            email,
            message
        });
        
        if(response.success) {
            toast.success("Invitation sent.")
            setEmail('');
            setMessage('');
        }else{
            setError(response.message || response.errors.Email)
        }
    }

    return <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
        sx={ModalStyle}
    >
        <div className="rounded-lg bg-white p-10 w-[95%] max-w-[400px]">
            <div className="flex gap-3 items-center">
                <MailOutlinedIcon fontSize="large"/>
                <h1 className="font-bold text-2xl">Send Invitation</h1>
            </div>
            <p className="text-red-500 mt-4">{error}</p>
            <TextField 
                label="Email" 
                sx={{ width: '100%', marginTop: '30px'}}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
             <TextField 
                label="Message" 
                sx={{ width: '100%', marginTop: '30px'}}
                multiline
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
             />
            <Button 
                onClick={handleSubmit}
                variant="contained" 
                sx={{ width: '100%', marginTop: '20px'}
            }>
                Invite
            </Button>
            <Button 
                onClick={() => handleClose()}
                variant="outlined" sx={{ width: '100%', marginTop: '20px'}}
            >
                Close
            </Button>
        </div>

    </Modal>
}

export default Invite