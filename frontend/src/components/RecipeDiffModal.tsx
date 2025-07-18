import { Modal, ModalDialog, ModalClose, DialogContent } from "@mui/joy"

type GPRecipeDiffModalType = {
    modalOpen: boolean
    handleModalClose: () => void
}

const RecipeDiffModal = ({modalOpen, handleModalClose}: GPRecipeDiffModalType) => {
    return (
    <Modal open={modalOpen} onClose={handleModalClose}>
      <ModalDialog layout="fullscreen">
        <ModalClose />
        <DialogContent sx={{ my: 3 }}>
       
        </DialogContent>
      </ModalDialog>
    </Modal>
    )
}

export default RecipeDiffModal