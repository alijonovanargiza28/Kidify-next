import useDebouncedRange from '../../hooks/useDebouncedRange';
import useUiText from '../../hooks/useUiText';
import React, { useEffect, useState } from 'react';
import { Slider, Button } from '@mui/material';
import { useMarketplace } from '../../hooks/useMarketplace';
export default function PriceRangeFilter({ search, from, to, onCommit, onClear }: any) {
 const uiText = useUiText();
 const commitRange = useDebouncedRange(onCommit, from, to);


 const low = useMarketplace('getProducts', { input: { page: 1, limit: 1, sort: 'PRICE_LOW_TO_HIGH', search: {} } });
 const high = useMarketplace('getProducts', { input: { page: 1, limit: 1, sort: 'PRICE_HIGH_TO_LOW', search: {} } });
 const minimum = Number(low.value?.list?.[0]?.finalPrice ?? 0);
 const maximum = Number(high.value?.list?.[0]?.finalPrice ?? minimum);
 const [range, setRange] = useState([from ?? minimum, to ?? maximum]);
 useEffect(() => setRange([from ?? minimum, to ?? maximum]), [from, to, minimum, maximum]);
 const ready = !!low.value?.list?.length && !!high.value?.list?.length;
 const commit = (v: number[]) => { if (v[0] !== (from ?? minimum) || v[1] !== (to ?? maximum)) commitRange(v); };
 return <fieldset className="filter-group age-range-filter"><legend>{uiText("Price")}</legend>
  <Slider min={Math.min(minimum, range[0])} max={Math.max(maximum, range[1], minimum + 0.01)} step={0.01} value={range} disableSwap disabled={!ready || minimum === maximum}
   getAriaLabel={i => i === 0 ? 'Minimum price' : 'Maximum price'} onChange={(_, v) => setRange(v as number[])} onChangeCommitted={(_, v) => commit(v as number[])} />
  <div className="age-range-values">{['Min price', 'Max price'].map((label, i) => <label key={label}>{label}<input type="number" aria-label={label} min={0} step="0.01" value={range[i]} disabled={!ready} onChange={e => { const n = Number(e.target.value); if (Number.isFinite(n) && n >= 0) setRange(old => old.map((v,j) => j === i ? n : v)); }} onBlur={() => commit(range)} onKeyDown={e => { if(e.key === 'Enter') e.currentTarget.blur(); }} /></label>)}</div>
  {(from != null || to != null) && <Button size="small" onClick={onClear}>{uiText("All prices")}</Button>}
 </fieldset>;
}
