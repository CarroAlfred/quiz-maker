import { Typography } from '../../components';
import { ViolationEntry } from '../../hooks';

interface PlayerScoreProps {
  score: number;
  total: number;
  violations?: {
    copy?: ViolationEntry[];
    paste?: ViolationEntry[];
    tabSwitch?: ViolationEntry[];
    exitAttempt?: ViolationEntry[];
  };
}

export function PlayerScore({ score, total, violations }: PlayerScoreProps) {
  return (
    <div className='flex flex-col items-center justify-center h-screen gap-8 bg-gray-50'>
      {/* Score */}
      <Typography
        variant='h1'
        weight='extrabold'
        className='text-6xl sm:text-7xl md:text-8xl text-blue-600'
      >
        {score} / {total}
      </Typography>

      {/* Label */}
      <Typography
        variant='h5'
        className='text-gray-600'
      >
        Your Score
      </Typography>

      {/* Violations */}
      {violations && (
        <div className='flex flex-col items-center gap-1 text-sm text-gray-500'>
          {violations.copy?.map((entry, idx) => (
            <Typography
              key={idx}
              variant='caption'
            >
              Copy detected: {idx + 1} ({new Date(entry.timestamp).toLocaleTimeString()})
            </Typography>
          ))}
          {violations.paste?.map((entry, idx) => (
            <Typography
              key={idx}
              variant='caption'
            >
              Paste detected: {idx + 1} ({new Date(entry.timestamp).toLocaleTimeString()})
            </Typography>
          ))}
          {violations.tabSwitch?.map((entry, idx) => (
            <Typography
              key={idx}
              variant='caption'
            >
              Tab switch detected: {idx + 1} ({new Date(entry.timestamp).toLocaleTimeString()})
            </Typography>
          ))}
          {violations.exitAttempt?.map((entry, idx) => (
            <Typography
              key={idx}
              variant='caption'
            >
              Exit attempt detected: {idx + 1} ({new Date(entry.timestamp).toLocaleTimeString()})
            </Typography>
          ))}
        </div>
      )}
    </div>
  );
}
