import { useEffect, useRef } from 'react';
// Each range owns its timer; URL changes/back navigation cancel its pending edit.
export default function useDebouncedRange(onCommit: (range: number[]) => void, from?: number, to?: number) {
 const callback = useRef(onCommit); callback.current = onCommit;
 const timer = useRef<ReturnType<typeof setTimeout>>();
 const cancel = () => { if (timer.current) clearTimeout(timer.current); };
 useEffect(() => { cancel(); return cancel; }, [from, to]);
 useEffect(() => { window.addEventListener('popstate', cancel); return () => window.removeEventListener('popstate', cancel); }, []);
 return (range: number[]) => {
  cancel();
  const next = [Math.min(...range), Math.max(...range)];
  if (next[0] === from && next[1] === to) return;
  timer.current = setTimeout(() => callback.current(next), 350);
 };
}
