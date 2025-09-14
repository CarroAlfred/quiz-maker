import { Button, Container, QuizCard, showToast } from '../../components';
import { useCreateQuiz, useGetQuizList } from '../../hooks';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { CreateUpdateQuizDialog } from '../../presentation';

export function Quiz() {
  const navigate = useNavigate();
  const { data: quizzes } = useGetQuizList();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { handleCreateQuiz, isLoading } = useCreateQuiz({
    onSuccess: (data) => {
      showToast.success('Quiz created successfully!');
      navigate(`/quiz/details/${data?.id}`);
      setIsCreateDialogOpen(false);
    },
    onError: () => {
      showToast.error('Quiz Error');
    },
  });

  const handleOpenQuiz = (quizId: number) => {
    window.open(`/assessment/${quizId}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <Container className='grid gap-4 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]'>
      <div className='flex flex-col items-center justify-between h-auto p-6 bg-white rounded-2xl shadow-md border border-gray-200'>
        <div className='flex-1 flex items-center justify-center text-8xl'>📄</div>

        {/* Button */}
        <Button
          variant='outline'
          className='w-full mt-4'
          onClick={() => setIsCreateDialogOpen(true)}
        >
          Add Quiz
        </Button>
      </div>
      {quizzes?.map((quiz) => (
        <QuizCard
          key={quiz.id}
          quiz={{ ...quiz }}
          onView={() => navigate(`/quiz/details/${quiz.id}`)}
          onClickAttempTest={() => handleOpenQuiz(quiz.id)}
        />
      ))}

      <CreateUpdateQuizDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onClick={handleCreateQuiz}
        isLoading={isLoading}
      />
    </Container>
  );
}
