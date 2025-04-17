import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Button } from '@mui/material';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const FileUploadBtn = ({ handleFiles}) => {
    return <Button
                component="label"
                variant="contained"
                tabIndex={-1}
                sx={{ backgroundColor: " #f3f4f6", color: 'black'}}
                startIcon={<CloudUploadIcon />}
            >
                Attach Files
                <VisuallyHiddenInput
                    type="file"
                    onChange={handleFiles}
                    multiple
                    accept=".pdf,.doc,.docx,image/*,video/*,.xls,.xlsx,.zip,.rar"
                />
            </Button>
}

export default FileUploadBtn