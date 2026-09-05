import {mkdir,writeFile} from 'node:fs/promises';
import {createClient,ENDPOINT,VERSION} from './client.mjs';
const receipt={checkedAt:new Date().toISOString(),endpoint:ENDPOINT,version:VERSION,requestLimit:4,checks:[]};
const client=createClient();
for(const action of ['list','brief','deliverables','methods']){try{const result=await client.run(action);receipt.checks.push({action,ok:true,...(action==='list'?{tools:result.tools.map(t=>({name:t.name,readOnly:t.annotations.readOnlyHint}))}:{isError:result.isError===true,lineage:result.structuredContent.lineage||null,contractKeys:Object.keys(result.structuredContent.data||{})})})}catch(error){receipt.checks.push({action,ok:false,error:error.message});process.exitCode=1}}
await mkdir(new URL('evidence/',import.meta.url),{recursive:true});await writeFile(new URL('evidence/live-receipt.json',import.meta.url),JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt,null,2));
