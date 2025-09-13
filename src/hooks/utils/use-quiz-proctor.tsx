import { useEffect, useState, useMemo } from 'react';
import { showToast } from '../../components';

export interface ViolationEntry {
  timestamp: string; // ISO string
}

export interface Violations {
  copy: ViolationEntry[];
  paste: ViolationEntry[];
  tabSwitch: ViolationEntry[];
  exitAttempt: ViolationEntry[];
}

export function useQuizProctor(enabled = true) {
  const [violations, setViolations] = useState<Violations>({
    copy: [],
    paste: [],
    tabSwitch: [],
    exitAttempt: [],
  });

  useEffect(() => {
    if (!enabled) return;
    const addViolation = (type: keyof Violations) => {
      const entry = { timestamp: new Date().toISOString() };
      setViolations((prev) => ({
        ...prev,
        [type]: [...prev[type], entry],
      }));
    };

    const handleCopy = () => {
      addViolation('copy');
      showToast.warn('Copy action detected!');
    };

    const handlePaste = () => {
      addViolation('paste');
      showToast.warn('Paste action detected!');
    };

    const handleBlur = () => {
      addViolation('tabSwitch');
      showToast.warn('Tab switch detected!');
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      addViolation('exitAttempt');
      showToast.warn('Exit attempt detected!');
      e.preventDefault();
    };

    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [enabled]);

  // memoized counts
  const counts = useMemo(
    () => ({
      copyCount: violations.copy.length,
      pasteCount: violations.paste.length,
      tabSwitchCount: violations.tabSwitch.length,
      exitAttempts: violations.exitAttempt.length,
    }),
    [violations],
  );

  return { violations, counts };
}
