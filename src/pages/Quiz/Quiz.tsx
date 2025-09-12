import { useNavigate } from 'react-router-dom';
import { Container } from '../../components';
import { CreateQuizDialog } from '../../presentation';
import { useState } from 'react';

export const Quiz = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <Container className='grid grid-cols-2 gap-6 place-items-center h-full'>
      <div className='relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg'>
        <div className='relative h-56 m-2.5 overflow-hidden text-white rounded-md'>
          <span>📋</span>
        </div>
        <div className='p-4'>
          <h6 className='mb-2 text-slate-800 text-xl font-semibold'>Quiz List</h6>
          <p className='text-slate-600 leading-normal font-light'>Check Current Quizzes</p>
        </div>
        <div className='px-4 pb-4 pt-0 mt-2'>
          <button
            onClick={() => navigate('/quiz/list')}
            className='rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
            type='button'
          >
            Check
          </button>
        </div>
      </div>
      <div className='relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg'>
        <div className='relative h-56 m-2.5 overflow-hidden text-white rounded-md'>
          <span>👨🏻‍💻</span>
        </div>
        <div className='p-4'>
          <h6 className='mb-2 text-slate-800 text-xl font-semibold'>Create a Quiz</h6>
          <p className='text-slate-600 leading-normal font-light'>Create Quiz for more challenge</p>
        </div>
        <div className='px-4 pb-4 pt-0 mt-2'>
          <button
            onClick={() => setIsCreateDialogOpen(true)}
            className='rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
            type='button'
          >
            Create Quiz
          </button>
        </div>
      </div>

      <CreateQuizDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </Container>
  );
};
