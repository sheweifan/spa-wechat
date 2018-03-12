import getRawBody from 'raw-body';
import sha1 from 'sha1';
import util from './util';
import wechatMiddle from './middleware';

export default function(config, reply){
  return async function wechatMiddle(ctx, next){

    // require('../wechat')
    const { token } = config;
    const { signature, nonce, timestamp, echostr} = ctx.query;

    const str = [token, timestamp, nonce].sort().join('');
    const sha = sha1(str);

    const method = ctx.method;

    if(method === 'GET'){
      ctx.body = sha === signature ? (echostr + '') : 'wrong';
    }else if(method === 'POST'){
      if(sha !== signature){
        ctx.body = 'wrong';
        return false;
      }

      const data = await getRawBody(ctx.req,{
          length: ctx.length,
          limit:'1mb',
          encoding: ctx.charset
      })

      const content = await util.parseXMLAsync(data);
      const message = util.flattenJSON(content);
      ctx.weixin = message;

      await reply.apply(ctx, [ctx, next]);

      const { body, weixin } = ctx;
      const xml = util.tpl(body, weixin);

      ctx.status = 200;
      ctx.type = 'application/xml';
      ctx.body = xml;

      // console.log('wechat.reply',ctx.body);



    }   
  }
}