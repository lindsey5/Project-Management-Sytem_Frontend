import { Box, Chip } from "@mui/material"
import AttachmentIcon from '@mui/icons-material/Attachment';
import { EllipsisText } from "../text";
import { base64ToBlob } from "../../utils/utils";

const Attachments = ({ attachments, role, setSelectedAttachment, openFile}) => {
    return <Box display="flex" overflow={"auto"} padding={2} gap={2}>
            {attachments.map(a => (
                    <Chip
                        key={a.id}
                        icon={<AttachmentIcon />}
                        onDelete={() => role === 'Admin' ? setSelectedAttachment(a.id) : undefined}
                        onClick={() => openFile(base64ToBlob(a))}
                        sx={{
                            maxWidth: '300px',
                            padding: '0 8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            cursor: 'point',
                            ":hover" : {
                                backgroundColor: '#9CA3AF'
                            }
                        }}
                        label={<EllipsisText text={a.name}/>
                        
                        }
                    />                              
                ))}
    </Box>
}

export default Attachments