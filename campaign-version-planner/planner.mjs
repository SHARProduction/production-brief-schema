/** Campaign version planner 0.1.0. MIT. No I/O, mutation, storage, or network. */
const MAX=1000;
const text={en:{type:'Unexpected value type.',required:'Required field is missing.',unknown:'Unknown field; remove it.',empty:'At least one item is required.',limit:'Input exceeds the documented size limit.',duration:'Duration must be an integer from 1 to 3600 seconds.',id:'Use a lowercase channel ID with letters, digits and single hyphen separators.',label:'Use a nonblank label without controls, angle brackets or spreadsheet formula prefixes.',ratio:'Use a positive aspect ratio such as 16:9, with each side from 1 to 99.',locale:'Use a language tag such as ru, en or en-US.',duplicate:'Duplicate normalized value removed or channel formats merged.',conflict:'Repeated channel ID has conflicting labels.',combinations:'Plan exceeds 1000 versions; reduce durations, languages or channel formats.'},ru:{type:'Неверный тип значения.',required:'Обязательное поле отсутствует.',unknown:'Неизвестное поле; удалите его.',empty:'Нужен хотя бы один элемент.',limit:'Превышен указанный предел размера ввода.',duration:'Длительность — целое число от 1 до 3600 секунд.',id:'ID канала: строчные латинские буквы, цифры и одиночные дефисы между частями.',label:'Нужна непустая подпись без управляющих символов, угловых скобок и префиксов формул.',ratio:'Укажите положительное соотношение сторон, например 16:9; каждая сторона от 1 до 99.',locale:'Используйте языковой тег, например ru, en или en-US.',duplicate:'Повтор нормализованного значения удалён или форматы канала объединены.',conflict:'У повторяющегося ID канала разные подписи.',combinations:'План превышает 1000 версий; сократите длительности, языки или форматы каналов.'}};
const own=(v,k)=>Object.hasOwn(v,k);
const object=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const safeLabel=v=>typeof v==='string'&&v.trim().length>0&&[...v].length<=80&&!/[\u0000-\u001f\u007f<>]/u.test(v)&&! /^[=+@-]/u.test(v.trimStart());
const escapePointer=v=>v.replace(/~/g,'~0').replace(/\//g,'~1');
/** Input is parsed JSON. IDs are stable across input order and duplicate removal. */
export function planCampaign(input,{language='en'}={}){
 const errors=[],warnings=[],dictionary=text[language]||text.en;
 const issue=(path,code)=>errors.push({path,code,message:dictionary[code]});
 const warning=path=>warnings.push({path,code:'duplicate',message:dictionary.duplicate});
 const fail=()=>({valid:false,errors,warnings,versions:[],total:0});
 const fields=(v,allowed,required,path)=>{if(!object(v)){issue(path,'type');return false;}for(const k of required)if(!own(v,k))issue(path+'/'+k,'required');for(const k of Object.keys(v))if(!allowed.includes(k))issue(path+'/'+escapePointer(k),'unknown');return true;};
 const array=(v,path,max)=>{if(!Array.isArray(v)){issue(path,'type');return false;}if(!v.length){issue(path,'empty');return false;}if(v.length>max){issue(path,'limit');return false;}return true;};
 if(!fields(input,['durations','channels','locales'],['durations','channels','locales'],''))return fail();
 const durations=new Set(),locales=new Set(),channels=new Map();
 if(array(input.durations,'/durations',100))input.durations.forEach((v,i)=>{const path='/durations/'+i;if(typeof v!=='number'||!Number.isInteger(v)||v<1||v>3600)issue(path,'duration');else if(durations.has(v))warning(path);else durations.add(v);});
 if(array(input.locales,'/locales',100))input.locales.forEach((v,i)=>{const path='/locales/'+i;if(typeof v!=='string'||v.length>35||! /^[A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,8}){0,3}$/.test(v))issue(path,'locale');else{const normalized=v.toLowerCase();if(locales.has(normalized))warning(path);else locales.add(normalized);}});
 if(array(input.channels,'/channels',100))input.channels.forEach((v,i)=>{
  const path='/channels/'+i;if(!fields(v,['id','label','aspectRatios'],['id','aspectRatios'],path))return;
  if(typeof v.id!=='string'||v.id.length>40||! /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v.id)){issue(path+'/id','id');return;}
  const label=own(v,'label')?v.label:v.id;
  if(!safeLabel(label)){issue(path+'/label','label');return;}
  if(!array(v.aspectRatios,path+'/aspectRatios',20))return;
  const existing=channels.get(v.id);
  if(existing&&existing.label!==label){issue(path+'/label','conflict');return;}
  if(existing)warning(path);
  const channel=existing||{label,ratios:new Set()};
  v.aspectRatios.forEach((ratio,j)=>{const at=path+'/aspectRatios/'+j;if(typeof ratio!=='string'||! /^[1-9][0-9]?:[1-9][0-9]?$/.test(ratio))issue(at,'ratio');else if(channel.ratios.has(ratio))warning(at);else channel.ratios.add(ratio);});
  channels.set(v.id,channel);
 });
 if(errors.length)return fail();
 const formats=[...channels.values()].reduce((n,c)=>n+c.ratios.size,0);
 if(formats*durations.size*locales.size>MAX){issue('','combinations');return fail();}
 const versions=[];
 for(const channelId of [...channels.keys()].sort()){
  const channel=channels.get(channelId);
  for(const aspectRatio of [...channel.ratios].sort())for(const locale of [...locales].sort())for(const durationSeconds of [...durations].sort((a,b)=>a-b))versions.push({id:`v1__${channelId}__${aspectRatio.replace(':','x')}__${locale}__${durationSeconds}s`,channelId,channelLabel:channel.label,aspectRatio,locale,durationSeconds});
 }
 return {valid:true,errors,warnings,versions,total:versions.length};
}
const columns=['id','channelId','channelLabel','aspectRatio','locale','durationSeconds'];
/** CSV contains a header and CRLF records. Reject unsafe rows even when called separately. */
export function versionsToCsv(versions){
 if(!Array.isArray(versions)||versions.length>MAX)throw new TypeError('Expected at most 1000 version rows.');
 const quote=value=>{const s=String(value);return /[",\r\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;};
 const rows=versions.map(row=>{
  if(!object(row)||Object.keys(row).length!==columns.length||columns.some(k=>!own(row,k)))throw new TypeError('Unexpected version row fields.');
  for(const k of columns.slice(0,-1)){const v=row[k];if(typeof v!=='string'||!v.length||v.length>256||/[\u0000-\u001f\u007f]/u.test(v)||/^[=+@-]/u.test(v.trimStart()))throw new TypeError('Unsafe CSV cell.');}
  if(!Number.isInteger(row.durationSeconds)||row.durationSeconds<1||row.durationSeconds>3600)throw new TypeError('Invalid duration.');
  return columns.map(k=>quote(row[k])).join(',');
 });
 return [columns.join(','),...rows].join('\r\n')+'\r\n';
}
export function planToJson(result){return JSON.stringify(result,null,2)+'\n';}
