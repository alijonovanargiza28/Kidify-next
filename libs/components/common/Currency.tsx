import React, { createContext, useContext, useEffect, useState } from 'react';
import { Select, MenuItem, Tooltip } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { currencies, Currency, Rates, isCurrency, usableRates, freshRates, formatCurrency, displayPrice, canonicalCurrency } from '../../utils/currency';
const RATE_KEY='kidify.exchangeRates.v1';
const Context=createContext<{currency:Currency;setCurrency:(c:Currency)=>void;rates:Rates|null;error:boolean}>({currency:'USD',setCurrency:()=>{},rates:null,error:false});
let inFlight:Promise<Rates>|null=null;
function requestRates() {
 if (!inFlight) inFlight=(async()=>{
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),10000);
  try {
   const response=await fetch('/api/exchange-rates',{signal:controller.signal});
   if(!response.ok)throw new Error('RATES_UNAVAILABLE');
   const value=await response.json();
   if(!usableRates(value)||value.base!==canonicalCurrency)throw new Error('INVALID_RATES');
   return value as Rates;
  }finally{clearTimeout(timer);}
 })().finally(()=>{inFlight=null;});
 return inFlight;
}
export function CurrencyProvider({children}:{children:React.ReactNode}) {
 const [currency,setValue]=useState<Currency>('USD'),[rates,setRates]=useState<Rates|null>(null),[error,setError]=useState(false);
 useEffect(()=>{
  try {
   const preference=localStorage.getItem('kidify.currency');if(isCurrency(preference))setValue(preference);
   const saved=JSON.parse(localStorage.getItem(RATE_KEY)||'null');if(usableRates(saved)&&saved.base===canonicalCurrency)setRates(saved);
  }catch{}
  let active=true;
  const load=async()=>{
   try{const value=await requestRates();if(active){setRates(value);setError(!freshRates(value));try{localStorage.setItem(RATE_KEY,JSON.stringify(value));}catch{}}}
   catch{if(active){setError(true);setRates(old=>usableRates(old)?old:null);}}
  };
  void load();const timer=setInterval(load,3600000);
  const online=()=>void load();
  const storage=(event:StorageEvent)=>{if(event.key==='kidify.currency'&&isCurrency(event.newValue))setValue(event.newValue);};
  window.addEventListener('online',online);window.addEventListener('storage',storage);
  return()=>{active=false;clearInterval(timer);window.removeEventListener('online',online);window.removeEventListener('storage',storage);};
 },[]);
 const setCurrency=(value:Currency)=>{if(!isCurrency(value))return;setValue(value);try{localStorage.setItem('kidify.currency',value);}catch{}};
 return <Context.Provider value={{currency,setCurrency,rates:usableRates(rates)?rates:null,error}}>{children}</Context.Provider>;
}
export function CurrencySelector() {
 const {currency,setCurrency,rates,error}=useContext(Context);const {t}=useTranslation('common');
 const [menuOpen,setMenuOpen]=useState(false);
 const status=error?(rates?t('currency.cached',{date:rates.asOf}):t('currency.unavailable',{currency:canonicalCurrency})):rates?`${t('currency.estimate')} · CBU ${rates.asOf}`:t('currency.loading');
 return <Tooltip title={menuOpen ? '' : status} disableInteractive placement="left"><Select onOpen={()=>setMenuOpen(true)} onClose={()=>setMenuOpen(false)} size="small" value={currency} onChange={e=>setCurrency(e.target.value as Currency)} inputProps={{'aria-label':t('currency.label')}} sx={{minWidth:86,fontSize:12}}>
  {currencies.map(c=><MenuItem key={c} value={c}>{c} {{USD:'$',KRW:'₩',UZS:"so'm"}[c]}</MenuItem>)}
 </Select></Tooltip>;
}
export function Money({amount}:{amount:number}) {
 const {currency,rates,error}=useContext(Context);const {locale}=useRouter();const {t}=useTranslation('common');
 const price=displayPrice(amount,currency,rates);
 const title=!rates&&currency!==canonicalCurrency?t('currency.unavailable',{currency:canonicalCurrency}):rates&&error?t('currency.cached',{date:rates.asOf}):currency!==canonicalCurrency?`${t('currency.estimate')} · ${formatCurrency(amount,canonicalCurrency,locale)} · CBU ${rates?.asOf}`:undefined;
 return <span title={title} data-currency={price.currency}>{formatCurrency(price.amount,price.currency,locale)}</span>;
}
export function SettlementNote(){const {t}=useTranslation('common');return <p><small>{t('currency.settlement',{currency:canonicalCurrency})}</small></p>;}
