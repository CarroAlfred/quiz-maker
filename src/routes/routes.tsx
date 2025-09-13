import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Dashboard } from '../components';
import { QuizDetailsPage } from '../presentation';
import { PlayerPage } from '../presentation/Player/player-page';
import { Quiz } from '../pages';

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
        </Route>
        <Route
          path='/quiz/details/:id'
          element={<QuizDetailsPage />}
        />
        <Route
          path='/assessment/:quizId'
          element={<PlayerPage />}
        />
      </Routes>
    </BrowserRouter>
  );
};
