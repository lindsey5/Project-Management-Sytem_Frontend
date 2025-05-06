import { useContext, useEffect, useState } from "react";
import { deleteMember, getMembers, updateMember } from "../../../../services/MemberService";
import { useSearchParams } from "react-router-dom";
import CustomizedTable from "../../../../components/table";
import { ProjectContext } from "../../../../layouts/ProjectLayout";
import { StyledTableCell, StyledTableRow } from "../../../../components/table";
import { Avatar, IconButton, Menu, MenuItem, TableRow } from "@mui/material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { UserContext } from "../../../../context/userContext";
import { ConfirmDialog } from "../../../../components/dialog";
import { formatDateTime, convertToAsiaTime } from "../../../../utils/utils";
import UpdateMember from "./UpdateMember";

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

    return (
        <main className="w-full h-full overflow-y-auto py-10 p-5">
            <CustomizedTable
                cols={
                    <TableRow>
                        <StyledTableCell align="left">Fullname</StyledTableCell>
                        <StyledTableCell align="left">Email</StyledTableCell>
                        <StyledTableCell align="left">Role</StyledTableCell>
                        <StyledTableCell align="left">Joined At</StyledTableCell>
                        {role === 'Admin' && <StyledTableCell align="left">Action</StyledTableCell>}
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
                                {member.firstname} {member.lastname}
                            </StyledTableCell>
                            <StyledTableCell align="left">{member.email}</StyledTableCell>
                            <StyledTableCell align="left">{member.role}</StyledTableCell>
                            <StyledTableCell align="left">
                                {formatDateTime(convertToAsiaTime(member.joined_At))}
                            </StyledTableCell>
                            {role === 'Admin' && (
                                <StyledTableCell align="left">
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
        </main>
    );
};

export default Team;
