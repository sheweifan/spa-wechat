// import getRawBody from 'raw-body';
// import sha1 from 'sha1';
// import wechatMiddle from './middleware';

export default async (ctx, next) =>{
  const message = ctx.weixin;

  // console.log(message);

  ctx.body = 'f**k';
}