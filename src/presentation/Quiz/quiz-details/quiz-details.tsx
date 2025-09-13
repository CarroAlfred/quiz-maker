import { useNavigate, useParams } from 'react-router-dom';
import { Button, Container, showToast } from '../../../components';
import QuizSidebar from './quiz-sidebar';
import QuestionCard from './question-card';
import { useState } from 'react';
import { MultiQuestionDialog } from '../question';
import { CreateUpdateQuizDialog } from '../create-quiz';
import { useUpdateQuizMetadata, useGetQuiz } from '../../../hooks';
import { BsArrowLeft, BsPlusCircle } from 'react-icons/bs';

export function QuizDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [showQuestionForm, setShowQuestionForm] = useState(false);

  const [isShowUpdateQuizForm, setIsShowUpdateQuizForm] = useState(false);

  const navigate = useNavigate();

  const { data: quiz, isLoading } = useGetQuiz(Number(id));
  const { isLoading: updateLoading, handleUpdateQuiz } = useUpdateQuizMetadata({
    quizId: Number(id),
    onSuccess: () => {
      // TODO show toast
      setIsShowUpdateQuizForm(false);
      showToast.success('Quiz updated successfully!');
    },
    onError: () => {
      showToast.error('Error updating quiz');
    },
  });

  // FIX THE LAYOUT LATER
  return (
    <Container className='flex h-screen'>
      {/* Sidebar */}
      <QuizSidebar
        quiz={{
          id: Number(quiz?.id),
          title: quiz?.title || '',
          description: quiz?.description || '',
          isPublished: quiz?.isPublished ?? false,
          timeLimitSeconds: quiz?.timeLimitSeconds || 0,
          createdAt: quiz?.createdAt || '',
          questions: quiz?.questions || [],
        }}
        className='w-full md:w-1/4'
        onCLickEdit={() => setIsShowUpdateQuizForm(true)}
      />

      {/* Main content */}
      <main className='flex-1 overflow-auto p-6'>
        <div className='flex justify-between items-center mb-4'>
          <Button
            variant='ghost'
            icon={<BsArrowLeft />}
            onClick={() => navigate(-1)}
          >
            Go back to List
          </Button>
          <Button
            variant='outline'
            icon={<BsPlusCircle />}
            size='sm'
            onClick={() => setShowQuestionForm(true)}
          >
            Add Question
          </Button>
        </div>

        <div className='flex-1 grid gap-4 grid-row-[repeat(auto-fit,minmax(250px,1fr))] py-4'>
          {/* TODO ADD LOADING AND EMTPY VIEW */}
          {quiz?.questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
            />
          ))}
        </div>
      </main>

      <MultiQuestionDialog
        open={showQuestionForm}
        quizId={Number(id)}
        onClose={() => setShowQuestionForm(false)}
      />

      <CreateUpdateQuizDialog
        open={isShowUpdateQuizForm}
        onClose={() => setIsShowUpdateQuizForm(false)}
        initialValues={{ ...quiz }}
        onClick={handleUpdateQuiz}
      />
    </Container>
  );
}
