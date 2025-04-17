import { useContext, useEffect, useState } from "react"
import { getMembers } from "../../../services/MemberService";
import { useSearchParams } from "react-router-dom";
import CustomizedTable from "../../../components/table";
import { ProjectContext } from "../../../layouts/ProjectLayout";
import { StyledTableCell, StyledTableRow } from "../../../components/table";
import { Avatar } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { UserContext } from "../../../context/userContext";
import { TableRow } from "@mui/material";
import { ConfirmDialog } from "../../../components/dialog";
import { formatDateTime, convertToAsiaTime } from "../../../utils/utils";

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
                const fetchedMembers = response.members.map(r => {
                    const { user, ...rest } = r
                    const { id, ...userWithoutId } = user
                    return {...rest, ...userWithoutId}
                })
                setMembers(fetchedMembers);
            }
        }

        fetchMembers();
    },[])
    

    return <main className="w-full h-full overflow-y-auto py-10 p-5">
        <CustomizedTable
            cols={<TableRow>
                    <StyledTableCell align="left">Fullname</StyledTableCell>
                    <StyledTableCell align="left">Email</StyledTableCell>
                    <StyledTableCell align="left">Role</StyledTableCell>
                    <StyledTableCell align="left">Joined At</StyledTableCell>
                    {role === 'Admin' && <StyledTableCell align="left">Action</StyledTableCell>}
            </TableRow>}
            rows={members.length > 0 && members.map((member, i) => {
                return <StyledTableRow key={i}>
                    <StyledTableCell
                        sx={{display: 'flex', alignItems: 'center', gap: 2}}
                    >
                        <Avatar
                            src={`data:image/jpeg;base64,${member.profile_pic}`}
                            sx={{ width: 40, height: 40 }}
                        />
                        {member.firstname} {member.lastname}
                    </StyledTableCell>
                    <StyledTableCell align="left">{member.email}</StyledTableCell>
                    <StyledTableCell align="left">{member.role}</StyledTableCell>
                    <StyledTableCell align="left">{formatDateTime(convertToAsiaTime(member.joined_At))}</StyledTableCell>
                    {role === 'Admin' &&  <StyledTableCell align="left">
                        {project.user_id !== member.user_Id && 
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
        <ConfirmDialog
            title="Delete"
            text="Are you sure do you want to remove?"
            handleClose={handleCloseRemove} 
            isOpen={memberId}
            variant="error"
        />
    </main>
}

export default Team