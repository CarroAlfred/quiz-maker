import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useCreateQuestion } from '../../../../hooks';
import { Quiz } from '../../../../types';
import { DialogContainer, Dropdown, TextArea, TextInput } from '../../../../components';

type FormValues = {
  questions: Omit<Quiz.Question, 'id' | 'quizId'>[];
};

type MultiQuestionDialogProps = {
  open: boolean;
  onClose: () => void;
  quizId: number;
};

// TODO POLISH THE FLOW

export default function MultiQuestionDialog({ open, onClose, quizId }: MultiQuestionDialogProps) {
  const { control, register, handleSubmit, reset, watch } = useForm<FormValues>({
    defaultValues: {
      questions: [
        {
          type: 'short',
          prompt: '',
          correctAnswer: '', // not null
          options: [], // only if MCQ
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
      onClose();
    },
    onError: (err) => console.error(err),
  });

  const onSubmit = (data: FormValues) => {
    data.questions.forEach((q) => {
      const payload: Omit<Quiz.Question, 'id' | 'quizId'> = {
        type: q.type,
        prompt: q.prompt,
        position: q.position,
        correctAnswer: q.correctAnswer ?? '',
        ...(q.type === 'mcq' ? { options: q.options } : {}), // ✅ strip options for non-MCQ
      };

      handleCreateQuestion(payload);
    });
  };

  return (
    <DialogContainer
      open={open}
      onClose={onClose}
      title='Add Questions'
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
            {isLoading ? 'Creating...' : 'Create All'}
          </button>
        </div>
      }
    >
      <form className='flex flex-col gap-6'>
        {fields.map((field, index) => {
          const type = watch(`questions.${index}.type`);
          return (
            <div
              key={field.id}
              className='p-4 border-b-2'
            >
              <div className='flex justify-between items-center mb-2'>
                <h4 className='font-large'>Question {index + 1}</h4>
                {fields.length > 1 && (
                  <button
                    type='button'
                    onClick={() => remove(index)}
                    className='text-red-500 text-sm'
                  >
                    Remove
                  </button>
                )}
              </div>

              {/* Type */}

              <Controller
                name={`questions.${index}.type`}
                control={control}
                render={({ field }) => (
                  <div className='flex flex-col mb-2'>
                    <label
                      htmlFor={`questions.${index}.type`}
                      className='text-sm font-medium mb-2 text-gray-700'
                    >
                      Question Type
                    </label>
                    <Dropdown
                      value={field.value}
                      items={questionTypes.map((t) => ({
                        id: t.value,
                        label: t.label,
                      }))}
                      onChange={(item) => field.onChange(item.id)} // ✅
                    />
                  </div>
                )}
              />

              {/* Prompt */}
              <div className='flex flex-col mb-2'>
                <label
                  htmlFor={`questions.${index}.prompt`}
                  className='text-sm font-medium text-gray-700'
                >
                  Prompt
                </label>
                <TextArea
                  {...register(`questions.${index}.prompt` as const)}
                  placeholder='Enter question prompt'
                />
              </div>

              {/* Conditional fields */}
              {type === 'mcq' && (
                <div className='flex flex-col mb-2'>
                  <label
                    htmlFor={`questions.${index}.options`}
                    className='text-sm font-medium text-gray-700'
                  >
                    Choices
                  </label>
                  <div className='flex flex-col gap-2'>
                    {Array.from({ length: 4 }).map((_, optIdx) => (
                      <TextInput
                        key={optIdx}
                        {...register(`questions.${index}.options.${optIdx}` as const)}
                        placeholder={`Option ${optIdx + 1}`}
                      />
                    ))}
                  </div>

                  <label
                    htmlFor={`questions.${index}.correctAnswer`}
                    className='text-sm font-medium text-gray-700 mt-1'
                  >
                    Correct Option Index (0-3)
                  </label>
                  <TextInput
                    type='number'
                    min={0}
                    max={3}
                    {...register(`questions.${index}.correctAnswer` as const, {
                      setValueAs: (v) => (v === '' ? undefined : Number(v)), // ✅ safer than valueAsNumber
                    })}
                  />
                </div>
              )}

              {type === 'short' && (
                <div className='flex flex-col mb-2'>
                  <label
                    htmlFor={`questions.${index}.correctAnswer`}
                    className='text-sm font-medium text-gray-700'
                  >
                    Answer
                  </label>
                  <TextInput
                    type='number'
                    min={0}
                    max={3}
                    {...register(`questions.${index}.correctAnswer`, {
                      setValueAs: (v) => (v === '' ? '' : String(v)), // ensure string
                    })}
                    placeholder='Correct answer text'
                  />
                </div>
              )}

              {type === 'code' && (
                <div className='flex flex-col mb-2'>
                  <label
                    htmlFor={`questions.${index}.correctAnswer`}
                    className='text-sm font-medium text-gray-700'
                  >
                    Solution Code
                  </label>
                  <textarea
                    {...register(`questions.${index}.correctAnswer`, {
                      setValueAs: (v) => (v === '' ? '' : String(v)), // ensure string
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

        <button
          type='button'
          onClick={() =>
            append({
              type: 'mcq',
              prompt: '',
              options: ['', '', '', ''],
              correctAnswer: '',
              position: 0,
            })
          }
          className='mt-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700'
        >
          Add Another Question
        </button>
      </form>
    </DialogContainer>
  );
}
