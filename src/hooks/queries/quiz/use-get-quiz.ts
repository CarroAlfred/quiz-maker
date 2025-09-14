import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { QuizServiceApi } from '../../../api';
import { Quiz } from '../../../types';

export function useGetQuizList(): UseQueryResult<Quiz.QuizInfo[], Error> {
  return useQuery({
    queryKey: ['quizzes'],
    queryFn: () => QuizServiceApi.getAllQuiz(), // directly return promise
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
