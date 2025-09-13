import { useState, useEffect, memo, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useForm, Controller, Control } from 'react-hook-form';
import { useStartQuiz, useSaveAnswer, useSubmitAttempt, useQuizProctor } from '../../hooks';
import { useGetQuiz } from '../../hooks/quiz/queries/use-get-quiz-details';
import { Label, Radio, RadioGroup } from '@headlessui/react';
import { BiCheckCircle } from 'react-icons/bi';
import { Button, showToast, Typography } from '../../components';
import { QuizTimer } from './quiz-timer';
import { PlayerScore } from './player-score';
import { Quiz } from '../../types';

type FormValues = {
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

const QuestionRenderer = memo(QuestionRendererComponent);

export function PlayerPage() {
  const { quizId } = useParams<{ quizId: string }>();

  // add loading and empty state view
  const { data: quiz, isLoading } = useGetQuiz(Number(quizId));
  const [currentStep, setCurrentStep] = useState(0);

  // API hooks
  const { startQuiz, data: attemptData } = useStartQuiz({});
  const { saveAnswer } = useSaveAnswer({ attemptId: Number(attemptData?.id) || 0 });
  const { submitAttempt, data } = useSubmitAttempt({
    attemptId: Number(attemptData?.id) || 0,
    onSuccess: () => {
      showToast.info('Quiz Submitted');
    },
    onError: () => {
      showToast.error('Quiz Already Submitted');
    },
  });

  // proctor test
  const { violations } = useQuizProctor(data === undefined);

  // RHF
  const { control, handleSubmit, getValues, reset } = useForm<FormValues>({
    defaultValues: { answers: {} },
  });

  // Kick off quiz attempt once quiz is loaded
  useEffect(() => {
    if (quiz && !attemptData) {
      startQuiz(quiz.id);
    }
  }, [quiz, attemptData, startQuiz]);

  useEffect(() => {
    if (quiz) {
      reset({
        answers: quiz.questions.reduce((acc, q) => ({ ...acc, [q.id]: '' }), {}),
      });
    }
  }, [quiz, reset]);

  const questions = quiz?.questions ?? [];
  const total = questions.length;

  const currentQuestion = useMemo(
    () => (questions.length > 0 ? questions[currentStep] : null),
    [questions, currentStep],
  );
  const autoGradableQuestions = useMemo(
    () => quiz?.questions.filter((q) => q.type === 'mcq' || q.type === 'short'),
    [quiz?.questions],
  );

  // Save current question’s answer before navigating
  const handleAnswer = useCallback(() => {
    const value = getValues(`answers.${currentQuestion?.id}`);
    if (value !== undefined && value !== null && value !== '') {
      saveAnswer({ questionId: Number(currentQuestion?.id), value });
    }
  }, [currentQuestion?.id, getValues, saveAnswer]);

  const onSubmit = handleSubmit(() => {
    submitAttempt();
  });

  // If submitData exists, the quiz has been submitted, show PlayerScore only
  // also when on refresh should always show this UI TODO
  if (data) {
    return (
      <div className='max-w-3xl mx-auto p-6'>
        <PlayerScore
          score={data.score || 0}
          total={Number(autoGradableQuestions?.length)}
          violations={{
            copy: violations.copy,
            paste: violations.paste,
            tabSwitch: violations.tabSwitch,
            exitAttempt: violations.exitAttempt,
          }}
        />
      </div>
    );
  }

  return (
    <div className='max-w-3xl mx-auto p-6 flex flex-col gap-6'>
      <QuizTimer
        quizId={Number(quizId)}
        duration={Number(quiz?.timeLimitSeconds)}
        onTimeUp={onSubmit}
      />

      {/* Header */}
      <div className='flex justify-between items-center mt-8'>
        <Typography
          variant='h5'
          className='font-semibold'
        >
          {quiz?.title}
        </Typography>
        <Typography
          variant='caption'
          className='text-gray-600'
        >
          {currentStep + 1} / {total}
        </Typography>
      </div>

      {/* Question */}
      <div className='p-6 border rounded-2xl shadow-sm bg-white flex flex-col gap-4'>
        <Typography
          variant='h6'
          className='font-medium'
        >
          {currentQuestion?.prompt}
        </Typography>
        <QuestionRenderer
          key={currentQuestion?.id}
          question={currentQuestion as Quiz.Question}
          control={control}
        />
      </div>

      {/* Navigation */}
      <div className='flex justify-between items-center'>
        <Button
          variant='secondary'
          size='sm'
          onClick={() => {
            handleAnswer();
            setCurrentStep((s) => Math.max(s - 1, 0));
          }}
          disabled={currentStep === 0}
        >
          Previous
        </Button>

        {currentStep < total - 1 ? (
          <Button
            variant='primary'
            size='sm'
            onClick={() => {
              handleAnswer();
              setCurrentStep((s) => Math.min(s + 1, total - 1));
            }}
          >
            Next
          </Button>
        ) : (
          <Button
            variant='primary'
            size='sm'
            onClick={onSubmit}
          >
            Submit
          </Button>
        )}
      </div>
    </div>
  );
}
