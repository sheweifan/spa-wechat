
import request from 'request-promise';

// https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=SECRET&code=CODE&grant_type=authorization_code 
const prefix = 'https://api.weixin.qq.com/sns/';
const api = {
  // ?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=SCOPE&state=STATE#wechat_redirect
  authorize: 'https://open.weixin.qq.com/connect/oauth2/authorize?',
  // ?appid=APPID&secret=SECRET&code=CODE&grant_type=authorization_code 
  accessToken: prefix + 'oauth2/access_token?',
  // ?access_token=ACCESS_TOKEN&openid=OPENID&lang=zh_CN
  userInfo: prefix + 'userinfo?'
}



class WechatOAuth{

  constructor(opts){
    var self = this;
    this.appID = opts.appID;
    this.appSecret = opts.appSecret;

    // this.fetchAccessToken();
  }

  sign(ticket, url){
    return util.sign(ticket, url)
  }

  async request (options) {
    options = Object.assign({}, options, {json: true})

    try {
      const response = await request(options)
      return response
    } catch (error) {
      console.error(error)
    }
  }

  getAuthorizeURL(scope= 'snsapi_base', target, state){
    var url = `${api.authorize}appid=${this.appID}&redirect_uri=${encodeURIComponent(target)}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`;
    console.log(url)
    return url;
  }

  async fetchAccessToken(code){
    const url = `${api.accessToken}appid=${this.appID}&secret=${this.appSecret}&code=${code}&grant_type=authorization_code`;

    const data = await this.request({ url })
  
    return data;
  }

  async getUserInfo( token, openID, lang='zh_CN'){
    const url = `${api.userInfo}access_token=${token}&openid=${openID}&lang=${lang}`;

    const data = await this.request({url});

    return data;
  }

}


module.exports = WechatOAuth;