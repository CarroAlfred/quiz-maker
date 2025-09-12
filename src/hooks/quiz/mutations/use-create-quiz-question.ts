import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Quiz } from '../../../types';
import { QuizServiceApi } from '../../../api';

export function useCreateQuestion({
  quizId,
  onSuccess = () => {},
  onError = () => {},
}: {
  quizId: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}) {
  const queryClient = useQueryClient();

  const response = useMutation({
    mutationFn: async (data: Omit<Quiz.Question, 'id' | 'quizId'>) => {
      const res = await QuizServiceApi.createQuizQuestion(quizId, data);
      return res;
    },
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries({
        queryKey: ['quiz', quizId],
      });
    },
    onError,
  });

  return {
    ...response,
    isLoading: response.isPending,
    handleCreateQuestion: response.mutate,
  };
}
