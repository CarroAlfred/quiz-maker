import { useQueryClient, useMutation } from '@tanstack/react-query';
import { QuizServiceApi } from '../../../api';
import { Quiz } from '../../../types';

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
