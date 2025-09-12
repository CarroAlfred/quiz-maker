import { Typography } from '../../../components';
import { Quiz } from '../../../types';
import { formatDuration } from '../../../utils';

export default function QuizSidebar({
  quiz,
  className = '',
}: {
  quiz: Quiz.QuizInfo & { questions: Quiz.Question[] };
  className?: string;
}) {
  return (
    <aside className={`bg-white/5 py-4 ${className}`}>
      <Typography
        variant='h2'
        className='capitalize px-4'
      >
        {quiz.title}
      </Typography>
      <Typography
        variant='small'
        className='my-2 p-2 bg-gray-100 rounded-b-sm'
      >
        {quiz.description}
      </Typography>

      <Typography as='p'>
        <Typography
          as='p'
          weight='bold'
          className='px-4'
        >
          Time Limit: {formatDuration(quiz.timeLimitSeconds) ?? 'No limit'}
        </Typography>
      </Typography>
      <Typography
        as='p'
        className='px-4 flex flex-row gap-1'
      >
        <Typography weight='bold'>Status:</Typography>
        <Typography className={quiz.isPublished ? 'text-green-600' : 'text-red-500'}>
          {quiz.isPublished ? 'Published' : 'Draft'}
        </Typography>
      </Typography>
      <p className='mt-2 text-gray-400 text-sm'>Created at: {new Date(quiz.createdAt).toLocaleString()}</p>
      <p className='mt-4'>
        <strong>Questions:</strong> {quiz.questions.length}
      </p>
    </aside>
  );
}
