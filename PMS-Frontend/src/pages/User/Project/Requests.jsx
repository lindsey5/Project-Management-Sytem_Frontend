import { useContext, useEffect, useReducer, useState } from "react"
import { getRequest, updateRequest } from "../../../services/RequestService"
import { ProjectContext } from "../../../layouts/ProjectLayout"
import CustomizedTable from "../../../components/table"
import { TableRow, Avatar, IconButton, Stack } from "@mui/material";
import { StyledTableCell, StyledTableRow } from "../../../components/table";
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { convertToAsiaTime, formatDateTime } from "../../../utils/utils";
import { Tooltip } from "@mui/material";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Pagination from '@mui/material/Pagination';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { ConfirmDialog } from "../../../components/dialog";
import { createMember } from "../../../services/MemberService";
import { useNavigate } from "react-router-dom";
import UpdateMember from "./Team/UpdateMember";

const requestPaginationState = {
    page:  1,
    limit: 50,
    status: "Pending",
    searchTerm: "",
    totalPages: 1,
}

const requestReducer = (state, action) => {
    switch(action.type){
        case "SET_PAGE":
            return {...state, page: action.payload}
        case "SET_LIMIT":
            return {...state, limit: action.payload}
        case "SET_STATUS":
            return {...state, status: action.payload}
        case "SET_SEARCH_TERM":
            return {...state, searchTerm: action.payload}
        case "SET_TOTAL_PAGES":
            return {...state, totalPages: action.payload}
    }
}


const Requests = () => {
    const [state, dispatch] = useReducer(requestReducer, requestPaginationState)
    const [requests, setRequests] = useState([]);
    const { project, code, role } = useContext(ProjectContext);
    const [id, setId] = useState();
    const [userId, setUserId] = useState();
    const [showAprrove, setShowApprove] = useState(false);
    const [showDecline, setShowDecline] = useState(false);
    const [member, setMember] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        if(role !== 'Admin')  navigate(-1);
    }, [role])

    const fetchRequests = async (id, state) => {
        const response = await getRequest({
            id,
            ...state
        })
        setRequests(response.requests)
        dispatch({ type: "SET_TOTAL_PAGES", payload: response.totalPages})
    }

    useEffect(() => {
        const fetch = setTimeout(() => {
            fetchRequests(project.id, state)
        }, 300)
      
        return () => clearTimeout(fetch)
    }, [state.searchTerm, state.page, state.status])

    const handleClose = () => {
        setId(undefined);
        setShowApprove(false)
        setShowDecline(false)
    }

    const handleSubmit = async (id, status) => {
        updateRequest(id, status)
        .then(async (response) => {
          if (response.success && status === "Approved") {
            const createResponse = await createMember({ project_id: project.id, user_id: userId, role: "Member" });
            console.log(createResponse)
            const { user, ...rest } = createResponse.newMember;
            const { id, ...userWithoutId } = user;
            setMember({ ...rest, ...userWithoutId });
          } else {
            window.location.reload();
          }
        });
    }

    return <main className="w-full h-full px-10 py-4">
        <UpdateMember 
            open={member !== null}
            member={member}
            closeModal={() => window.location.href = `/project/team?c=${code}`}
            url={`/project/team?c=${code}`}
        />
        <Stack direction="row" justifyContent="space-between" alignItems="center">
            <TextField
                id="input-with-icon-textfield"
                placeholder='Search'
                onChange={(e) => dispatch({ type: "SET_SEARCH_TERM", payload: e.target.value})}
                sx={{
                    '& .MuiOutlinedInput-root': {
                    borderRadius: '20px',
                    marginY: "20px"
                } }}
                slotProps={{
                input: {
                    startAdornment: (
                    <InputAdornment position="start">
                        <SearchOutlinedIcon sx={{ fontSize: 25, color: 'black'}}/>
                    </InputAdornment>
                    ),
                },
                }}
                variant='outlined'
                size='small'
            />
            <Stack direction="row" alignItems="center">
                <FormControl sx={{ minWidth: '100px'}} >
                    <Select
                        value={state.status}
                        sx={{ height: "35px"}}
                        onChange={(e) => dispatch({ type: "SET_STATUS", payload: e.target.value})}
                    >
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Approved">Approved</MenuItem>
                        <MenuItem value="Declined">Declined</MenuItem>
                    </Select>
                </FormControl>
                <Pagination 
                    count={state.totalPages} 
                    page={state.page} 
                    onChange={(e, value) => dispatch({ type: "SET_PAGE", payload: value})} 
                />
            </Stack>
        </Stack>
        <div className="h-[85%]">
        <CustomizedTable 
            cols={<TableRow>
                <StyledTableCell align="left">Fullname</StyledTableCell>
                <StyledTableCell align="left">Email</StyledTableCell>
                <StyledTableCell align="left">Request Date</StyledTableCell>
                <StyledTableCell align="center">Status</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
            </TableRow>}
            rows={requests.length > 0 && requests.map((request, i) => {
                return <StyledTableRow key={i}>
                    <StyledTableCell
                        sx={{display: 'flex', alignItems: 'center', gap: 2}}
                    >
                        <Avatar
                            src={`data:image/jpeg;base64,${request.user.profile_pic}`}
                            sx={{ width: 40, height: 40 }}
                        />
                        {request.user.firstname} {request.user.lastname}
                    </StyledTableCell>
                    <StyledTableCell align="left">{request.user.email}</StyledTableCell>
                    <StyledTableCell align="left">{formatDateTime(convertToAsiaTime(request.request_Date))}</StyledTableCell>
                    <StyledTableCell align="center">{request.status}</StyledTableCell>
                    <StyledTableCell align="center">
                        {request.status === "Pending" && 
                        <>
                            <Tooltip title="Approve">
                                <IconButton 
                                    color="success"
                                    onClick={() => {
                                        setShowApprove(true);
                                        setId(request.id)
                                        setUserId(request.user_Id)
                                    }}
                                >
                                    <CheckCircleIcon fontSize="inherit"/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Decline">
                                <IconButton 
                                    color="error"
                                    onClick={() => {
                                        setShowDecline(true);
                                        setId(request.id)
                                        setUserId(request.user_Id)
                                    }}
                                >
                                    <DeleteIcon fontSize="inherit"/>
                                </IconButton>
                            </Tooltip>
                        </>}
                    </StyledTableCell>
                </StyledTableRow>
            })}
        />
        </div>
        <ConfirmDialog 
            handleAgree={() => handleSubmit(id, "Approved")}
            handleClose={handleClose}
            isOpen={showAprrove}
            title={"Approve Request"}
            text={"Do you want to approve this request?"}
            variant="success"
        />
        <ConfirmDialog 
            handleAgree={() => handleSubmit(id, "Declined")}
            handleClose={handleClose}
            isOpen={showDecline}
            title={"Decline"}
            text={"Do you want to decline this request?"}
            variant="error"
        />

    </main>
}

export default Requests