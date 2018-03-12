import { getWechat, getOAuth } from '../wechat';

const wechatClient = getWechat();

export async function getSignaturAsync(url){
  const { access_token } = await wechatClient.fetchAccessToken();
  const { ticket } = await wechatClient.fetchTicket(access_token);

  let params = wechatClient.sign(ticket, url);
  params.appId = wechatClient.appID;

  return params;
}

export async function getAuthorizeURL(...args){
  const oauth = getOAuth();
  
  return oauth.getAuthorizeURL(...args);
}

export async function getUserByCode(code){
  const oauth = getOAuth();
  const { access_token, openid } = await oauth.fetchAccessToken(code);
  const user = await oauth.getUserInfo(access_token, openid);

  return user;
}