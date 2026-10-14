const fs=require('fs'),assert=require('assert'),Module=require('module'),ts=require('typescript');
for(const ext of ['.ts','.tsx'])require.extensions[ext]=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,jsx:ts.JsxEmit.React,esModuleInterop:true}}).outputText,f);
require.extensions['.scss']=m=>m.exports={};
const {JSDOM}=require('jsdom'),dom=new JSDOM('<div id="test"></div>',{url:'http://localhost/'});for(const k of ['window','document','navigator','HTMLElement','Element','Node'])global[k]=dom.window[k];global.IS_REACT_ACT_ENVIRONMENT=true;
const React=require('react'),{createRoot}=require('react-dom/client'),{act}=require('react-dom/test-utils');
const moneyCalls=[];let mode='dashboard';const order={_id:'isolated-order',status:'SHIPPED',paymentStatus:'PAID',createdAt:new Date().toISOString(),deliveryId:'isolated-delivery',items:[{_id:'isolated-item',productId:'isolated-product',productName:'Isolated fixture',status:'SHIPPED',quantity:2,finalUnitPrice:10,finalItemPrice:20}]};
const originalLoad=Module._load;Module._load=function(name,...args){
 if(name==='next/link')return ({children,...props})=>React.createElement('a',{...props,href:'#'},children);
 if(name==='next/router')return {useRouter:()=>({query:{},replace:()=>{},push:()=>{}})};
 if(name==='next-i18next')return {useTranslation:()=>({t:(key,options)=>options?.defaultValue||key})};
 if(name.includes('useUiText'))return {__esModule:true,default:()=>x=>x};
 if(name.includes('hooks/useMarketplace'))return {useMarketplace:()=>({value:mode==='dashboard'?{productCount:7,salesCount:2,deliveredCount:1,followers:4,reviewCount:3,averageRating:4.8,revenue:12}:{list:[order],metaCounter:[{total:1}]},loading:false}),useAction:()=>async()=>{}};
 if(name.endsWith('common/Marketplace'))return {State:({children})=>React.createElement('div',null,children),Pager:()=>null,Photo:()=>null,money:n=>{moneyCalls.push(n);return '$'+n.toFixed(2)}};
 if(name.endsWith('common/Currency'))return {SettlementNote:()=>null};
 if(name.endsWith('../../auth'))return {};
 return originalLoad.call(this,name,...args);
};
(async()=>{
 const root=createRoot(document.getElementById('test'));const {Dashboard}=require('../libs/components/mypage/MarketplaceAccount');
 await act(async()=>root.render(React.createElement(Dashboard,{role:'SELLER'})));assert.deepEqual(moneyCalls,[12]);assert.equal(document.querySelectorAll('.seller-overview .stat').length,7);assert(document.body.textContent.includes('4.8 / 5'));console.log('PASS seller overview formats only revenue as currency and keeps rating/count units');
 mode='orders';const Orders=require('../libs/components/mypage/MarketplaceOrders').default;
 await act(async()=>root.render(React.createElement(Orders,{role:'SELLER'})));assert(!document.body.textContent.includes('Buy again'));assert(!document.body.textContent.includes('Delivery details'));assert(document.body.textContent.includes('Mark delivered'));console.log('PASS seller order excludes buyer-only actions and exposes the valid shipped → delivered action');
 await act(async()=>root.unmount());
})().catch(e=>{console.error(e);process.exit(1)});
