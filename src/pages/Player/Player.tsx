import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useStartQuiz, useSaveAnswer, useSubmitAttempt, useQuizProctor } from '../../hooks';
import { useGetQuiz } from '../../hooks/queries/quiz/use-get-quiz-details';
import { Button, Card, Loader, showToast, Typography } from '../../components';
import { Quiz } from '../../types';
import { FormValues, PlayerScore, PlayerTimer, QuestionRenderer } from '../../presentation/';

export function Player() {
  const { quizId } = useParams<{ quizId: string }>();

  const { data: quiz, isLoading } = useGetQuiz(Number(quizId));
  const [currentStep, setCurrentStep] = useState(0);

  // API hooks
  const { startQuiz, data: attemptData } = useStartQuiz({});
  const { saveAnswer } = useSaveAnswer({ attemptId: Number(attemptData?.id) || 0 });
  const {
    submitAttempt,
    data,
    isLoading: isLoadingSubmit,
  } = useSubmitAttempt({
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
      <div className='max-w-3xl mx-auto'>
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
      {isLoading && (
        <Loader
          overlay={true}
          size={40}
        />
      )}
      <PlayerTimer
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
      <Card className='p-6 gap-4'>
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
      </Card>

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
            disabled={isLoadingSubmit}
            onClick={async () => {
              await handleAnswer();
              onSubmit();
            }}
          >
            {isLoadingSubmit ? <Loader size={5} /> : 'Submit'}
          </Button>
        )}
      </div>
    </div>
  );
}
