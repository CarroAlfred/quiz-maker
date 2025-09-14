import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Quiz } from '../../../../types';
import {
  Button,
  DialogContainer,
  Dropdown,
  Loader,
  showToast,
  TextArea,
  TextInput,
  Typography,
} from '../../../../components';
import { useUpdateQuestion } from '../../../../hooks';

type FormValues = Omit<Quiz.Question, 'id' | 'quizId'>;

type UpdateQuestionDialogProps = {
  open: boolean;
  onClose: () => void;
  quizId: number;
  question: Quiz.Question;
  questionCount: number;
};

export function UpdateQuestionDialog({ open, onClose, quizId, question, questionCount }: UpdateQuestionDialogProps) {
  const { control, register, handleSubmit, reset, watch } = useForm<FormValues>({
    defaultValues: {
      type: question.type,
      prompt: question.prompt,
      correctAnswer: question.correctAnswer ?? '',
      options: question.options ?? [],
      position: question.position ?? 0,
    },
  });

  // reset form when modal opens with new question
  useEffect(() => {
    if (open) {
      reset({
        type: question.type,
        prompt: question.prompt,
        correctAnswer: question.correctAnswer ?? '',
        options: question.options ?? [],
        position: question.position ?? 0,
      });
    }
  }, [open, question, reset]);

  const { handleUpdateQuestion, isLoading } = useUpdateQuestion({
    quizId,
    onSuccess: () => {
      showToast.success('Question updated successfully!');
      onClose();
    },
    onError: () => {
      showToast.error('Failed to update question.');
    },
  });

  const type = watch('type');

  const onSubmit = (data: FormValues) => {
    handleUpdateQuestion({
      questionId: question.id,
      data: {
        ...data,
        ...(data.type !== 'mcq' ? { options: [] } : {}),
      },
    });
  };

  const questionTypes = [
    { value: 'mcq', label: 'Multiple Choice' },
    { value: 'short', label: 'Short Answer' },
    { value: 'code', label: 'Code' },
  ];

  const options = Array.from({ length: questionCount }, (_, index) => ({
    label: (index + 1).toString(),
    id: index,
  }));

  return (
    <DialogContainer
      open={open}
      onClose={onClose}
      title='Update Question'
      footer={
        <div className='flex gap-2'>
          <Button
            onClick={onClose}
            variant='secondary'
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            variant='outline'
          >
            {isLoading ? <Loader size={20} /> : 'Save Changes'}
          </Button>
        </div>
      }
    >
      <form className='flex flex-col gap-4'>
        {/* Type */}
        <Controller
          name='type'
          control={control}
          render={({ field }) => (
            <div className='flex flex-col mb-2'>
              <Typography
                variant='caption'
                weight='medium'
              >
                Question Type
              </Typography>
              <Dropdown
                value={field.value}
                items={questionTypes.map((t) => ({
                  id: t.value,
                  label: t.label,
                }))}
                onChange={(item) => field.onChange(item.id)}
              />
            </div>
          )}
        />

        <Controller
          name='position'
          control={control}
          render={({ field }) => (
            <div className='flex flex-col mb-2'>
              <Typography
                variant='caption'
                weight='medium'
              >
                Position
              </Typography>
              <Dropdown
                value={field.value}
                items={options}
                onChange={(item) => field.onChange(item.id)}
              />
            </div>
          )}
        />

        {/* Prompt */}
        <div className='flex flex-col mb-2'>
          <Typography
            variant='caption'
            weight='medium'
          >
            Prompt
          </Typography>
          <TextArea
            {...register('prompt')}
            placeholder='Enter question prompt'
          />
        </div>

        {/* Conditional fields */}
        {type === 'mcq' && (
          <div className='flex flex-col mb-2'>
            <Typography
              variant='caption'
              weight='medium'
            >
              Choices
            </Typography>
            <div className='flex flex-col gap-2'>
              {Array.from({ length: 4 }).map((_, optIdx) => (
                <TextInput
                  key={optIdx}
                  {...register(`options.${optIdx}` as const)}
                  placeholder={`Option ${optIdx + 1}`}
                />
              ))}
            </div>

            <Typography
              variant='caption'
              weight='medium'
            >
              Correct Option Index (0-3)
            </Typography>
            <TextInput
              type='number'
              min={0}
              max={3}
              {...register('correctAnswer', {
                setValueAs: (v) => (v === '' ? undefined : String(v)),
              })}
            />
          </div>
        )}

        {type === 'short' && (
          <div className='flex flex-col mb-2'>
            <Typography
              variant='caption'
              weight='medium'
            >
              Answer
            </Typography>
            <TextInput
              {...register('correctAnswer')}
              placeholder='Correct answer text'
            />
          </div>
        )}

        {type === 'code' && (
          <div className='flex flex-col mb-2'>
            <Typography
              variant='caption'
              weight='medium'
            >
              Solution Code
            </Typography>
            <textarea
              {...register('correctAnswer')}
              rows={4}
              className='mt-1 rounded-md border px-3 py-2 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500'
              placeholder='Enter correct code'
            />
          </div>
        )}
      </form>
    </DialogContainer>
  );
}
