import React, { useEffect, useRef, useState } from 'react';
import { TextField } from '@mui/material';
export default function FilterInput({ value, onChange, ...props }: any) {
	const [draft, setDraft] = useState(value);
	const committed = useRef(value); committed.current = value;
	const change = useRef(onChange);
	change.current = onChange;
	const timer = useRef<ReturnType<typeof setTimeout>>();
	useEffect(() => {
		setDraft(value);
		if (timer.current) clearTimeout(timer.current);
	}, [value]);
 useEffect(() => {
  const reset = () => { if (timer.current) clearTimeout(timer.current); setDraft(committed.current); };
  window.addEventListener('popstate', reset);
  return () => { window.removeEventListener('popstate', reset); if (timer.current) clearTimeout(timer.current); };
 }, []);
	return (
		<TextField
			{...props}
			value={draft}
			onChange={(e) => {
				const next = e.target.value;
				setDraft(next);
				if (timer.current) clearTimeout(timer.current);
				timer.current = setTimeout(() => change.current(next), 350);
			}}
		/>
	);
}
