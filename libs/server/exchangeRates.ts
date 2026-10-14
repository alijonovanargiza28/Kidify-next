import { promises as fs } from 'fs';
import path from 'path';
import { tmpdir } from 'os';
import { Rates, Currency, freshRates, usableRates, parseCentralBankRates } from '../utils/currency';
/** Fixed public provider: no user-supplied URL, credentials, or browser cross-origin request. */
export const RATE_SOURCE = 'https://cbu.uz/uz/arkhiv-kursov-valyut/json/';
export function createRateLoader({fetcher=fetch,cacheFile=path.join(process.env.VERCEL ? tmpdir() : path.join(process.cwd(), '.cache'),'kidify-exchange-rates.json'),now=Date.now}: {fetcher?:typeof fetch;cacheFile?:string;now?:()=>number}={}) {
 let cached:Rates|null=null, pending:Promise<Rates>|null=null, nextAttempt=0;
 return async (base:Currency) => {
  if (!cached) { try { const saved=JSON.parse(await fs.readFile(cacheFile,'utf8'));if(usableRates(saved,now())&&saved.base===base)cached=saved; } catch {} }
  if (cached?.base!==base) cached=null;
  if (cached && freshRates(cached,now())) return { ...cached, stale:false };
  if (now()<nextAttempt) {if(usableRates(cached,now()))return {...cached,stale:true};throw new Error('RATES_UNAVAILABLE');}
  if (!pending) pending=(async()=>{
   const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),8000);
   try {
    const response=await fetcher(RATE_SOURCE,{signal:controller.signal,headers:{Accept:'application/json'}});
    if(!response.ok)throw new Error(`Provider HTTP ${response.status}`);
    const value=parseCentralBankRates(await response.json(),base,now());
    cached=value;
    try {await fs.mkdir(path.dirname(cacheFile),{recursive:true});const tmp=cacheFile+'.'+process.pid+'.tmp';await fs.writeFile(tmp,JSON.stringify(value));await fs.rename(tmp,cacheFile);}catch{console.warn('[currency] Disk cache unavailable; keeping memory cache.');}
    nextAttempt=0;return value;
   } catch(error:any) {nextAttempt=now()+60000;console.warn('[currency] Provider request failed:',error.name==='AbortError'?'timeout':error.message);throw error;}
   finally{clearTimeout(timer);}
  })().finally(()=>{pending=null;});
  try{return {...await pending,stale:false};}catch(error){if(usableRates(cached,now()))return {...cached,stale:true};throw error;}
 };
}
export const loadExchangeRates=createRateLoader();
