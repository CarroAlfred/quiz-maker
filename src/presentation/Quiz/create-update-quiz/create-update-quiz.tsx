import { useForm } from 'react-hook-form';
import { Quiz } from '../../../types';
import { DialogContainer, Button, Typography, TextInput, TextArea } from '../../../components';
import { useEffect } from 'react';

type FormValues = Omit<Quiz.QuizInfo, 'id' | 'createdAt'>;

type CreateUpdateQuizDialogProps = {
  open: boolean;
  onClose: () => void;
  onClick?: (data: FormValues) => void;
  isLoading?: boolean;
  initialValues?: Partial<FormValues>;
};

export const CreateUpdateQuizDialog = ({
  open,
  onClose,
  onClick,
  isLoading,
  initialValues,
}: CreateUpdateQuizDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: '',
      description: '',
      timeLimitSeconds: 300,
      isPublished: false,
      ...initialValues,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        title: '',
        description: '',
        timeLimitSeconds: 300,
        isPublished: false,
        ...initialValues,
      });
    }
  }, [open, initialValues, reset]);

  const onSubmit = async (data: FormValues) => {
    const success = await onClick?.(data);
    if (success) reset();
  };

  return (
    <DialogContainer
      open={open}
      onClose={onClose}
      title={initialValues ? 'Update Quiz' : 'Create New Quiz'}
      footer={
        <div className='flex justify-end gap-3'>
          <Button
            variant='secondary'
            size='sm'
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={handleSubmit(onSubmit)}
          >
            {isLoading ? 'Creating...' : initialValues ? 'Update' : 'Create'}
          </Button>
        </div>
      }
    >
      <form className='flex flex-col gap-6'>
        <div className='flex flex-col gap-1'>
          <Typography
            variant='caption'
            weight='medium'
          >
            Title
          </Typography>
          <TextInput
            error={errors?.title?.message}
            {...register('title', {
              required: 'Prompt is required',
            })}
            placeholder='Enter quiz title'
            className='w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500'
          />
        </div>

        <div className='flex flex-col gap-1'>
          <Typography
            variant='caption'
            weight='medium'
          >
            Description
          </Typography>
          <TextArea
            error={errors?.description?.message}
            {...register('description', {
              required: 'Description is required',
            })}
            placeholder='Enter quiz description'
            rows={3}
            className='w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500'
          />
        </div>

        <div className='flex flex-col gap-1'>
          <Typography
            variant='caption'
            weight='medium'
          >
            Time Limit (seconds)
          </Typography>
          <TextInput
            type='number'
            min={0}
            error={errors?.timeLimitSeconds?.message}
            {...register('timeLimitSeconds', {
              required: 'Time Limit is required',
              valueAsNumber: true,
            })}
            className='w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500'
          />
        </div>

        <div className='flex items-center gap-2'>
          <input
            type='checkbox'
            {...register('isPublished')}
            className='h-4 w-4 rounded border-gray-300 focus:ring-1 focus:ring-blue-500'
          />
          <Typography variant='caption'>Published</Typography>
        </div>
      </form>
    </DialogContainer>
  );
};
