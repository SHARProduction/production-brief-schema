import {createClient,ENDPOINT,VERSION} from './client.mjs';
const action=process.argv[2]||'list';
try{const result=await createClient().run(action);console.log(JSON.stringify({endpoint:ENDPOINT,version:VERSION,action,...(action==='list'?{tools:result.tools.map(t=>({name:t.name,readOnly:t.annotations.readOnlyHint}))}:{ok:result.structuredContent.ok,lineage:result.structuredContent.lineage||null,data:result.structuredContent.data})},null,2))}catch(error){console.error(error.message);process.exitCode=1}
