import { Outlet } from 'react-router-dom';

// todo update the layout and links
export function Dashboard() {
  return (
    <div className='flex min-h-screen bg-gray-50'>
      {/* Sidebar */}
      <aside className='w-64 bg-white border-r shadow-sm flex flex-col'>
        <div className='p-4 font-bold text-lg border-b'>Quiz App</div>
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
