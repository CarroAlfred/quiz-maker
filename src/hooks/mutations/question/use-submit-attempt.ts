import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Quiz } from '../../../types';
import { QuizServiceApi } from '../../../api';

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
