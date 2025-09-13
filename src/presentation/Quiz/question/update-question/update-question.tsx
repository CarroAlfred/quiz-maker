import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Quiz } from '../../../../types';
import { DialogContainer, Dropdown, showToast, TextArea, TextInput } from '../../../../components';
import { useUpdateQuestion } from '../../../../hooks';

type FormValues = Omit<Quiz.Question, 'id' | 'quizId'>;

type UpdateQuestionDialogProps = {
  open: boolean;
  onClose: () => void;
  quizId: number;
  question: Quiz.Question; // 👈 existing question to edit
};

export function UpdateQuestionDialog({ open, onClose, quizId, question }: UpdateQuestionDialogProps) {
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

  return (
    <DialogContainer
      open={open}
      onClose={onClose}
      title='Update Question'
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
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      }
    >
      <form className='flex flex-col gap-6'>
        {/* Type */}
        <Controller
          name='type'
          control={control}
          render={({ field }) => (
            <div className='flex flex-col mb-2'>
              <label className='text-sm font-medium mb-2 text-gray-700'>Question Type</label>
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

        {/* Prompt */}
        <div className='flex flex-col mb-2'>
          <label className='text-sm font-medium text-gray-700'>Prompt</label>
          <TextArea
            {...register('prompt')}
            placeholder='Enter question prompt'
          />
        </div>

        {/* Conditional fields */}
        {type === 'mcq' && (
          <div className='flex flex-col mb-2'>
            <label className='text-sm font-medium text-gray-700'>Choices</label>
            <div className='flex flex-col gap-2'>
              {Array.from({ length: 4 }).map((_, optIdx) => (
                <TextInput
                  key={optIdx}
                  {...register(`options.${optIdx}` as const)}
                  placeholder={`Option ${optIdx + 1}`}
                />
              ))}
            </div>

            <label className='text-sm font-medium text-gray-700 mt-1'>Correct Option Index (0-3)</label>
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
            <label className='text-sm font-medium text-gray-700'>Answer</label>
            <TextInput
              {...register('correctAnswer')}
              placeholder='Correct answer text'
            />
          </div>
        )}

        {type === 'code' && (
          <div className='flex flex-col mb-2'>
            <label className='text-sm font-medium text-gray-700'>Solution Code</label>
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
