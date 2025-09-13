import { FaEdit } from 'react-icons/fa';
import { Button, Typography } from '../../../components';
import { Quiz } from '../../../types';
import { formatDuration } from '../../../utils';

type QuizSidebarProps = {
  quiz: Quiz.QuizInfo & { questions: Quiz.Question[] };
  className?: string;
  onCLickEdit?: () => void;
};

export default function QuizSidebar({ quiz, className = '', onCLickEdit }: QuizSidebarProps) {
  return (
    <aside className={`bg-white/5 py-20 ${className}`}>
      <Typography
        variant='h2'
        className='capitalize px-4'
      >
        {quiz.title}
      </Typography>
      <Typography
        variant='small'
        className='my-2 p-2 px-4 bg-gray-100 rounded-b-sm'
      >
        {quiz.description}
      </Typography>

      <Typography
        as='span'
        weight='bold'
        className='px-4 py-1 flex flex-row gap-1 justify-between'
      >
        <Typography
          weight='bold'
          className='text-gray-800'
        >
          Quiz Id
        </Typography>
        <Typography>{quiz.id}</Typography>
      </Typography>

      <Typography
        as='span'
        weight='bold'
        className='px-4 py-1 flex flex-row gap-1 justify-between'
      >
        <Typography
          weight='bold'
          className='text-gray-800'
        >
          Time Limit
        </Typography>
        <Typography>{formatDuration(quiz.timeLimitSeconds) ?? 'No limit'}</Typography>
      </Typography>
      <Typography
        as='span'
        className='px-4 py-1 flex flex-row gap-1 justify-between'
      >
        <Typography
          weight='bold'
          className='text-gray-800'
        >
          Status
        </Typography>
        <Typography className={quiz.isPublished ? 'text-green-600' : 'text-red-500'}>
          {quiz.isPublished ? 'Published' : 'Draft'}
        </Typography>
      </Typography>
      <Typography
        variant='small'
        as='span'
        className='text-sm py-1 px-4 flex flex-row gap-1 justify-between'
      >
        <Typography
          weight='bold'
          className='text-gray-800'
        >
          Created at
        </Typography>
        <Typography
          variant='small'
          className='italic'
        >
          {new Date(quiz.createdAt).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          })}
        </Typography>
      </Typography>
      <Typography
        as='span'
        className='px-4 py-1 flex flex-row gap-1 justify-between'
      >
        <Typography
          weight='bold'
          className='text-gray-800'
        >
          Questions
        </Typography>
        <Typography weight='semibold'> {quiz.questions.length}</Typography>
      </Typography>

      <div className='flex justify-end px-4'>
        <Button
          icon={<FaEdit />}
          variant='outline'
          size='sm'
          className='text-xs'
          onClick={onCLickEdit}
        >
          Update Details
        </Button>
      </div>
    </aside>
  );
}
