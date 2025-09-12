import { Container, QuizCard } from '../../../components';
import { useGetQuizList } from '../../../hooks';
import { useNavigate } from 'react-router-dom';

export function QuizList() {
  const navigate = useNavigate();
  const { data: quizzes } = useGetQuizList();

  return (
    <Container className='grid gap-4 grid-cols-[repeat(auto-fit,minmax(240px,1fr))]'>
      {/* add a checker when its not published dont let the player take the test */}
      {quizzes?.map((quiz) => (
        <QuizCard
          key={quiz.id}
          quiz={{ ...quiz }}
          // onClick={() => setSelectedQuizId(quiz.id)}
          onClick={() => navigate(`/quiz/details/${quiz.id}`)}
        />
      ))}
    </Container>
  );
}
