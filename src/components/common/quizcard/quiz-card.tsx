import { Quiz } from '../../../types';
import { FaCalendarAlt, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

type QuizCardProps = {
  quiz: Quiz.QuizInfo;
  onClick?: () => void;
};

export function QuizCard({ quiz, onClick }: QuizCardProps) {
  return (
    <div
      onClick={onClick}
      className='group cursor-pointer rounded-2xl bg-white shadow hover:shadow-md transition p-6 border border-gray-100'
    >
      {/* Title */}
      <h2 className='text-xl font-semibold mb-2 flex items-center gap-2'>📚 {quiz.title}</h2>

      {/* Description */}
      <p className='text-gray-600 mb-4'>{quiz.description}</p>

      {/* Details */}
      <div className='space-y-2 text-sm text-gray-700'>
        {/* Created date */}
        <div className='flex items-center gap-2'>
          <FaCalendarAlt className='text-gray-400' />
          <span>{new Date(quiz.createdAt).toLocaleDateString()}</span>
        </div>

        {/* Time limit */}
        {quiz.timeLimitSeconds && (
          <div className='flex items-center gap-2'>
            <FaClock className='text-gray-400' />
            <span>⏱ {Math.floor(quiz.timeLimitSeconds / 60)} min</span>
          </div>
        )}

        {/* Published status */}
        <div className='flex items-center gap-2'>
          {quiz.isPublished ? (
            <>
              <FaCheckCircle className='text-green-500' />
              <span className='text-green-600 font-medium'>Published</span>
            </>
          ) : (
            <>
              <FaTimesCircle className='text-red-500' />
              <span className='text-red-600 font-medium'>Draft</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
