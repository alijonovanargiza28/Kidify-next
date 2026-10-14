const fs=require('fs'),assert=require('assert'),ts=require('typescript'),Module=require('module');
for(const ext of ['.ts','.tsx'])require.extensions[ext]=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,jsx:ts.JsxEmit.React,esModuleInterop:true}}).outputText,f);
require.extensions['.scss']=m=>m.exports={};
const {JSDOM}=require('jsdom'),dom=new JSDOM('<div id="pc-wrap" class="kidify"><div id="test"></div></div>',{url:'http://localhost/'});for(const k of ['window','document','navigator','HTMLElement','Element','Node','Event'])global[k]=dom.window[k];global.IS_REACT_ACT_ENVIRONMENT=true;
const React=require('react'),{createRoot}=require('react-dom/client'),{act,Simulate}=require('react-dom/test-utils');
const order={_id:'order',status:'DELIVERED',paymentStatus:'PAID',createdAt:new Date().toISOString(),items:[{_id:'item',productId:'product',sellerId:'seller',productName:'Fixture',quantity:1,finalUnitPrice:10,finalItemPrice:10,status:'DELIVERED'}]};
const calls=[],routes=[];let failReview=false,failBuy=false,finishBuy;
const action=async(name,variables)=>{calls.push({name,variables});if(name==='createReview'){if(failReview)throw Error('ALREADY_REVIEWED');return {}}if(name==='buyAgain'){if(failBuy)throw Error('ITEM_UNAVAILABLE');await new Promise(resolve=>finishBuy=resolve);return {items:[]}}};
const load=Module._load;Module._load=function(name,...args){
 if(name==='next/router')return {useRouter:()=>({query:{},push:async path=>routes.push(path)})};
 if(name==='next/link')return ({children})=>React.createElement('a',null,children);
 if(name==='next-i18next')return {useTranslation:()=>({t:x=>x})};
 if(name.includes('useUiText'))return {__esModule:true,default:()=>x=>x};
 if(name.includes('hooks/useMarketplace'))return {useMarketplace:()=>({value:{list:[order]}}),useAction:()=>action};
 if(name.endsWith('common/Marketplace')||name==='./Marketplace')return {State:({children})=>children,Pager:()=>null,Photo:()=>null,money:n=>'$'+n};
 if(name.endsWith('common/Currency'))return {SettlementNote:()=>null};
 if(name==='@mui/material')return {
  Button:({children,onClick,disabled,type})=>React.createElement('button',{onClick,disabled,type:type||'button'},children),
  TextField:({label,value,onChange,type,multiline,select,children,required,inputProps,id,disabled})=>React.createElement(select?'select':multiline?'textarea':'input',{...inputProps,id,'aria-label':label,value,onChange,type,required,disabled},select?children:undefined),
  MenuItem:({value,children})=>React.createElement('option',{value},children),
  Dialog:({open,children})=>open?React.createElement('section',{role:'dialog'},children):null,
  DialogTitle:({children,id})=>React.createElement('h2',{id},children),DialogContent:({children})=>React.createElement('div',null,children),DialogActions:({children})=>React.createElement('footer',null,children),Alert:({children})=>React.createElement('div',{role:'alert'},children),Checkbox:()=>null,FormControlLabel:()=>null,
 };
 return load.call(this,name,...args);
};
(async()=>{const Orders=require('../libs/components/mypage/MarketplaceOrders').default,root=createRoot(document.getElementById('test'));
await act(async()=>root.render(React.createElement(Orders)));
const button=label=>[...document.querySelectorAll('button')].find(b=>b.textContent===label);
const fillText=async text=>act(async()=>Simulate.change(document.querySelector('textarea'),{target:{value:text}}));
const submit=async()=>act(async()=>document.querySelector('form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
for(const [label,group,targetId] of [['Review product','PRODUCT','product'],['Review seller','SELLER','seller']]){
 await act(async()=>button(label).click());assert(document.querySelector('[role="dialog"]'),'review must open an immediately visible dialog');assert.equal(document.getElementById('order-review-title').textContent,label);
 assert.equal(document.querySelectorAll('.review-star-options input:checked').length,0);await act(async()=>Simulate.change(document.querySelector('.review-star-options input[value="3"]')));assert.equal(document.querySelectorAll('.review-star-options svg.filled').length,3);await fillText('Great purchase');await submit();
 const call=calls[calls.length-1];assert.equal(call.name,'createReview');assert.deepEqual(call.variables.input,{images:[],rating:3,text:'Great purchase',orderId:'order',group,targetId});assert(!document.querySelector('[role="dialog"]'));
}
failReview=true;await act(async()=>button('Review product').click());await act(async()=>Simulate.change(document.querySelector('.review-star-options input[value="4"]')));await fillText('A second review');await submit();assert(document.querySelector('[role="dialog"]'));assert.equal(document.querySelector('[role="alert"]').textContent,'ALREADY_REVIEWED');await act(async()=>button('Close review').click());assert(!document.querySelector('[role="dialog"]'));
await act(async()=>{button('Buy again').click();button('Buy again').click()});assert.equal(calls.filter(c=>c.name==='buyAgain').length,1);assert.equal(routes.length,0);assert(button('Buy again').disabled);
await act(async()=>finishBuy());assert.deepEqual(routes,['/cart']);assert(!button('Buy again').disabled);
failBuy=true;await act(async()=>button('Buy again').click());assert.deepEqual(routes,['/cart'],'failed add must not navigate');assert(!button('Buy again').disabled);
await act(async()=>root.unmount());console.log('PASS order review actions: real form opens in dialog, product/seller target and order payloads, empty stars and 3-star selection, failed review stays visible; Buy again waits for success, navigates to cart, prevents duplicate clicks and recovers after failure');
})().catch(e=>{console.error(e);process.exit(1)});
