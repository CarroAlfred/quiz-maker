import { useForm } from 'react-hook-form';
import { Quiz } from '../../../types';
import { useCreateQuiz } from '../../../hooks';
import { DialogContainer, showToast } from '../../../components';
import { useNavigate } from 'react-router-dom';

type FormValues = Omit<Quiz.QuizInfo, 'id' | 'createdAt'>;

type CreateQuizDialogProps = {
  open: boolean;
  onClose: () => void;
};

export const CreateQuizDialog = ({ open, onClose }: CreateQuizDialogProps) => {
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      title: '',
      description: '',
      timeLimitSeconds: 300,
      isPublished: false,
    },
  });

  const { handleCreateQuiz, isLoading } = useCreateQuiz({
    onSuccess: () => {
      reset();
      showToast.success('Quiz created successfully!');
      navigate('/quiz/list');
      onClose();
    },
    onError: () => {
      showToast.error('Quiz Error');
    },
  });

  const onSubmit = (data: FormValues) => {
    handleCreateQuiz(data);
  };

  return (
    <DialogContainer
      open={open}
      onClose={onClose}
      title='Create New Quiz'
      footer={
        <div className='flex gap-2'>
          <button
            type='button'
            onClick={onClose}
            className='rounded-md bg-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-400'
          >
            Cancel
          </button>
          <button
            type='submit'
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            className='rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50'
          >
            {isLoading ? 'Creating...' : 'Create'}
          </button>
        </div>
      }
    >
      <form className='flex flex-col gap-4'>
        <div className='flex flex-col'>
          <label
            htmlFor='quiz-title'
            className='text-sm font-medium text-gray-700'
          >
            Title
          </label>
          <input
            id='quiz-title'
            {...register('title', { required: true })}
            className='mt-1 rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500'
            placeholder='Enter quiz title'
          />
        </div>

        <div className='flex flex-col'>
          <label
            htmlFor='description'
            className='text-sm font-medium text-gray-700'
          >
            Description
          </label>
          <textarea
            id='description'
            {...register('description')}
            className='mt-1 rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500'
            placeholder='Enter quiz description'
            rows={3}
          />
        </div>

        <div className='flex flex-col'>
          <label
            htmlFor='timeLimitSeconds'
            className='text-sm font-medium text-gray-700'
          >
            Time Limit (seconds)
          </label>
          <input
            id='timeLimitSeconds'
            type='number'
            {...register('timeLimitSeconds', { valueAsNumber: true })}
            className='mt-1 rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500'
            min={0}
          />
        </div>

        <div className='flex items-center gap-2'>
          <input
            type='checkbox'
            {...register('isPublished')}
          />
          <span className='text-sm text-gray-700'>Published</span>
        </div>
      </form>
    </DialogContainer>
  );
};
