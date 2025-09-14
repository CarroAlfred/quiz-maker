import { RadioGroup, Label, Radio } from '@headlessui/react';
import { memo } from 'react';
import { Control, Controller } from 'react-hook-form';
import { BiCheckCircle } from 'react-icons/bi';
import { Typography } from '../../components';
import { Quiz } from '../../types';

export type FormValues = {
  answers: Record<string, string | number>;
};

type QuestionRendererProps = {
  question: Quiz.Question;
  control: Control<FormValues>;
};

const QuestionRendererComponent = ({ question, control }: QuestionRendererProps) => {
  switch (question?.type) {
    case 'mcq':
      return (
        <Controller
          control={control}
          name={`answers.${question.id}`}
          render={({ field }) => (
            <RadioGroup
              value={field.value ?? ''}
              onChange={field.onChange}
            >
              <Label className='sr-only'>Select an option</Label>
              <div className='flex flex-col gap-2'>
                {question?.options?.map((opt: string, idx: number) => (
                  <Radio
                    key={idx}
                    value={opt}
                    className={({ checked }) =>
                      `relative flex cursor-pointer rounded-lg px-4 py-3 transition border 
                      ${checked ? 'bg-blue-50 border-blue-500' : 'border-gray-300 hover:bg-gray-50'}`
                    }
                  >
                    {({ checked }) => (
                      <div className='flex w-full items-center justify-between'>
                        <Typography>{opt}</Typography>
                        {checked && <BiCheckCircle className='w-5 h-5 text-blue-600' />}
                      </div>
                    )}
                  </Radio>
                ))}
              </div>
            </RadioGroup>
          )}
        />
      );

    case 'short':
      return (
        <Controller
          control={control}
          name={`answers.${question.id}`}
          render={({ field }) => (
            <input
              {...field}
              value={field.value ?? ''}
              type='text'
              placeholder='Your answer...'
              className='w-full rounded-md border px-3 py-2 mt-2 focus:outline-none focus:ring-1 focus:ring-blue-500'
            />
          )}
        />
      );

    case 'code':
      return (
        <Controller
          control={control}
          name={`answers.${question.id}`}
          render={({ field }) => (
            <textarea
              {...field}
              value={field.value ?? ''}
              rows={5}
              placeholder='Write your code here...'
              className='w-full rounded-md border px-3 py-2 font-mono mt-2 focus:outline-none focus:ring-1 focus:ring-blue-500'
            />
          )}
        />
      );

    default:
      return null;
  }
};

QuestionRendererComponent.displayName = 'QuestionRenderer';

export const QuestionRenderer = memo(QuestionRendererComponent);
