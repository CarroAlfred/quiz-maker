import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Quiz } from '../../../types';
import { QuizServiceApi } from '../../../api';

export function useCreateQuiz({
  onSuccess = () => {},
  onError = () => {},
}: {
  onSuccess?: (data?: Quiz.QuizInfo) => void;
  onError?: (error: string) => void;
}) {
  const queryClient = useQueryClient();

  const response = useMutation({
    mutationFn: async (body: Omit<Quiz.QuizInfo, 'id' | 'createdAt'>) => {
      const res = await QuizServiceApi.createQuiz(body);
      return res;
    },
    onSuccess: (data) => {
      onSuccess(data);
      queryClient.invalidateQueries({
        queryKey: ['quizzes'],
      });
    },
    onError,
  });

  return {
    ...response,
    isLoading: response.isPending,
    handleCreateQuiz: response.mutate,
  };
}
