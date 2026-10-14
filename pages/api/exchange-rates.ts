import type { NextApiRequest, NextApiResponse } from 'next';
import { canonicalCurrency, isCurrency } from '../../libs/utils/currency';
import { loadExchangeRates } from '../../libs/server/exchangeRates';
export default async function handler(req:NextApiRequest,res:NextApiResponse) {
 if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).end();}
 const base=process.env.KIDIFY_CANONICAL_CURRENCY || canonicalCurrency;
 if(!isCurrency(base)){res.setHeader('Cache-Control','no-store');return res.status(503).json({error:'CURRENCY_NOT_CONFIGURED'});}
 try {
  const rates=await loadExchangeRates(base);
  res.setHeader('Cache-Control',rates.stale?'no-cache':'public, max-age=300');
  return res.status(200).json({...rates,source:'Central Bank of Uzbekistan'});
 }catch{res.setHeader('Cache-Control','no-store');return res.status(503).json({error:'RATES_UNAVAILABLE',base});}
}
