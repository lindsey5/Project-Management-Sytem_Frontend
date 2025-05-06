import { Avatar, Modal, Select, FormControl, InputLabel, MenuItem, Button } from "@mui/material"
import { useEffect, useState } from "react"
import { ConfirmDialog } from "../../../../components/dialog";
import { updateMember } from "../../../../services/MemberService";

const roles = ["Admin", "Editor", "Member", "Viewer"];

const UpdateMember = ({ open, closeModal, member}) => {
    const [role, setRole] = useState('');
    const [showDialog, setShowDialog] = useState(false);


    useEffect(() => {
        if(member?.role) setRole(member.role)
    }, [member])

    const handleSave = async () => {
         const response = await updateMember(member.id, { role });
         if(response.success) window.location.reload();
    }

    return <Modal open={open}
        onClose={closeModal}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
        sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', overflowY: 'auto'}}
    >
        <div className="flex flex-col gap-8 p-10 bg-white rounded-lg max-w-[300px] w-[95%]">
            <h1 className="font-bold text-2xl mb-4">Edit member</h1>
            <div className="flex items-center gap-3">
                <Avatar 
                    src={`data:image/jpeg;base64,${member?.profile_pic}`}
                    sx={{ width: '60px', height: '60px'}}
                />
                <h1>{member?.firstname} {member?.lastname}</h1>
            </div>
            <FormControl>
                <InputLabel id="demo-simple-select-label">Role</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    {roles.map(role => 
                    <MenuItem key={role} value={role}>
                    {role}
                    </MenuItem>)}
                </Select>
            </FormControl>
            <Button variant="contained" onClick={() => setShowDialog(true)}>Save</Button>
            <ConfirmDialog
                title="Update"
                text="Are you sure you want to update this?"
                isOpen={showDialog}
                handleAgree={handleSave}
                handleClose={() => setShowDialog(false)}
                variant="success"
            />
        </div>
    </Modal>
}

export default UpdateMember