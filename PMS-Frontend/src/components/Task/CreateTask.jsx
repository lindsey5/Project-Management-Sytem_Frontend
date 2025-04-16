
const CreateTask = ({children}) => {

    return <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
    >
    {children}
    </Modal>

}

export default CreateTask