import { useContext, useEffect, useState } from "react"
import { getMembers } from "../../../services/MemberService";
import { useSearchParams } from "react-router-dom";
import CustomizedTables from "../../../components/table";
import { ProjectContext } from "../../../layouts/ProjectLayout";
import { StyledTableCell, StyledTableRow } from "../../../components/table";
import { Avatar } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { UserContext } from "../../../context/userContext";
import { TableRow } from "@mui/material";
  
const CancelDialog = ({ isOpen, title, text, handleClose, handleAgree }) => {
    return (
      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {text}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button 
                onClick={handleClose}
                sx={{ backgroundColor: "white", color: "gray", ":hover": {
                    backgroundColor: "#fee2e2"
                }}}
            >No</Button>
            <Button 
                onClick={handleAgree}
                sx={{ backgroundColor: '#dc3545', color: 'white', ":hover": {
                    backgroundColor: "#c82333"
                }}}
            >Yes</Button>
        </DialogActions>
      </Dialog>
    );
  };


const Team = () => {
    const [members, setMembers] = useState([]);
    const { project, role } = useContext(ProjectContext);
    const { user } = useContext(UserContext);
    const [searchParams] = useSearchParams();
    const project_code = searchParams.get('c');
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [memberId, setMemberId] = useState(null);

    const handleShowRemove = (id) => {
        setMemberId(id);
    }

    const handleCloseRemove = () => {
        setMemberId(null)
    }

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    useEffect(() => {
        const fetchMembers = async () => {
            const response = await getMembers(project_code);

            if(response.success){
                const fetchedMembers = response.members.map(r => ({...r.user, role: r.role, joined_at: r.joined_At}))
                
                setMembers([{...response.creator, role: 'Admin'}, ...fetchedMembers]);
            }
        }

        fetchMembers();
    },[])
    

    return <main className="w-full h-full overflow-y-auto py-10 p-5">
        <CustomizedTables 
            cols={<TableRow>
                    <StyledTableCell align="center">Fullname</StyledTableCell>
                    <StyledTableCell align="center">Email</StyledTableCell>
                    <StyledTableCell align="center">Role</StyledTableCell>
                    <StyledTableCell align="center">Joined At</StyledTableCell>
                    {role === 'Admin' && <StyledTableCell align="center">Action</StyledTableCell>}
            </TableRow>}
            rows={members.length > 0 && members.map((member, i) => {
                return <StyledTableRow key={i}>
                    <StyledTableCell
                        sx={{display: 'flex', alignItems: 'center', gap: 2, paddingX: 10}}
                    >
                        <Avatar
                            src={`data:image/jpeg;base64,${member.profile_pic}`}
                            sx={{ width: 40, height: 40 }}
                        />
                        {member.firstname} {member.lastname}
                    </StyledTableCell>
                    <StyledTableCell align="center">{member.email}</StyledTableCell>
                    <StyledTableCell align="center">{member.role}</StyledTableCell>
                    <StyledTableCell align="center">{new Date(member.role === 'Admin' ? project.created_At : member.joined_at).toLocaleDateString()}</StyledTableCell>
                    {role === 'Admin' &&  <StyledTableCell align="center">
                        {project.user_id !== member.id && 
                        user.id !== member.id && <>
                        <IconButton 
                            id="basic-button"
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                        >
                            <MoreHorizIcon fontSize="inherit" />
                        </IconButton>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                            'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuItem onClick={handleClose}>Edit</MenuItem>
                            <MenuItem onClick={() => handleShowRemove(member.id)}>Remove</MenuItem>
                        </Menu>
                        </>}
                    </StyledTableCell>}
                </StyledTableRow>
            })}
        />
        <CancelDialog 
            title="Delete"
            text="Are you sure do you want to remove?"
            handleClose={handleCloseRemove} 
            isOpen={memberId}
            variant="error"
        />
        
    </main>
}

export default Team