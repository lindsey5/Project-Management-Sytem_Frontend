import { useContext, useEffect, useState } from "react";
import { deleteMember, getMembers, leaveProject } from "../../../../services/MemberService";
import { useSearchParams } from "react-router-dom";
import CustomizedTable from "../../../../components/table";
import { ProjectContext } from "../../../../layouts/ProjectLayout";
import { StyledTableCell, StyledTableRow } from "../../../../components/table";
import { Avatar, Button, IconButton, Menu, MenuItem, TableRow } from "@mui/material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { UserContext } from "../../../../context/userContext";
import { ConfirmDialog } from "../../../../components/dialog";
import { formatDateTime } from "../../../../utils/utils";
import UpdateMember from "./UpdateMember";
import Invite from "./Invite";

const Team = () => {
    const [members, setMembers] = useState([]);
    const { project, role } = useContext(ProjectContext);
    const { user } = useContext(UserContext);
    const [searchParams] = useSearchParams();
    const project_code = searchParams.get('c');
    const [anchorEl, setAnchorEl] = useState(null);
    const [menuMemberId, setMenuMemberId] = useState(null);
    const open = Boolean(anchorEl);
    const [member, setMember] = useState(null);
    const [openRemove, setOpenRemove] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);
    const [showLeave, setShowLeave] = useState(false);
    const [showInvite, setShowInvite] = useState(false);

    const handleShowRemove = (member) => {
        setMember(member);
        setOpenRemove(true);
    };

    const handleCloseRemove = () => {
        setMember(null);
        setOpenRemove(false);
    };

    const handleClick = (event, memberId) => {
        setAnchorEl(event.currentTarget);
        setMenuMemberId(memberId);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setMenuMemberId(null);
    };

    const handleShowLeave = () => {
        setShowLeave(true);
    }

    const handleCloseLeave = () => {
        setShowLeave(false)
    }

    useEffect(() => {
        const fetchMembers = async () => {
            const response = await getMembers(project_code);
            if (response.success) {
                const fetchedMembers = response.members.map(r => {
                    const { user, ...rest } = r;
                    const { id, ...userWithoutId } = user;
                    return { ...rest, ...userWithoutId };
                });
                setMembers(fetchedMembers);
            }
        };

        fetchMembers();
    }, []);

    const handleCLoseUpdate = async () => {
        setMember(null)
        setShowUpdate(false);
    };

    const handleRemove = async () => {
        const response = await deleteMember(member.id);
        if (response.success) window.location.reload();
    };

    const handleLeave = async () => {
        const response = await leaveProject(project.id)
        if(response.success) window.location.reload();
    }
    
    return (
        <main className="w-full h-full overflow-y-auto p-5">
            <Invite 
                project_id={project.id}
                handleClose={() => setShowInvite(false)}
                open={showInvite}
            />
            {role === 'Admin' && 
                <div className="w-full flex justify-end mb-5">
                    <Button variant="contained" onClick={() => setShowInvite(true)}>Invite</Button>
                </div>
            }
            <CustomizedTable
                cols={
                    <TableRow>
                        <StyledTableCell align="left">Fullname</StyledTableCell>
                        <StyledTableCell align="left">Email</StyledTableCell>
                        <StyledTableCell align="center">Role</StyledTableCell>
                        <StyledTableCell align="center">Joined At</StyledTableCell>
                        <StyledTableCell align="center">Added by</StyledTableCell>
                        {role === 'Admin' && <StyledTableCell align="center">Action</StyledTableCell>}
                    </TableRow>
                }
                rows={
                    members.length > 0 && members.map((member, i) => (
                        <StyledTableRow key={i}>
                            <StyledTableCell sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar
                                    src={`data:image/jpeg;base64,${member.profile_pic}`}
                                    sx={{ width: 40, height: 40 }}
                                />
                                {member.firstname} {member.lastname} {member.email === user.email && '(You)'}
                            </StyledTableCell>
                            <StyledTableCell align="left">{member.email}</StyledTableCell>
                            <StyledTableCell align="center">{member.role}</StyledTableCell>
                            <StyledTableCell align="center">{formatDateTime(member.joined_At)}</StyledTableCell>
                            <StyledTableCell align="center">
                               {member?.user_Added_by?.firstname} {member?.user_Added_by?.lastname}
                            </StyledTableCell>
                            {role === 'Admin' && (
                                <StyledTableCell align="center">
                                    {((user.email === project.user.email && user.email !== member.email) ||
                                        (member.user_Id !== project.user_id && member.role !== 'Admin')) && (
                                        <>
                                            <IconButton
                                                id={`basic-button-${member.id}`}
                                                aria-controls={open && menuMemberId === member.id ? 'basic-menu' : undefined}
                                                aria-haspopup="true"
                                                aria-expanded={open && menuMemberId === member.id ? 'true' : undefined}
                                                onClick={(e) => handleClick(e, member.id)}
                                            >
                                                <MoreHorizIcon fontSize="inherit" />
                                            </IconButton>

                                            {menuMemberId === member.id && (
                                                <Menu
                                                    id="basic-menu"
                                                    anchorEl={anchorEl}
                                                    open={open}
                                                    onClose={handleClose}
                                                >
                                                    {role === "Admin" && menuMemberId === member.id && <MenuItem
                                                        onClick={() => {
                                                            setMember(member);
                                                            setShowUpdate(true);
                                                        }}
                                                    >
                                                        Edit
                                                    </MenuItem>}
                                                    <MenuItem
                                                        onClick={() => {
                                                            handleShowRemove(member);
                                                        }}
                                                    >
                                                        Remove
                                                    </MenuItem>
                                                </Menu>
                                            )}
                                        </>
                                    )}
                                </StyledTableCell>
                            )}
                        </StyledTableRow>
                    ))
                }
            />
            {user.email !== project.user.email && <Button 
                sx={{ marginTop: '20px'}}
                variant="contained" 
                color="error"
                onClick={handleShowLeave}
            >Leave Project</Button>}
            <UpdateMember 
                closeModal={handleCLoseUpdate}
                open={member !== null && showUpdate}
                member={member}
            />

            <ConfirmDialog
                title="Delete"
                text="Are you sure you want to remove this user?"
                handleClose={handleCloseRemove}
                handleAgree={handleRemove}
                isOpen={member != null && openRemove}
                variant="error"
            />

            <ConfirmDialog 
                title="Confirm"
                text="Are you sure you want to leave this project?"
                handleClose={handleCloseLeave}
                handleAgree={handleLeave}
                isOpen={showLeave}
                variant="error"
            />
        </main>
    );
};

export default Team;
