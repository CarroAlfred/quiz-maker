import { Quiz } from '../../../types';

export default function QuestionCard({ question }: { question: Quiz.Question }) {
  return (
    <div className='p-4 rounded-xl bg-white/5 backdrop-blur-sm shadow-md'>
      <h4 className='font-semibold mb-2'>{question.type.toUpperCase()} Question</h4>
      <p className='text-gray-300 mb-2'>{question.prompt}</p>

      {question.type === 'mcq' && question.options && (
        <ul className='list-disc pl-5 text-gray-200'>
          {question.options.map((opt, idx) => (
            <li key={idx}>{opt}</li>
          ))}
        </ul>
      )}

      {question.correctAnswer && <p className='text-gray-400 text-sm'>Answer: {question.correctAnswer}</p>}
    </div>
  );
}
