const {readdirSync}=require('fs');
const {join}=require('path');
const {spawnSync}=require('child_process');
for(const name of readdirSync(__dirname).filter(name=>name.endsWith('.cjs')&&name!=='run.cjs').sort()){
 const result=spawnSync(process.execPath,[join(__dirname,name)],{stdio:'inherit',cwd:join(__dirname,'..')});
 if(result.status!==0)process.exit(result.status||1);
}
