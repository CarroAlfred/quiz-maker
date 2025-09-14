import { memo, useCallback, useEffect } from 'react';
import {
  Control,
  Controller,
  FieldArrayWithId,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  useWatch,
} from 'react-hook-form';
import { Dropdown, TextArea, TextInput, Button, Typography } from '../../../../components';
import { Quiz } from '../../../../types';

type FormValues = {
  questions: Omit<Quiz.Question, 'id' | 'quizId'>[];
};

const questionTypes = [
  { value: 'mcq', label: 'Multiple Choice' },
  { value: 'short', label: 'Short Answer' },
  { value: 'code', label: 'Code' },
];

type QuestionItemProps = {
  field: FieldArrayWithId<FormValues, 'questions', 'id'>;
  index: number;
  control: Control<FormValues>;
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  remove: (index: number) => void;
  fieldsLength: number;
  setValue: UseFormSetValue<FormValues>;
};

export const QuestionItem = ({
  field,
  index,
  control,
  register,
  errors,
  remove,
  fieldsLength,
  setValue,
}: QuestionItemProps) => {
  const type = useWatch({ control, name: `questions.${index}.type` }) || field.type;

  useEffect(() => {
    if (type === 'mcq') {
      setValue(`questions.${index}.correctAnswer`, 0); // MCQ expects number
      setValue(`questions.${index}.options`, ['', '', '', '']);
    } else {
      setValue(`questions.${index}.correctAnswer`, ''); // short/code expects string
      setValue(`questions.${index}.options`, []);
    }
  }, [type, index, setValue]);

  const renderConditionalFields = useCallback(() => {
    switch (type) {
      case 'mcq':
        return (
          <>
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
                    {...register(`questions.${index}.options.${optIdx}` as const, { required: 'Option is required' })}
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
                    if (isNaN(num)) return 'Must be between 0 and 3';
                    return num >= 0 && num <= 3 ? true : 'Must be between 0 and 3';
                  },
                })}
              />
            </div>
          </>
        );
      case 'short':
        return (
          <TextInput
            error={errors?.questions?.[index]?.correctAnswer?.message}
            {...register(`questions.${index}.correctAnswer` as const, {
              required: 'Answer is required',
              setValueAs: (v) => (v === '' ? '' : String(v)),
            })}
            placeholder='Correct answer text'
          />
        );
      case 'code':
        return (
          <TextArea
            error={errors?.questions?.[index]?.correctAnswer?.message}
            {...register(`questions.${index}.correctAnswer` as const, {
              required: 'Answer is required',
              setValueAs: (v) => (v === '' ? '' : String(v)),
            })}
            rows={4}
            className='mt-1 rounded-md border px-3 py-2 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500'
            placeholder='Enter correct code'
          />
        );
      default:
        return null;
    }
  }, [type, index, register, errors]);

  return (
    <div className='p-4 border rounded-lg space-y-4'>
      <div className='flex justify-between items-center'>
        <Typography variant='h6'>Question {index + 1}</Typography>
        {fieldsLength > 1 && (
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
              items={questionTypes.map((t) => ({ id: t.value, label: t.label }))}
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
          {...register(`questions.${index}.prompt` as const, { required: 'Prompt is required' })}
          placeholder='Enter question prompt'
        />
      </div>

      {/* Conditional Fields */}
      <div className='space-y-2'>{renderConditionalFields()}</div>
    </div>
  );
};

QuestionItem.displayName = 'QuestionItemRenderer';
export const QuestionItemRenderer = memo(QuestionItem);
