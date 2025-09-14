import { useState } from 'react';
import { Button, DeleteConfirmationDialog, showToast, Typography } from '../../../components';
import { Quiz } from '../../../types';
import { UpdateQuestionDialog } from '../question';
import { useDeleteQuestion } from '../../../hooks';

type QuestionCardProps = {
  question: Quiz.Question;
  questionCount: number;
};

export default function QuestionCard({ question, questionCount }: QuestionCardProps) {
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const { isLoading, handleDeleteQuestion } = useDeleteQuestion({
    quizId: question.quizId,
    onSuccess: () => {
      showToast.success('Question deleted successfully');
      setOpenDeleteDialog(false);
    },
    onError: () => {
      showToast.error('Failed to delete question');
    },
  });

  return (
    <div className='p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-gray-200 group hover:shadow-md transition-shadow'>
      <div className='flex justify-between items-center'>
        <Typography
          variant='h5'
          weight='semibold'
        >
          {question.type.toUpperCase()} Question
        </Typography>
        <div className='hidden gap-2 group-hover:flex'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setOpenDeleteDialog(true)}
          >
            <Typography variant='caption'>Delete</Typography>
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setOpenUpdateDialog(true)}
          >
            <Typography variant='caption'>Update</Typography>
          </Button>
        </div>
      </div>

      <Typography
        variant='small'
        weight='thin'
        className='my-2 italic text-gray-800 capitalize px-4 bg-gray-100 rounded-sm py-2'
      >
        {question.prompt}
      </Typography>

      {question.type === 'mcq' && question.options && (
        <ul className='gap-2 flex flex-col my-4'>
          {question.options.map((opt, idx) => (
            <li
              key={idx}
              className={`p-2 border border-gray-200 rounded-sm ${idx === question.correctAnswer ? 'bg-green-100' : ''}`}
            >
              <Typography
                variant='caption'
                weight='extrabold'
              >
                {opt}
              </Typography>
            </li>
          ))}
        </ul>
      )}

      {question.type !== 'mcq' && question.correctAnswer && (
        <Typography
          as='div'
          className='bg-green-100 py-4 px-3 mt-4'
        >
          <Typography
            variant='caption'
            weight='thin'
          >
            {question.correctAnswer}
          </Typography>
        </Typography>
      )}

      <UpdateQuestionDialog
        open={openUpdateDialog}
        onClose={() => setOpenUpdateDialog(false)}
        quizId={question.quizId}
        question={question}
        questionCount={questionCount}
      />

      <DeleteConfirmationDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={() => handleDeleteQuestion(question.id)}
        isLoading={isLoading}
      />
    </div>
  );
}
