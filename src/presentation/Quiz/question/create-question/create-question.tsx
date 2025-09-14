import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useCreateQuestion } from '../../../../hooks';
import { Quiz } from '../../../../types';
import { DialogContainer, Dropdown, showToast, TextArea, TextInput, Button, Typography } from '../../../../components';
import { BsPlusCircle } from 'react-icons/bs';

type FormValues = {
  questions: Omit<Quiz.Question, 'id' | 'quizId'>[];
};

type MultiQuestionDialogProps = {
  open: boolean;
  onClose: () => void;
  quizId: number;
};

export function MultiQuestionDialog({ open, onClose, quizId }: MultiQuestionDialogProps) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
    trigger,
  } = useForm<FormValues>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      questions: [
        {
          type: 'short',
          prompt: '',
          correctAnswer: '',
          options: [],
          position: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const questionTypes = [
    { value: 'mcq', label: 'Multiple Choice' },
    { value: 'short', label: 'Short Answer' },
    { value: 'code', label: 'Code' },
  ];

  const { handleCreateQuestion, isLoading } = useCreateQuestion({
    quizId,
    onSuccess: () => {
      reset();
      showToast.success('Questions created successfully!');
      onClose();
    },
    onError: () => {
      showToast.error('Questions creation failed.');
    },
  });

  const onSubmit = (data: FormValues) => {
    data.questions.forEach((q) => {
      const payload: Omit<Quiz.Question, 'id' | 'quizId'> = {
        type: q.type,
        prompt: q.prompt,
        position: q.position,
        correctAnswer: q.correctAnswer ?? '',
        ...(q.type === 'mcq' ? { options: q.options } : {}),
      };

      handleCreateQuestion(payload);
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <DialogContainer
      open={open}
      onClose={handleClose}
      title='Add Questions'
      footer={
        <div className='flex justify-end gap-2'>
          <Button
            variant='secondary'
            onClick={handleClose}
          >
            <Typography variant='small'>Cancel</Typography>
          </Button>
          <Button
            variant='outline'
            disabled={isLoading}
            onClick={handleSubmit(onSubmit)}
          >
            <Typography variant='small'>{isLoading ? 'Creating...' : 'Add Question'}</Typography>
          </Button>
        </div>
      }
    >
      <form className='flex flex-col gap-6'>
        {fields.map((field, index) => {
          const type = watch(`questions.${index}.type`);
          return (
            <div
              key={field.id}
              className='p-4 border rounded-lg space-y-4 '
            >
              <div className='flex justify-between items-center'>
                <Typography variant='h6'>Question {index + 1}</Typography>
                {fields.length > 1 && (
                  <Button
                    variant='text'
                    size='sm'
                    onClick={() => remove(index)}
                    className='text-red-500'
                  >
                    <Typography variant='caption'>Remove</Typography>
                  </Button>
                )}
              </div>

              {/* Type */}
              <Controller
                name={`questions.${index}.type`}
                control={control}
                render={({ field }) => (
                  <div className='flex flex-col gap-1'>
                    <Typography
                      variant='caption'
                      className='text-gray-700'
                    >
                      Question Type
                    </Typography>
                    <Dropdown
                      value={field.value}
                      items={questionTypes.map((type) => ({
                        id: type.value,
                        label: type.label,
                      }))}
                      onChange={(item) => field.onChange(item.id)}
                    />
                  </div>
                )}
              />

              {/* Prompt */}
              <div className='flex flex-col gap-1'>
                <Typography
                  variant='caption'
                  className='text-gray-700'
                >
                  Prompt
                </Typography>
                <TextArea
                  error={errors?.questions?.[index]?.prompt?.message}
                  {...register(`questions.${index}.prompt` as const, {
                    required: 'Prompt is required',
                  })}
                  placeholder='Enter question prompt'
                />
              </div>

              {/* Conditional fields */}
              {type === 'mcq' && (
                <div className='space-y-2'>
                  <div className='flex flex-col gap-1'>
                    <Typography
                      variant='caption'
                      className='text-gray-700'
                    >
                      Choices
                    </Typography>
                    <div className='flex flex-col gap-2'>
                      {Array.from({ length: 4 }).map((_, optIdx) => (
                        <TextInput
                          key={optIdx}
                          error={errors?.questions?.[index]?.options?.[optIdx]?.message}
                          {...register(`questions.${index}.options.${optIdx}` as const, {
                            required: 'Option is required',
                          })}
                          placeholder={`Option ${optIdx + 1}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className='flex flex-col gap-1'>
                    <Typography
                      variant='caption'
                      className='text-gray-700'
                    >
                      Correct Answer Index (0-3)
                    </Typography>
                    <TextInput
                      type='number'
                      min={0}
                      max={3}
                      error={errors?.questions?.[index]?.correctAnswer?.message}
                      {...register(`questions.${index}.correctAnswer` as const, {
                        required: 'Correct option index is required',
                        valueAsNumber: true,
                        validate: (v) => {
                          const num = typeof v === 'number' ? v : Number(v);
                          if (typeof num !== 'number' || isNaN(num)) return 'Must be between 0 and 3';
                          return num >= 0 && num <= 3 ? true : 'Must be between 0 and 3';
                        },
                      })}
                    />
                  </div>
                </div>
              )}

              {type === 'short' && (
                <div className='flex flex-col gap-1'>
                  <Typography
                    variant='caption'
                    className='text-gray-700'
                  >
                    Answer
                  </Typography>
                  <TextInput
                    error={errors?.questions?.[index]?.correctAnswer?.message}
                    {...register(`questions.${index}.correctAnswer`, {
                      setValueAs: (v) => (v === '' ? '' : String(v)),
                      required: 'Answer is required',
                    })}
                    placeholder='Correct answer text'
                  />
                </div>
              )}

              {type === 'code' && (
                <div className='flex flex-col gap-1'>
                  <Typography
                    variant='caption'
                    className='text-gray-700'
                  >
                    Solution Code
                  </Typography>
                  <textarea
                    {...register(`questions.${index}.correctAnswer`, {
                      setValueAs: (v) => (v === '' ? '' : String(v)),
                      required: 'Answer is required',
                    })}
                    rows={4}
                    className='mt-1 rounded-md border px-3 py-2 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500'
                    placeholder='Enter correct code'
                  />
                </div>
              )}
            </div>
          );
        })}
        <div className='flex justify-end'>
          <Button
            variant='outline'
            icon={<BsPlusCircle />}
            size='lg'
            onClick={async () => {
              const isValid = await trigger('questions'); // validates all questions
              if (!isValid) return;
              append({
                type: 'mcq',
                prompt: '',
                options: ['', '', '', ''], // max to 4 options
                correctAnswer: '',
                position: 0,
              });
            }}
            className='self-start'
          >
            <Typography variant='caption'>Add Another Question</Typography>
          </Button>
        </div>
      </form>
    </DialogContainer>
  );
}
