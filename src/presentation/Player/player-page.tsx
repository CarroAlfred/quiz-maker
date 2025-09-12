import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useStartQuiz, useSaveAnswer, useSubmitAttempt } from '../../hooks';
import { useGetQuiz } from '../../hooks/quiz/queries/use-get-quiz-details';
import { Label, Radio, RadioGroup } from '@headlessui/react';
import { BiCheckCircle } from 'react-icons/bi';

type FormValues = {
  answers: {
    [key: string]: string | number;
  };
};

export function PlayerPage() {
  const { id } = useParams<{ id: string }>(); // update base on params passed onclick or url pasted
  const { data: quiz, isLoading } = useGetQuiz(Number(1));
  const [currentStep, setCurrentStep] = useState(0);
  const [attemptId, setAttemptId] = useState<number | null>(null);

  const { startQuiz } = useStartQuiz({});
  const { saveAnswer } = useSaveAnswer({ attemptId: attemptId || 0 });
  const { submitAttempt } = useSubmitAttempt({ attemptId: attemptId || 0 });

  const { register, watch, setValue, handleSubmit, getValues } = useForm<FormValues>({
    defaultValues: { answers: {} },
  });

  // Start quiz attempt
  useEffect(() => {
    if (quiz && !attemptId) {
      startQuiz(quiz.id, {
        onSuccess: (data) => setAttemptId(data.id),
      });
    }
  }, [quiz, attemptId]);

  if (isLoading) return <div className='p-6'>Loading quiz...</div>;
  if (!quiz) return <div className='p-6'>Quiz not found</div>;

  const total = quiz.questions.length;
  const currentQuestion = quiz.questions[currentStep];
  const currentValue = watch(`answers.${currentQuestion.id}`);

  const handleAnswer = () => {
    if (!attemptId) return;

    // Get the current value from RHF
    const value = getValues(`answers.${currentQuestion.id}`);
    const questionId = currentQuestion.id;

    saveAnswer({ questionId, value });
  };

  const onSubmit = handleSubmit(() => {
    if (attemptId) {
      submitAttempt(); // onsubmit show the result and then show the quiz title via modal. cannot be clicked outside just the button to go to quiz list player
    }
  });
  return (
    <div className='max-w-3xl mx-auto p-6'>
      {/* Progress */}
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-lg font-semibold'>{quiz.title}</h1>
        <span className='text-sm font-medium text-gray-600'>
          {currentStep + 1} / {total}
        </span>
      </div>

      {/* Question */}
      <div className='p-6 border rounded-lg shadow-sm bg-white'>
        <h2 className='font-semibold mb-4'>{currentQuestion.prompt}</h2>

        {/* MCQ */}
        {currentQuestion.type === 'mcq' && currentQuestion.options && (
          <RadioGroup
            value={getValues(`answers.${currentQuestion.id}`) ?? null}
            onChange={(value) => setValue(`answers.${currentQuestion.id}`, value)}
          >
            <Label className='sr-only'>Select an option</Label>
            <div className='space-y-2'>
              {currentQuestion.options.map((opt, idx) => (
                <Radio
                  key={idx}
                  value={opt}
                  className={({ checked }) =>
                    `relative flex cursor-pointer rounded-lg bg-white/5 px-5 py-4 shadow-md transition ${
                      checked ? 'bg-blue-100 border border-blue-400' : 'border border-gray-300'
                    } focus:outline-none`
                  }
                >
                  {({ checked }) => (
                    <div className='flex w-full items-center justify-between'>
                      <span className='text-gray-900'>{opt}</span>
                      {checked && <BiCheckCircle className='w-6 h-6 text-blue-600' />}
                    </div>
                  )}
                </Radio>
              ))}
            </div>
          </RadioGroup>
        )}

        {/* Short Answer */}
        {currentQuestion.type === 'short' && (
          <input
            {...register(`answers.${currentQuestion.id}`)}
            value={currentValue || ''}
            onChange={(e) => setValue(`answers.${currentQuestion.id}`, e.target.value)}
            type='text'
            placeholder='Your answer...'
            className='w-full rounded-md border px-3 py-2 mt-2 focus:outline-none focus:ring-1 focus:ring-blue-500'
          />
        )}

        {/* Code */}
        {currentQuestion.type === 'code' && (
          <textarea
            {...register(`answers.${currentQuestion.id}`)}
            value={currentValue || ''}
            onChange={(e) => setValue(`answers.${currentQuestion.id}`, e.target.value)}
            rows={5}
            placeholder='Write your code here...'
            className='w-full rounded-md border px-3 py-2 font-mono mt-2 focus:outline-none focus:ring-1 focus:ring-blue-500'
          />
        )}
      </div>

      {/* Navigation */}
      <div className='flex justify-between mt-6'>
        <button
          type='button'
          onClick={() => {
            setCurrentStep((s) => Math.max(s - 1, 0));
          }}
          disabled={currentStep === 0}
          className='rounded-md bg-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-400 disabled:opacity-50'
        >
          Previous
        </button>

        {currentStep < total - 1 ? (
          <button
            type='button'
            onClick={() => {
              setCurrentStep((s) => Math.min(s + 1, total - 1));
              handleAnswer();
            }}
            className='rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700'
          >
            Next
          </button>
        ) : (
          <button
            type='button'
            onClick={onSubmit}
            className='rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700'
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
}
