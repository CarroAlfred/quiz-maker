import { useNavigate, useParams } from 'react-router-dom';
import { Container } from '../../../components';
import QuizSidebar from './quiz-sidebar';
import QuestionCard from './question-card';
import { useGetQuiz } from '../../../hooks/quiz/queries/use-get-quiz-details';
import { useState } from 'react';
import MultiQuestionDialog from '../question/create-question/create-question';

export function QuizDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const navigate = useNavigate();

  const { data: quiz, isLoading } = useGetQuiz(Number(id));

  // FIX THE LAYOUT LATER
  return (
    <div className='flex h-screen'>
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
        className='w-full md:w-1/4 border-r-4 border-gray-200'
      />

      {/* Main content */}
      <main className='flex-1 overflow-auto p-6'>
        <div className='flex justify-between items-center mb-4'>
          <button
            type='button'
            onClick={() => navigate(-1)}
          >
            Go back to List
          </button>
          <button
            type='button'
            onClick={() => setShowQuestionForm(true)}
          >
            Add Question
          </button>
        </div>

        <Container className='flex-1 grid gap-4 grid-row-[repeat(auto-fit,minmax(250px,1fr))] py-4'>
          {/* TODO ADD LOADING AND EMTPY VIEW */}
          {quiz?.questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
            />
          ))}
        </Container>
      </main>

      <MultiQuestionDialog
        open={showQuestionForm}
        quizId={Number(id)}
        onClose={() => setShowQuestionForm(false)}
      />
    </div>
  );
}
