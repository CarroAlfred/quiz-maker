import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Quiz } from '../../../types';
import { QuizServiceApi } from '../../../api';

export function useUpdateQuestion({
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
    mutationFn: async ({ questionId, data }: { questionId: number; data: Partial<Quiz.Question> }) => {
      const res = await QuizServiceApi.updateQuestion(questionId, data);
      return res;
    },
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries({
        queryKey: ['quiz', quizId], // refresh quiz details/questions
      });
    },
    onError,
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
    handleUpdateQuestion: mutation.mutate,
  };
}
