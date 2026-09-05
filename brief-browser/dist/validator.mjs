import {schema} from './schema.mjs';
const messages={en:{required:'Required field is missing.',type:'Unexpected value type.',minLength:'Text is too short.',maxLength:'Text is too long.',pattern:'Value does not match the required format or contains only whitespace.',minItems:'Add at least one item.',maxItems:'Too many items.',enum:'Choose an allowed value.',additionalProperties:'Unknown field; remove it.',format:'Enter a real YYYY-MM-DD date or an absolute HTTP(S) URL without credentials.'},ru:{required:'Обязательное поле отсутствует.',type:'Неверный тип значения.',minLength:'Текст слишком короткий.',maxLength:'Текст слишком длинный.',pattern:'Неверный формат или текст состоит только из пробелов.',minItems:'Добавьте хотя бы один элемент.',maxItems:'Слишком много элементов.',enum:'Выберите допустимое значение.',additionalProperties:'Неизвестное поле; удалите его.',format:'Укажите существующую дату ГГГГ-ММ-ДД или полный HTTP(S) URL без логина и пароля.'}};
function dateValid(v){if(!/^\d{4}-\d{2}-\d{2}$/.test(v))return false;const [y,m,d]=v.split('-').map(Number);const leap=y%4===0&&(y%100!==0||y%400===0);return y>=1&&m>=1&&m<=12&&d>=1&&d<=[31,leap?29:28,31,30,31,30,31,31,30,31,30,31][m-1];}
function webUrl(v){try{const u=new URL(v);return /^https?:\/\//.test(v)&&['http:','https:'].includes(u.protocol)&&!u.username&&!u.password&&!/\s/.test(v);}catch{return false;}}
/** Validates JSON-compatible brief values without mutation, I/O, or submission. Paths are JSON Pointers. */
export function validateBrief(value,{language='en'}={}){
 const errors=[];const dictionary=messages[language]||messages.en;
 const add=(path,code)=>errors.push({path,code,message:dictionary[code]});
 const walk=(v,s,path)=>{
  const actual=v===null?'null':Array.isArray(v)?'array':typeof v;
  if(actual!==s.type){add(path,'type');return;}
  if(actual==='object'){
   for(const key of s.required||[])if(!Object.hasOwn(v,key))add(path+'/'+key,'required');
   for(const key of Object.keys(v)){const next=path+'/'+key.replace(/~/g,'~0').replace(/\//g,'~1');if(!Object.hasOwn(s.properties,key)){add(next,'additionalProperties');continue;}walk(v[key],s.properties[key],next);}
  }
  if(actual==='string'){
   const length=[...v].length;
   if(s.minLength!==undefined&&length<s.minLength)add(path,'minLength');
   if(s.maxLength!==undefined&&length>s.maxLength)add(path,'maxLength');
   if(s.pattern&&!new RegExp(s.pattern,'u').test(v))add(path,'pattern');
   if(s.enum&&!s.enum.includes(v))add(path,'enum');
   if((s.format==='date'&&!dateValid(v))||(s.format==='uri'&&!webUrl(v)))add(path,'format');
  }
  if(actual==='array'){
   if(s.minItems!==undefined&&v.length<s.minItems)add(path,'minItems');
   if(s.maxItems!==undefined&&v.length>s.maxItems)add(path,'maxItems');
   // Bound work for oversized arrays: size error already makes the input invalid.
   for(let i=0;i<Math.min(v.length,s.maxItems??v.length);i++)walk(v[i],s.items,path+'/'+i);
  }
 };
 walk(value,schema,'');return {valid:errors.length===0,errors};
}
