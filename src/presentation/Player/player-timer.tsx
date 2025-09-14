import { useState, useEffect, useRef } from 'react';
import { Typography } from '../../components';

interface TimerProps {
  quizId: number | string; // 👈 each quiz has its own storage key
  duration: number; // duration in seconds
  onTimeUp: () => void;
}

export function PlayerTimer({ quizId, duration, onTimeUp }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(duration);
  const timerRef = useRef<number | null>(null);
  const calledRef = useRef(false);
  const onTimeUpRef = useRef(onTimeUp);

  const storageKey = `quizEndTime_${quizId}`; // 👈 unique per quiz

  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  useEffect(() => {
    if (!duration || duration <= 0) return;

    // check saved endTime for this quiz
    const storedEnd = localStorage.getItem(storageKey);
    let endTime: number;

    if (storedEnd && !isNaN(Number(storedEnd))) {
      endTime = Number(storedEnd);
    } else {
      endTime = Date.now() + duration * 1000;
      localStorage.setItem(storageKey, endTime.toString());
    }

    // sync state
    setTimeLeft(Math.max(0, Math.floor((endTime - Date.now()) / 1000)));
    calledRef.current = false;

    timerRef.current = window.setInterval(() => {
      const remaining = Math.floor((endTime - Date.now()) / 1000);

      if (remaining <= 0) {
        if (timerRef.current !== null) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setTimeLeft(0);

        if (!calledRef.current) {
          calledRef.current = true;
          localStorage.removeItem(storageKey); // clear only this quiz
          onTimeUpRef.current();
        }
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [duration, quizId, storageKey]);

  const formatTime = (seconds: number) => {
    const s = Math.max(0, Math.floor(seconds));
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className='flex justify-between items-center border-b border-gray-300 pb-4 mb-4'>
      <Typography
        variant='h3'
        weight='bold'
        className='text-gray-500'
      >
        Time Remaining
      </Typography>
      <Typography
        variant='h3'
        weight='extrabold'
        className='text-gray-400 italic'
      >
        {formatTime(timeLeft)}
      </Typography>
    </div>
  );
}
