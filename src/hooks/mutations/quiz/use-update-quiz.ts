import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Quiz } from '../../../types';
import { QuizServiceApi } from '../../../api';

export function useUpdateQuizMetadata({
  quizId,
  onSuccess = () => {},
  onError = () => {},
}: {
  quizId: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: Partial<Quiz.QuizInfo>) => {
      const res = await QuizServiceApi.updateQuizMetadata(quizId, data);
      return res;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['quiz'] }),
        queryClient.invalidateQueries({ queryKey: ['quiz', quizId] }),
      ]);
      onSuccess();
    },
    onError,
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
    handleUpdateQuiz: mutation.mutate,
  };
}
