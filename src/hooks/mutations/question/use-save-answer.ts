import { useQueryClient, useMutation } from '@tanstack/react-query';
import { QuizServiceApi } from '../../../api';

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

  const saveAnswer = (body: { questionId: number; value: string | number }) => {
    if (!attemptId) return; // skip if attemptId not ready
    mutation.mutate(body);
  };

  return {
    ...mutation,
    isLoading: mutation.isPending,
    saveAnswer,
  };
}
