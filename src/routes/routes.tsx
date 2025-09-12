import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Quiz } from '../pages';
import { Dashboard } from '../components';
import { QuizList, QuizDetailsPage } from '../presentation';
import { PlayerPage } from '../presentation/Player/player-page';

// this will consist of quiz routes and player routes
export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Dashboard />}>
          <Route
            path='/'
            element={<Quiz />}
          />
          <Route
            path='/quiz/list'
            element={<QuizList />}
          />
        </Route>
        <Route
          path='/quiz/details/:id'
          element={<QuizDetailsPage />}
        />
        <Route
          path='/player'
          element={<PlayerPage />}
        />
      </Routes>
    </BrowserRouter>
  );
};
