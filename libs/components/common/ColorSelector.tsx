import React, { useId } from 'react';
import { productColors } from '../../utils/productForm';
export function colorPaint(color: string) {
	const known: Record<string, string> = {
		oatmeal: '#d8c7b5',
		rose: '#c97888',
		sage: '#9faf90',
		cream: '#f5efeb',
		'dusty pink': '#c97888',
		'soft cream': '#f5efeb',
		'oatmeal beige': '#d8c7b5',
		charcoal: '#3d3a3a',
		'powder blue': '#b6ccd8',
		'warm brown': '#8a6753',
		'sage green': '#9faf90',
		'soft butter yellow': '#efe5b8',
	};
	return (
		productColors.find((c) => c.name.toLowerCase() === color.toLowerCase())?.hex ||
		known[color.toLowerCase()] ||
		(/^#[\da-f]{6}$/i.test(color) ? color : '#d7c1c4')
	);
}
export default function ColorSelector({
	colors,
	value,
	onChange,
	disabledColors = [],
	label = 'Color',
}: {
	colors: string[];
	value: string;
	onChange: (color: string) => void;
	disabledColors?: string[];
	label?: string;
}) {
	const id = useId();
	return (
		<div className="variant-colors" role="group" aria-labelledby={id}>
			<span id={id}>
				{label}: <strong>{value || 'Standard'}</strong>
			</span>
			<div className="color-swatches">
				{colors.map((color) => (
					<button
						type="button"
						key={color}
						className="color-swatch"
						aria-label={`${label} ${color || 'Standard'}`}
						title={color || 'Standard'}
						style={{ backgroundColor: colorPaint(color) }}
						disabled={disabledColors.includes(color)}
						aria-pressed={value === color}
						onClick={() => onChange(color)}
					/>
				))}
			</div>
		</div>
	);
}
