import React, { useState } from 'react';
import { Photo } from './Marketplace';
import { detailImages } from '../../utils/productDetailImages';

/** Product detail only: a broken color image falls back to the real original product photos. */
export default function ProductDetailPhoto({ src, originals, alt }: { src?: string; originals: string[]; alt: string }) {
 const [failed, setFailed] = useState<string[]>([]);
 const resolved = detailImages([src, ...originals]).find(url => !failed.includes(url));
 if (!resolved) return <Photo alt={alt} />;
 return <img src={resolved} alt={alt} onError={() => setFailed(previous => [...previous, resolved])} />;
}
