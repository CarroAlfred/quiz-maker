import { Outlet } from 'react-router-dom';
import { Typography } from '../../common';

export function Dashboard() {
  return (
    <div className='flex min-h-screen bg-gray-50'>
      {/* Sidebar */}
      <aside className='w-64 border-r shadow-sm flex flex-col'>
        <Typography
          variant='h4'
          className='p-4 border-b'
        >
          Quiz App
        </Typography>
        <nav className='flex-1 p-4 space-y-2'>
          <a
            href='/'
            className='block px-3 py-2 rounded-lg hover:bg-gray-100 font-medium'
          >
            Quizzes
          </a>
        </nav>
      </aside>

      {/* Main content */}
      <div className='flex-1 flex flex-col'>
        {/* Header */}

        {/* Page content */}
        <main className='flex-1 p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
