const fs=require('fs'),assert=require('assert'),ts=require('typescript'),Module=require('module');
for(const ext of ['.ts','.tsx'])require.extensions[ext]=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,jsx:ts.JsxEmit.React,esModuleInterop:true}}).outputText,f);
const {JSDOM}=require('jsdom'),dom=new JSDOM('<div id="test"></div>',{url:'http://localhost/'});for(const k of ['window','document','navigator','HTMLElement','Element','Node'])global[k]=dom.window[k];global.IS_REACT_ACT_ENVIRONMENT=true;
const React=require('react'),{createRoot}=require('react-dom/client'),{act}=require('react-dom/test-utils');let role='USER',approved=false;const calls=[];
const load=Module._load;Module._load=function(name,...args){
 if(name==='@apollo/client')return {useReactiveVar:()=>({_id:'viewer',memberType:role})};
 if(name.endsWith('apollo/store'))return {userVar:{}};
 if(name.includes('useUiText'))return {__esModule:true,default:()=>x=>x};
 if(name.includes('useMarketplace'))return {useAction:()=>async(name,input)=>calls.push({name,input})};
 if(name==='./Marketplace')return {Photo:()=>null};
 if(name.endsWith('sweetAlert'))return {sweetConfirmAlert:async()=>approved};
 if(name==='@mui/material')return {Button:({children,disabled,onClick})=>React.createElement('button',{disabled,onClick},children)};
 return load.call(this,name,...args);
};
(async()=>{const Card=require('../libs/components/common/ReviewCard').default,root=createRoot(document.getElementById('test'));const render=async group=>act(async()=>root.render(React.createElement(Card,{review:{_id:'review-'+group,group,rating:5,text:'Fixture',createdAt:new Date().toISOString()}})));const remove=()=>[...document.querySelectorAll('button')].find(b=>b.textContent==='Delete');
for(const group of ['PRODUCT','SELLER']){
 for(role of ['USER','SELLER','CS']){await render(group);assert(!remove(),role+' must not see review deletion')}
 role='ADMIN';await render(group);assert(remove());const before=calls.length;approved=false;await act(async()=>remove().click());assert.equal(calls.length,before);
 approved=true;await act(async()=>remove().click());assert.deepEqual(calls[calls.length-1],{name:'removeReviewByAdmin',input:{reviewId:'review-'+group}});
}
await act(async()=>root.unmount());console.log('PASS product/seller review deletion: ADMIN-only button, confirmation cancellation sends nothing, confirmed deletion calls the existing admin mutation');})().catch(e=>{console.error(e);process.exit(1)});
