import { useContext, useEffect, useState } from "react"
import { Avatar, Button, TextField } from "@mui/material"
import { UserContext } from "../../../context/userContext"
import { updateUser } from "../../../services/UserService"
import ChangePassword from "./ChangePassword"

const GeneralSettings = () => {
    const { user } = useContext(UserContext)
    const [updatedUser, setUpdatedUser] = useState();
    const [error, setError] = useState('');
    const [showChangePassword, setShowChangePassword] = useState(false)

    useEffect(() => {
        if(user) setUpdatedUser(user)
    }, [user])

    const handleSave = async () => {
        setError('')
        if(!updatedUser.firstname) setError('Firstname is required')
        else if(!updatedUser.lastname) setError('Lastname is required')
        else {
            const data = {
                ...updatedUser,
                profile_pic: updatedUser.profile_pic.split(',')[1]
            }

            const response = await updateUser(data);
        
            if(response.success) window.location.reload()
        }
    };

    const handleFiles = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUpdatedUser(prev => ({
                    ...prev,
                    profile_pic: reader.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    }

    return <main className="flex-grow p-10">
        <ChangePassword open={showChangePassword} handleClose={() => setShowChangePassword(false)}/>
        <div className="flex gap-5 items-center mb-12">
            <Avatar src={updatedUser?.profile_pic} sx={{ width: '100px', height: '100px'}} />
            <div className="flex flex-col gap-3">
                <h1>Profile Photo</h1>
                <Button variant="outlined" component="label">
                    <input
                        type="file"
                        onChange={handleFiles}
                        style={{ display: 'none' }}
                        accept="image/*"
                    />
                    Upload new picture
                </Button>
            </div>
        </div>
        <p className="mb-4 text-red-600">{error}</p>
        <div className="flex gap-10 mb-12">
            <TextField 
                value={updatedUser?.firstname || ''} 
                onChange={(e) => setUpdatedUser({...updatedUser, firstname: e.target.value})}
                fullWidth 
                label="Firstname"
            />
            <TextField 
                value={updatedUser?.lastname || ''}
                onChange={(e) => setUpdatedUser({...updatedUser, lastname: e.target.value})}
                fullWidth
                label="Lastname"
            />
        </div>
        <div className="mb-12">
            <h1 className="font-bold text-xl">Email:</h1>
            <p>{user?.email}</p>
        </div>
        {user?.changePasswordAllowed && <Button
            onClick={() => setShowChangePassword(true)}
        >Change password</Button>}
        {updatedUser && JSON.stringify(user) !== JSON.stringify(updatedUser) && <div className="flex gap-4">
            <Button variant="contained" onClick={() => handleSave()}>Save</Button>
            <Button 
                variant="outlined" 
                color="error"
                onClick={() => setUpdatedUser(user)}
            >Cancel</Button>
        </div>}
    </main>
}

export default GeneralSettings