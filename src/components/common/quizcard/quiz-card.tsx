import { Quiz } from '../../../types';
import { FaCalendarAlt, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { Typography } from '../typography';
import { Button } from '../button';
import { formatDuration } from '../../../utils';
import { FiEdit } from 'react-icons/fi';

type QuizCardProps = {
  quiz: Quiz.QuizInfo;
  onView?: () => void;
  onClickAttempTest?: () => void;
};

export function QuizCard({ quiz, onClickAttempTest, onView: onClickView }: QuizCardProps) {
  return (
    <div className='relative rounded-2xl bg-white group shadow hover:shadow-md transition border border-gray-100 p-6 flex flex-col justify-between'>
      {onClickView && (
        <div className='hidden group-hover:flex absolute -right-[10px] -top-[10px] transition-all duration-200'>
          <Button
            variant='outline'
            icon={<FiEdit />}
            size='sm'
            onClick={onClickView}
            className='bg-white shadow-sm hover:shadow-md transition'
          />
        </div>
      )}

      {/* Header */}
      <div className='mb-4'>
        <Typography
          variant='h6'
          className='flex items-center gap-2'
        >
          📚 {quiz.title}
        </Typography>
        <Typography
          variant='body'
          className='text-gray-600 mt-1'
        >
          {quiz.description}
        </Typography>
      </div>

      {/* Details */}
      <div className='space-y-2 text-sm text-gray-700 mb-4'>
        {/* Created date */}
        <div className='flex items-center gap-2'>
          <FaCalendarAlt className='text-gray-400' />
          <Typography variant='caption'>
            {new Date(quiz.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            })}
          </Typography>
        </div>

        {/* Time limit */}
        {quiz.timeLimitSeconds && (
          <div className='flex items-center gap-2'>
            <FaClock className='text-gray-400' />
            <Typography variant='caption'>{formatDuration(quiz.timeLimitSeconds)}</Typography>
          </div>
        )}

        {/* Published status */}
        <div className='flex items-center gap-2'>
          {quiz.isPublished ? (
            <>
              <FaCheckCircle className='text-green-500' />
              <Typography
                variant='caption'
                className='text-green-600 font-medium'
              >
                Published
              </Typography>
            </>
          ) : (
            <>
              <FaTimesCircle className='text-red-500' />
              <Typography
                variant='caption'
                className='text-red-600 font-medium'
              >
                Draft
              </Typography>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className='flex gap-2 justify-end'>
        {quiz.isPublished && onClickAttempTest && (
          <Button
            variant='outline'
            size='sm'
            onClick={() => {
              onClickAttempTest();
            }}
            className='w-full'
          >
            <Typography variant='caption'>Take Quiz</Typography>
          </Button>
        )}
      </div>
    </div>
  );
}
