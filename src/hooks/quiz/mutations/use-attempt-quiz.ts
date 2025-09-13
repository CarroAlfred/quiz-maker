import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Quiz } from '../../../types';
import { QuizServiceApi } from '../../../api';

// TODO MOVE INTO EACH INDIVIDUAL HOOK FILE

// ------------------------
// Start a new quiz attempt
// ------------------------
export function useStartQuiz({
  onSuccess = () => {},
  onError = () => {},
}: {
  onSuccess?: (attempt: Quiz.Attempt) => void;
  onError?: (error: string) => void;
}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (quizId: number) => {
      const res = await QuizServiceApi.startQuiz(quizId);
      return res;
    },
    onSuccess: (data) => {
      onSuccess(data);
      // optionally cache attempt by id
      queryClient.setQueryData(['attempt', data.id], data);
    },
    onError,
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
    startQuiz: mutation.mutate,
  };
}

// ------------------------
// Save/upsert an answer
// ------------------------
export function useSaveAnswer({
  attemptId,
  onSuccess = () => {},
  onError = () => {},
}: {
  attemptId: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (body: { questionId: number; value: string | number }) => {
      const res = await QuizServiceApi.saveQuizAnswer(attemptId, {
        questionId: body.questionId,
        value: String(body.value),
      });
      return res;
    },
    onSuccess: () => {
      onSuccess();
      // optionally refetch attempt
      queryClient.invalidateQueries({ queryKey: ['attempt', attemptId] });
    },
    onError,
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
    saveAnswer: mutation.mutate,
  };
}

// ------------------------
// Submit attempt for grading
// ------------------------
export function useSubmitAttempt({
  attemptId,
  onSuccess = () => {},
  onError = () => {},
}: {
  attemptId: number;
  onSuccess?: (result: Quiz.AttemptResult) => void;
  onError?: (error: string) => void;
}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await QuizServiceApi.submitQuizAttempt(attemptId);
      return res;
    },
    onSuccess: (data) => {
      onSuccess(data);
      // update cached attempt with score
      queryClient.setQueryData(['attempt', attemptId], (old: Quiz.Attempt | undefined) => ({
        ...old,
        score: data.score,
        submittedAt: new Date().toISOString(),
      }));
    },
    onError,
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
    submitAttempt: mutation.mutate,
  };
}
