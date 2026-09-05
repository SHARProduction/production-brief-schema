#!/usr/bin/env node
import {readFileSync,statSync} from 'node:fs';
import {validateBrief} from './validator.mjs';
const [file,language='en',...extra]=process.argv.slice(2);
try{
 if(!file||extra.length||!['en','ru'].includes(language))throw new Error('Usage: node cli.mjs brief.json [en|ru]');
 if(statSync(file).size>262144)throw new Error('Input exceeds 256 KiB.');
 const value=JSON.parse(readFileSync(file,'utf8').replace(/^\uFEFF/,''));
 const result=validateBrief(value,{language});console.log(JSON.stringify(result,null,2));process.exitCode=result.valid?0:1;
}catch(error){console.log(JSON.stringify({valid:false,errors:[{path:'',code:'input',message:error.message}]},null,2));process.exitCode=2;}
