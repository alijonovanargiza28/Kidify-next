const fs=require('fs'),assert=require('assert'),ts=require('typescript'),Module=require('module');
for(const ext of ['.ts','.tsx'])require.extensions[ext]=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,jsx:ts.JsxEmit.React,esModuleInterop:true}}).outputText,f);
require.extensions['.css']=m=>m.exports={};require.extensions['.scss']=m=>m.exports={};
const {JSDOM}=require('jsdom'),dom=new JSDOM('<div id="test"></div>',{url:'http://localhost/'});for(const k of ['window','document','navigator','HTMLElement','Element','Node'])global[k]=dom.window[k];global.IS_REACT_ACT_ENVIRONMENT=true;
const React=require('react'),{createRoot}=require('react-dom/client'),{act}=require('react-dom/test-utils'),{ApolloClient,ApolloProvider,InMemoryCache,ApolloLink,Observable,gql,useQuery}=require('@apollo/client');
const query=gql`query FixtureSellerOrders { getSellerOrders { list { _id status paymentStatus createdAt items { _id productId sellerId productName productImage variantId color size quantity unitPrice discount finalUnitPrice finalItemPrice status } } } }`;
let status='CONFIRMED',finish,rejectNext=false,refetches=0;const requests=[],alerts=[];
const item={__typename:'OrderItem',_id:'item',productId:'product',sellerId:'seller',productName:'Fixture',productImage:null,variantId:'variant',color:'Pink',size:'3M',quantity:1,unitPrice:10,discount:0,finalUnitPrice:10,finalItemPrice:10,status};
const order={__typename:'Order',_id:'order',status,paymentStatus:'PAID',createdAt:new Date().toISOString(),items:[item]};
const cache=new InMemoryCache();cache.writeQuery({query,data:{getSellerOrders:{__typename:'Orders',list:[order]}}});
const client=new ApolloClient({cache,link:new ApolloLink(operation=>new Observable(observer=>{requests.push(operation);finish=()=>{if(rejectNext){rejectNext=false;observer.error(Error('temporary failure'));return;}status=operation.variables.status;observer.next({data:{updateSellerOrderItemStatus:{...order,status,items:[{...item,status}]}}});observer.complete()}}))});
client.refetchQueries=()=>{refetches++;return Promise.resolve([])};
const load=Module._load;let realHooks;
Module._load=function(name,...args){
 if(name==='next/router')return {useRouter:()=>({query:{orderId:'order'},push:()=>assert.fail('No route navigation'),replace:()=>assert.fail('No route navigation')})};
 if(name==='next/link')return ({children})=>React.createElement('a',null,children);
 if(name.includes('useUiText'))return {__esModule:true,default:()=>x=>x};
 if(name==='../../hooks/useMarketplace')return {useAction:()=>realHooks.useAction(),useMarketplace:name=>{if(name==='getSellerOrders'){const q=useQuery(query,{fetchPolicy:'cache-only'});return {...q,value:q.data?.getSellerOrders}}return {}}};
 if(name.endsWith('sweetAlert'))return {sweetErrorAlert:async e=>alerts.push(e)};
 if(name==='../common/Marketplace')return {State:({query,children})=>query.loading&&!query.value?React.createElement('p',null,'Loading'):children,Photo:()=>null,Pager:()=>null,money:n=>'$'+n};
 if(name==='../common/MarketplaceForm')return {__esModule:true,default:()=>null};
 if(name==='../common/Currency')return {SettlementNote:()=>null};
 if(name==='@mui/material')return {Button:({children,onClick,disabled,type})=>React.createElement('button',{onClick,disabled,type},children),TextField:({children})=>React.createElement('div',null,children),MenuItem:({children})=>React.createElement('span',null,children),Dialog:()=>null,DialogTitle:()=>null,DialogContent:()=>null,DialogActions:()=>null};
 return load.call(this,name,...args);
};
realHooks=require('../libs/hooks/useMarketplace');
(async()=>{const Orders=require('../libs/components/mypage/MarketplaceOrders').default,root=createRoot(document.getElementById('test'));await act(async()=>root.render(React.createElement(ApolloProvider,{client},React.createElement(Orders,{role:'SELLER'}))));const card=document.querySelector('.reference-order');const button=label=>[...document.querySelectorAll('button')].find(b=>b.textContent===label);
rejectNext=true;await act(async()=>button('Start preparing').click());await act(async()=>finish());assert.equal(alerts.length,1);assert(!button('Start preparing').disabled);assert.strictEqual(document.querySelector('.reference-order'),card);assert.equal(cache.readQuery({query}).getSellerOrders.list[0].items[0].status,'CONFIRMED');
for(const [label,next] of [['Start preparing','PREPARING'],['Ready for delivery','READY_FOR_DELIVERY'],['Mark shipped','SHIPPED'],['Mark delivered','DELIVERED']]){
 const before=requests.length;await act(async()=>{button(label).click();button(label).click()});assert.equal(requests.length,before+1);assert.equal(requests[before].variables.status,next);assert(button(label).disabled);assert.strictEqual(document.querySelector('.reference-order'),card);
 await act(async()=>finish());assert.strictEqual(document.querySelector('.reference-order'),card,'order card must not remount');assert.equal(cache.readQuery({query}).getSellerOrders.list[0].items[0].status,next);assert.equal(refetches,0);
}
assert(!button('Mark delivered'));await act(async()=>root.unmount());console.log('PASS seller fulfillment with real Apollo: all four transitions update cached order without refetch/navigation/remount, duplicate clicks locked and detail remains visible');})().catch(e=>{console.error(e);process.exit(1)});
