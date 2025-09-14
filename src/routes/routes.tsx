import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Dashboard } from '../components';
import { QuizDetailsPage } from '../presentation';
import { Quiz, Player } from '../pages';

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
          element={<Player />}
        />
      </Routes>
    </BrowserRouter>
  );
};
