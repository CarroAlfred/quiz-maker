import { DialogContainer, Typography, Button, Loader } from '../../../../components';

type DeleteConfirmationDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
};

export function DeleteConfirmationDialog({
  open,
  onClose,
  onConfirm,
  isLoading = false,
  title = 'Delete Item',
  description = 'Are you sure you want to delete this item? This action cannot be undone.',
}: DeleteConfirmationDialogProps) {
  return (
    <DialogContainer
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <div className='flex gap-2'>
          <Button
            variant='outline'
            onClick={onClose}
          >
            <Typography variant='body'>Cancel</Typography>
          </Button>
          <Button
            variant='text'
            onClick={onConfirm}
            disabled={isLoading}
          >
            <Typography variant='body'>{isLoading ? <Loader /> : 'Delete'}</Typography>
          </Button>
        </div>
      }
    >
      <Typography variant='body'>{description}</Typography>
    </DialogContainer>
  );
}
