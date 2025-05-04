import { Box, Chip } from "@mui/material"
import AttachmentIcon from '@mui/icons-material/Attachment';
import { EllipsisText } from "../text";
import { base64ToBlob } from "../../utils/utils";

const Attachments = ({ attachments, remove, openFile}) => {
    return <Box display="flex" overflow={"auto"} gap={2}>
            {attachments.length > 0 ? attachments.map(a => (
                    <Chip
                        key={a.id}
                        icon={<AttachmentIcon />}
                        onDelete={() => remove ? remove(a) : undefined}
                        onClick={() => openFile(base64ToBlob(a))}
                        sx={{
                            maxWidth: '300px',
                            padding: '0 8px',
                            marginY: '5px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            cursor: 'pointer',
                            ":hover" : {
                                backgroundColor: '#9CA3AF'
                            }
                        }}
                        label={<EllipsisText text={a.name}/>
                        
                        }
                    />                              
                )) : <p className="my-5">No attachments</p>}
    </Box>
}

export default Attachments