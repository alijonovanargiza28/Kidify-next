import useDebouncedRange from '../../hooks/useDebouncedRange';
import useUiText from '../../hooks/useUiText';
import React, { useEffect, useState } from 'react';
import { Slider, Button } from '@mui/material';
export default function AgeRangeFilter({
	from,
	to,
	onCommit,
	onClear,
}: {
	from?: number;
	to?: number;
	onCommit: (range: number[]) => void;
	onClear: () => void;
}) {
 const uiText = useUiText();
 const commitRange = useDebouncedRange(onCommit, from, to);

	const [range, setRange] = useState([from ?? 0, to ?? 24]);
	useEffect(() => setRange([from ?? 0, to ?? 24]), [from, to]);
	const commit = (v: number[]) => { if (v[0] !== (from ?? 0) || v[1] !== (to ?? 24)) commitRange(v); };
	const bound = Math.max(24, from ?? 0, to ?? 24);
	const change = (index: number, value: number) =>
		setRange((old) => {
			const next = [...old];
			next[index] = Math.max(
				index === 0 ? 0 : old[0],
				Math.min(index === 0 ? old[1] : 240, Number.isFinite(value) ? value : 0),
			);
			return next;
		});
	return (
		<fieldset className="filter-group age-range-filter">
			<legend>{uiText("Age in months")}</legend>
			<Slider
				value={range}
				min={0}
				max={bound}
				step={1}
				disableSwap
				getAriaLabel={(i) => (i === 0 ? 'Minimum age in months' : 'Maximum age in months')}
				getAriaValueText={(v) => `${v} months`}
				onChange={(_, v) => setRange(v as number[])}
				onChangeCommitted={(_, v) => commit(v as number[])}
			/>
			<div className="age-range-values">
				{['From', 'To'].map((label, i) => (
					<label key={label}>
						{label}
						<span>
							<input
								aria-label={`${label} age in months`}
								type="number"
								min={i === 0 ? 0 : range[0]}
								max={i === 0 ? range[1] : 240}
								value={range[i]}
								onChange={(e) => change(i, Number(e.target.value))}
								onBlur={() => commit(range)}
								onKeyDown={(e) => {
									if (e.key === 'Enter') e.currentTarget.blur();
								}}
							/>{' '}
							{uiText("months")}</span>
					</label>
				))}
			</div>
			{from != null && (
				<Button size="small" onClick={onClear}>
					{uiText("All ages")}</Button>
			)}
		</fieldset>
	);
}
