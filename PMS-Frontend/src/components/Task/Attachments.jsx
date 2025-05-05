import { Box, Chip } from "@mui/material";
import AttachmentIcon from '@mui/icons-material/Attachment';
import { EllipsisText } from "../text";
import { base64ToBlob } from "../../utils/utils";
import { memo, useCallback } from "react";

const AttachmentChip = memo(({ remove, attachment, openFile }) => {
    const open = () => openFile(base64ToBlob(attachment));

    const removeAttachment = useCallback(() => {
        return remove ? remove(attachment) : undefined;
    }, [remove, attachment]);

    return (
        <Chip
            icon={<AttachmentIcon />}
            onDelete={removeAttachment}
            onClick={open}
            sx={{
                maxWidth: '300px',
                padding: '0 8px',
                marginY: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                cursor: 'pointer',
                ":hover": {
                    backgroundColor: '#9CA3AF'
                }
            }}
            label={<EllipsisText text={attachment.name} />}
        />
    );
});

const Attachments = ({ attachments, remove, openFile }) => {

    return (
        <Box display="flex" overflow={"auto"} gap={2}>
            {attachments.length > 0 ? (
                attachments.map((a) => (
                    <AttachmentChip key={a.id} attachment={a} remove={remove} openFile={openFile} />
                ))
            ) : (
                <p className="my-5">No attachments</p>
            )}
        </Box>
    );
};

export default memo(Attachments);
