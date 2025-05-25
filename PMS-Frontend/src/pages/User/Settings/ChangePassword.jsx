import { Button, Modal } from "@mui/material"
import PasswordField from "../../../components/PasswordField"
import { useState } from "react"
import { isStrongPassword } from "../../../utils/utils"
import { changePassword } from "../../../services/AuthService"

const ChangePassword = ({ open, handleClose}) => {
    const [error, setError] = useState('');
    const [data, setData] = useState({
        password: '',
        newPassword: '',
        confirmPassword: ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if(data.newPassword !== data.confirmPassword) setError('Password doesn\'t matched')
        else if(isStrongPassword(data.newPassword)) setError(isStrongPassword(data.newPassword))
        else {
            const response = await changePassword({ password: data.password, newPassword: data.newPassword})
                
            if(response.success) window.location.reload();
            else setError(response.message)
        }
    }

    return <Modal open={open} onClose={handleClose}>
        <form 
            className="w-[400px] flex flex-col gap-8 bg-white p-5 fixed top-1/2 left-1/2 
            transform -translate-1/2 rounded-xl p-10"
            onSubmit={handleSubmit}
        >
            <h1 className="text-2xl font-bold">Change your password</h1>
            <p className="text-red-600">{error}</p>
            <PasswordField 
                label="Current password" 
                onChange={(e) => setData({ ...data, password: e.target.value})}
            />
            <PasswordField 
                label="New password" 
                onChange={(e) => setData({ ...data, newPassword: e.target.value})}
            />
            <PasswordField 
                label="Confirm new password" 
                onChange={(e) => setData({ ...data, confirmPassword: e.target.value})}
            />
            <Button
                type="submit"
                variant="contained"
            >Change Password</Button>
        </form>
    </Modal>
}

export default ChangePassword