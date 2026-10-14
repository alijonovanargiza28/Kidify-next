const fs=require('fs'),assert=require('assert'),Module=require('module'),ts=require('typescript');
for(const ext of ['.ts','.tsx'])require.extensions[ext]=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.React,esModuleInterop:true}}).outputText,f);
require.extensions['.scss']=m=>m.exports={editor:'editor'};
const {JSDOM}=require('jsdom'),dom=new JSDOM('<div id="root"></div>');for(const k of ['window','document','navigator','HTMLElement','Node','Event'])global[k]=dom.window[k];global.IS_REACT_ACT_ENVIRONMENT=true;
const React=require('react'),{createRoot}=require('react-dom/client'),{act,Simulate}=require('react-dom/test-utils');
const en=JSON.parse(fs.readFileSync('public/locales/en/common.json','utf8'));
const load=Module._load;Module._load=function(n,...args){
 if(n==='next-i18next')return {useTranslation:()=>({t:k=>k.split('.').reduce((v,x)=>v?.[x],en)||k})};
 if(n.includes('useUiText'))return {__esModule:true,default:()=>x=>x};
 if(n.includes('useMarketplace'))return {useAction:()=>async()=>{throw Error('No backend writes expected')}};
 if(n==='./Marketplace')return {Photo:()=>null};
 if(n==='@mui/material')return {TextField:({label,select,value,onChange,type,id,inputProps,children,required})=>React.createElement(select?'select':'input',{...inputProps,id,type,required,value,onChange,'aria-label':label},select?children:undefined),MenuItem:({value,children})=>React.createElement('option',{value},children),Button:({children,onClick,type})=>React.createElement('button',{type,onClick},children),Checkbox:()=>null,FormControlLabel:()=>null,Alert:({children})=>React.createElement('div',{role:'alert'},children)};
 return load.call(this,n,...args);
};
const Form=require('../libs/components/common/MarketplaceForm').default,{backendEnums}=require('../libs/types/marketplace');
const initial={productName:'Age fixture',productPrice:10,productType:backendEnums.ProductType[0],productCategory:backendEnums.ProductCategory[0],productImages:['/img/fixture.png'],productVariants:[{color:'Pink',size:'standard',stock:3,sku:'fixture',ageMinMonths:24,ageMaxMonths:36,images:['/img/fixture.png']}]};
(async()=>{const root=createRoot(document.getElementById('root'));for(const type of ['ProductInput','ProductUpdate']){let saved;await act(async()=>root.render(React.createElement(Form,{key:type,type,initial,fields:Object.keys(initial),onSubmit:async data=>{saved=data}})));
const unit=document.querySelector('select[aria-label="Age unit"]');assert(unit);
await act(async()=>Simulate.change(unit,{target:{value:'years'}}));assert.equal(document.querySelector('input[aria-label="Age Min (Years)"]').value,'2');assert.equal(document.querySelector('input[aria-label="Age Max (Years)"]').value,'3');
await act(async()=>Simulate.change(document.querySelector('input[aria-label="Age Min (Years)"]'),{target:{value:'1'}}));
await act(async()=>Simulate.change(document.querySelector('input[aria-label="Age Max (Years)"]'),{target:{value:'4'}}));
await act(async()=>Simulate.change(unit,{target:{value:'months'}}));assert.equal(document.querySelector('input[aria-label="Age Min (Months)"]').value,'12');assert.equal(document.querySelector('input[aria-label="Age Max (Months)"]').value,'48');
await act(async()=>document.querySelector('form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));assert(saved,document.body.textContent);assert.equal(saved.productVariants[0].ageMinMonths,12);assert.equal(saved.productVariants[0].ageMaxMonths,48);assert(!('_ageUnit' in saved.productVariants[0]));assert.deepEqual(saved.productVariants[0].images,['/img/fixture.png']);}
await act(async()=>root.unmount());console.log('PASS Add/Edit age unit inputs, years→months conversion, switching units preserves values, UI unit excluded from payload, variant image association preserved; no database writes');})().catch(e=>{console.error(e);process.exit(1)});
