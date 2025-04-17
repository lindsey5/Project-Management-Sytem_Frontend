import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { green, red, blue } from '@mui/material/colors';

const hoverVariants = {
  success: green[100], 
  error: red[100],     
  info: blue[100]
};

const variants = {
    success: green[600],
    error: red[600],
    info: blue[600]
}

export const ConfirmDialog = ({ variant="info", isOpen, title, text, handleClose, handleAgree }) => {
    return (
      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ color: variants[variant]}}>
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
                    backgroundColor: hoverVariants[variant]
                }}}
            >No</Button>
            <Button 
                onClick={handleAgree}
                sx={{ backgroundColor: variants[variant], color: 'white', ":hover": {
                    backgroundColor: hoverVariants[variant]
                }}}
            >Yes</Button>
        </DialogActions>
      </Dialog>
    );
  };