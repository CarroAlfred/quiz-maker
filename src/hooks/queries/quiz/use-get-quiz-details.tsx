import { useQuery } from '@tanstack/react-query';
import { QuizServiceApi } from '../../../api';

export function useGetQuiz(quizId: number) {
  return useQuery({
    queryKey: ['quiz', quizId],
    queryFn: () => QuizServiceApi.getQuizById(quizId),
    enabled: !!quizId, // only fetch if quizId exists
    staleTime: 1000 * 60, // 1 minute caching
  });
}
