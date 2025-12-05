import { useEffect, useRef } from 'react';
import { useResumeStore } from '@/store/resumeStore';

export function useAutoSave(delay: number = 1500) {
  const resume = useResumeStore((state) => state.resume);
  const save = useResumeStore((state) => state.save);
  const saveStatus = useResumeStore((state) => state.saveStatus);
  const setSaveStatus = useResumeStore((state) => state.setSaveStatus);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!resume) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setSaveStatus('idle');

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(() => {
      save();
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [resume, delay, save, setSaveStatus]);

  return saveStatus;
}
