const fs=require('fs'),assert=require('assert'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,f);
const {configuredAgeOptions,colorImages}=require('../libs/utils/productVariants');
const variants=[{_id:'a',color:'Pink',ageMinMonths:4,ageMaxMonths:8,stock:3,images:['pink.png']},{_id:'b',color:'Pink',ageMinMonths:17,ageMaxMonths:17,stock:0,images:['pink.png']},{_id:'c',color:'Blue',size:'2Y',stock:2,images:['blue.png']}];
const pink=configuredAgeOptions(variants,'Pink');assert.equal(pink.length,2);assert.equal(pink[0].label,'4–8 months');assert.equal(pink[0].month,4);assert.equal(pink[1].label,'17 months');assert.equal(pink[1].variant.stock,0);assert.equal(configuredAgeOptions(variants,'Blue')[0].month,24);assert.deepEqual(colorImages({productVariants:variants},'Blue'),['blue.png']);assert.deepEqual(colorImages({productVariants:variants},'Yellow'),[]);
console.log('PASS actual nonstandard ranges, individual months, years, sold-out options and exact color images; isolated fixtures, no database writes');
