export const ENDPOINT='https://mcp.sharprod.com/public';
export const VERSION='0.1.0';
const actions=Object.freeze({list:null,brief:{name:'get_brief_requirements',arguments:{locale:'en'}},deliverables:{name:'get_deliverables',arguments:{serviceId:'service.ai-video',locale:'en'}},methods:{name:'compare_production_methods',arguments:{methods:['ai','cgi'],locale:'en'}}});
const meta={'io.modelcontextprotocol/protocolVersion':'2026-07-28','io.modelcontextprotocol/clientInfo':{name:'shar-public-mcp-examples',version:VERSION},'io.modelcontextprotocol/clientCapabilities':{}};
export function createClient({fetchImpl=globalThis.fetch,timeoutMs=10000}={}){
 if(!Number.isInteger(timeoutMs)||timeoutMs<1||timeoutMs>30000)throw Error('timeout must be 1–30000 ms');
 return {async run(action){
  if(!Object.hasOwn(actions,action))throw Error('Action is outside the read-only allowlist');
  const selected=actions[action],method=selected?'tools/call':'tools/list';
  const params=selected?{...selected,_meta:meta}:{_meta:meta};
  const headers={accept:'application/json, text/event-stream','content-type':'application/json','mcp-protocol-version':'2026-07-28','mcp-method':method};
  if(selected)headers['mcp-name']=selected.name;
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(Error('MCP request timeout')),timeoutMs);
  try{
   const response=await fetchImpl(ENDPOINT,{method:'POST',redirect:'error',headers,body:JSON.stringify({jsonrpc:'2.0',id:1,method,params}),signal:controller.signal});
   if(!response.ok)throw Error(`MCP HTTP ${response.status}`);
   if(!/^application\/json(?:;|$)/i.test(response.headers.get('content-type')||''))throw Error('Unsupported response media type; this bounded example requires JSON, not SSE');
   if(!response.body)throw Error('Missing response body');
   const reader=response.body.getReader(),chunks=[];let size=0;
   while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>2097152){await reader.cancel();throw Error('Response exceeds 2 MiB limit')}chunks.push(value)}
   const buffer=new Uint8Array(size);let offset=0;for(const part of chunks){buffer.set(part,offset);offset+=part.length}
   let envelope;try{envelope=JSON.parse(new TextDecoder().decode(buffer))}catch{throw Error('Malformed JSON response')}
   if(!envelope||envelope.jsonrpc!=='2.0'||envelope.id!==1||envelope.error||!envelope.result||typeof envelope.result!=='object'||Array.isArray(envelope.result))throw Error('Malformed or error JSON-RPC envelope');
   const result=envelope.result;
   if(action==='list'){if(!Array.isArray(result.tools)||result.tools.some(t=>!t||typeof t.name!=='string'||t.annotations?.readOnlyHint!==true))throw Error('Tool discovery failed the read-only contract')}
   else if(result.isError===true||result.structuredContent?.ok!==true)throw Error('Tool failed the public structured result contract');
   return result;
  }finally{clearTimeout(timer)}
 }};
}
