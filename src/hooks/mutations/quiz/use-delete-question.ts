import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QuizServiceApi } from '../../../api';

export function useDeleteQuestion({
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
    mutationFn: async (questionId: number) => {
      await QuizServiceApi.deleteQuizQuestion(questionId);
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
    handleDeleteQuestion: response.mutate,
  };
}
