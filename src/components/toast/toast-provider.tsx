import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * ToastProvider: put this once at the root of your app
 */
export function ToastProvider() {
  return <ToastContainer />;
}
