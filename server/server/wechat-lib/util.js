import fs from 'fs';
import xml2js from 'xml2js';
import sha1 from 'sha1';
import _ from 'lodash';
import _tpl from './tpl';

const tpl = (message, weixin)=>{
  console.log('message',message)
  console.log('weixin',weixin)
  var info ={};

  var type ='text';
  if(typeof message === 'object'){
      if( message.type ){
          type = message.type 
      }    
  }
  
  if(Array.isArray(message)){
      type = 'news';
  }

  info.type = type;
  info.FromUserName = weixin.FromUserName;
  info.ToUserName = weixin.ToUserName;
  info.now = new Date().getTime();

  info.body = message;

  // console.log(`message`,JSON.stringify(message));
  // // console.log(`info`,JSON.stringify(info));
  // this.status = 200;
  // this.type = `application/xml`;
  // // console.log(tpl(info));
  // this.body = tpl(info);
  return _tpl(info);
}

const readFileAsync = (fpath,encodning)=>{
  return new Promise((res,rej)=>{
    fs.readFile(fpath,encodning,(err,content)=>{
      if(err){
        rej();
      }else{
        res(content);
      }
    })
  })
}

const writeFileAsync = (fpath,content)=>{
  return new Promise((res,rej)=>{
    fs.writeFile(fpath,content,(err)=>{
      if(err){
        rej();
      }else{
        res();
      }
    })
  })
}

const parseXMLAsync = (data)=> {
  return new Promise((res,rej)=>{
     xml2js.parseString(data,(err,result)=>{
      if(err){
        rej();
        return;
      }
      res(result);
     });
  });
}

const flattenJSON = function(data) {
    var newObj = {};

    if(typeof data === 'object'){
        var keys = Object.keys(data);

        if(!keys.length) return;
        
        if(keys.length === 1 && !(data instanceof Array) ){
            newObj = data[keys[0]];
        }

        for(var item in newObj){

            if(newObj[item] instanceof Array ){
                if(newObj[item].length === 1){
                    newObj[item] = newObj[item][0];
                    // newObj[item] = newObj[item][0].trim();
                }
                if(newObj[item].length === 0){
                    try{
                        delete newObj[item]
                    }catch(e){
                        console.log(e);
                    }
                }
            }

            if(typeof newObj[item] === 'string' && newObj[item].length === 0){
                try{
                    delete newObj[item]
                }catch(e){
                    console.log(e);
                }
            }

        }
    }

    return newObj;
}

// jsapi_ticket 签名算法
// const createNonce = ()=>{
//   return Math.random().toString(36).substr(2, 15);
// }

// const createTimestamp = ()=>{
//   return parseInt((new Date().getTime())/1000, 0) +''
// }

// const raw = (args)=>{
//   let keys = _.keys(args);

//   keys = keys.sort();

//   let newArgs = {};

//   _.forEach(keys, item=>{
//     newArgs[item.toLowerCase()] = args[item]
//   })

//   let str = '';

//   _.forEach(keys, (value,key)=>{
//     str += '&' + key + '=' + value; 
//   })

//   return str.substr(1);
// }

// const signIt = (nonceStr, ticket, timestamp, url) =>{
//   const ret = {
//     jsapi_ticket: ticket,
//     nonceStr,
//     timestamp,
//     url
//   }
//   const str = raw(ret);
//   return sha1(str);
// }

// const sign = (ticket, url) => {
//   const nonceStr = createNonce();
//   const timestamp = createTimestamp();
//   const signature = signIt(nonceStr, ticket, timestamp, url);
//   console.log({ ticket, url, nonceStr, timestamp, signature});
//   return { nonceStr, timestamp, signature}
// }

function createNonce () {
  return Math.random().toString(36).substr(2, 15)
}

function createTimestamp () {
  return parseInt(new Date().getTime() / 1000, 0) + ''
}

function raw (args) {
  let keys = Object.keys(args)
  let newArgs = {}
  let str = ''

  keys = keys.sort()
  keys.forEach((key) => {
    newArgs[key.toLowerCase()] = args[key]
  })

  for (let k in newArgs) {
    str += '&' + k + '=' + newArgs[k]
  }

  return str.substr(1)
}

function signIt (nonce, ticket, timestamp, url) {
  const ret = {
    jsapi_ticket: ticket,
    nonceStr: nonce,
    timestamp: timestamp,
    url: url
  }

  const string = raw(ret)
  const sha = sha1(string)

  return sha
}

function sign (ticket, url) {
  const nonce = createNonce()
  const timestamp = createTimestamp()
  const signature = signIt(nonce, ticket, timestamp, url)
  return {
    noncestr: nonce,
    timestamp: timestamp,
    signature: signature
  }
}


export default {
  tpl,
  readFileAsync,
  writeFileAsync,
  parseXMLAsync,
  flattenJSON,
  sign
}