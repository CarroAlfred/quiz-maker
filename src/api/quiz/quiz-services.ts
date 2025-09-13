import type { Quiz } from '../../types';
import { api } from '../services/api';

export class QuizServiceApi {
  /**
   * Get country List.
   * @returns List of Country {id: string, value: string}
   * @throws error if request fails
   */

  public static getAllQuiz() {
    return api.get<Quiz.QuizInfo[]>('/quizzes');
  }

  /**
   * Get a single quiz by ID, including questions
   * @param quizId
   */
  public static getQuizById(quizId: number) {
    return api.get<Quiz.QuizInfo & { questions: Quiz.Question[] }>(`/quizzes/${quizId}`);
  }

  /**
   * Create a quiz
   * @param data quiz payload
   * @returns {Quiz.QuizInfo} created quiz
   * @throws error if request fails
   */
  public static createQuiz(data: Omit<Quiz.QuizInfo, 'id' | 'createdAt'>) {
    return api.post<Quiz.QuizInfo>('/quizzes', data);
  }

  /**
   * Create a question for a specific quiz
   * @param quizId - id of the quiz
   * @param data - question payload
   */
  public static createQuizQuestion(quizId: number, data: Omit<Quiz.Question, 'id' | 'quizId'>) {
    return api.post<Quiz.Question>(`/quizzes/${quizId}/questions`, data);
  }

  /**
   * Update quiz metadata
   * @param quizId - id of the quiz
   * @param data - question payload
   */
  public static updateQuizMetadata(quizId: number, data: Partial<Quiz.QuizInfo>) {
    return api.patch<Quiz.QuizInfo>(`/quizzes/${quizId}`, data);
  }

  /**
   * Update question (e.g., text, options, position for reordering)
   */
  public static updateQuestion(questionId: number, data: Partial<Quiz.Question>) {
    return api.patch<Quiz.Question>(`/questions/${questionId}`, data);
  }

  /**
   * Delete a question by id
   */
  public static deleteQuizQuestion(questionId: number) {
    return api.delete<void>(`/questions/${questionId}`);
  }

  // submit

  public static startQuiz(quizId: number) {
    return api.post<Quiz.Attempt>('/attempts', { quizId });
  }

  /**
   * Save/Upsert an answer
   */
  public static saveQuizAnswer(attemptId: number, body: { questionId: number; value: string }) {
    return api.post(`/attempts/${attemptId}/answer`, body);
  }

  /**
   * Submit attempt for grading
   */
  public static submitQuizAttempt(attemptId: number) {
    return api.post<Quiz.AttemptResult>(`/attempts/${attemptId}/submit`);
  }
}
