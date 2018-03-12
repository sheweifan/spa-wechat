import fs from 'fs';
import request from 'request-promise';
import tpl from './tpl';
import util from './util';

const prefix = 'https://api.weixin.qq.com/cgi-bin/';
const api = {
  //获取接口
  accessToken:prefix+'token?grant_type=client_credential',
  //临时素材  
  temporary:{
    //access_token=ACCESS_TOKEN&type=TYPE
    upload:prefix+'media/upload?',
    // access_token=ACCESS_TOKEN&media_id=MEDIA_ID
    get:prefix+'media/get?',
  },
  //永久
  permanent:{
    // material/add_material?access_token=ACCESS_TOKEN
    upload:prefix+'material/add_material?',
    // access_token=ACCESS_TOKEN
    uploadNews:prefix+'material/add_news?',
    // media/uploadimg?access_token=ACCESS_TOKEN
    uploadNewsImg:prefix+'media/uploadimg?',
    // material/get_materialcount?access_token=ACCESS_TOKEN
    getCount:prefix+'material/get_materialcount?',
    // material/del_material?access_token=ACCESS_TOKEN
    delete:prefix+'material/del_material?',
    // material/get_material?access_token=ACCESS_TOKEN
    get:prefix+ 'material/get_material?',
    // material/batchget_material?access_token=ACCESS_TOKEN
    batch:prefix+'material/batchget_material?',
    // material/update_news?access_token=ACCESS_TOKEN
    edit:prefix+'material/update_news?'
  },
  // 菜单
  menu:{
    // /menu/create?access_token=ACCESS_TOKEN
    create:prefix+'menu/create?',
    // menu/get?access_token=ACCESS_TOKEN
    get:prefix+'menu/get?',
    // menu/delete?access_token=ACCESS_TOKEN
    delete:prefix+'menu/delete?',
  },
  // access_token=ACCESS_TOKEN&type=jsapi
  ticket: {
    get: prefix+ 'ticket/getticket?'
  }
};


class Wechat{

  //init
  constructor(opts){
    var self = this;
    this.appID = opts.appID;
    this.appSecret = opts.appSecret;
    this.getAccessToken = opts.getAccessToken;
    this.saveAccessToken = opts.saveAccessToken;
    this.getTicket = opts.getTicket;
    this.saveTicket = opts.saveTicket;

    this.fetchAccessToken();
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

  async fetchAccessToken(){
    let data;

    try{
      data = await this.getAccessToken();
    }catch(e){
      data = await this.updateAccessToken()
    }

    // try{
    //   data=JSON.parse(data)
    // }
    // catch(e){
    //   return this.updateAccessToken()
    // }
    
    if(!this.isValidToken(data)){
      data = await this.updateAccessToken()
    }

    await this.saveAccessToken(data);

    return data;
  }


  async fetchTicket(token){
    let data;

    try{
      data = await this.getTicket();
    }catch(e){
      data = await this.updateTicket()
    }

    if(!this.isValidToken(data)){
      data = await this.updateTicket(token)
    }

    await this.saveTicket(data);

    return data;
  }

  //验证是不是需要更新
  isValidToken(data, name){
    if(!data || !data[name] || !data.expires_in){
      return false;
    }

    const expires_in = data.expires_in;
    const now = (new Date().getTime())

    return now < expires_in
  }
  //更新token
  async updateAccessToken(){
    const appID = this.appID;
    const appSecret = this.appSecret;
    const url = api.accessToken + '&appid=' + appID + '&secret='+appSecret;

    const data = await this.request({
      url:url
    })

    const now = (new Date().getTime());
    const expires_in = now + (data.expires_in -20)*1000;
    data.expires_in = expires_in;

    return data
  }
  //更新ticket
  async updateTicket(token){
    const url = api.ticket.get+ 'access_token='+ token +'&type=jsapi';

    let data = await this.request({url});

    const now = (new Date().getTime());
    const expires_in = now + (data.expires_in -20)*1000;
    data.expires_in = expires_in;

    return data
  }
  // 产出xml
  // reply(){
  //   var info ={};
  //   var message = this.body;
  //   if(!message) {

  //     this.status = 404;
  //     this.body = '';

  //     return;
  //   }

  //   var type ='text';
  //   if(typeof message === 'object'){
  //     if( message.type ){
  //       type = message.type 
  //     }    
  //   }

  //   if(Array.isArray(message)){
  //     type = 'news';
  //   }

  //   info.type = type;
  //   info.FromUserName = this.weixin.FromUserName;
  //   info.ToUserName = this.weixin.ToUserName;
  //   info.now = new Date().getTime();

  //   info.body = message;

  //     // console.log(`message`,JSON.stringify(message));
  //     // console.log(`info`,JSON.stringify(info));
  //     this.status = 200;
  //     this.type = `application/xml`;
  //     // console.log(tpl(info));
  //     this.body = tpl(info);
  // }

  //上传素材
  uploadMaterial(type,material,permanent){
    var self = this;

    return new Promise((res,rej)=>{
      self.fetchAccessToken()
      .then(data=>{

        var form,
        url,
        _type='';

        if(permanent){
          if(type === 'news'){
            url = api.permanent.uploadNews;
            form = material
          }else if(type === 'newsImg'){
            url = api.permanent.uploadNewsImg;
          }else{
            if(type === 'video'){
              form = material
            }
            url = api.permanent.upload;
          }
        }else{
          url = api.temporary.upload
          _type = '&type='+type;
        }

        if(type !== 'news'){
          form = {
            media:fs.createReadStream(material),
            type:type
          }
        }

        var options = {
          method:'POST',
          json:true,
          url:url+'access_token='+ data.access_token +_type
        }

        if(type === 'news'){
          options.body = form;
        }else{
          options.formData = form;
        }

        // console.log(options);

        return request(options)

      })
      .then(data=>{
        // console.log(JSON.stringify(data));
        var _data = data.body;
        // console.log(_data);
        if(_data){
          res(_data);
        }else{
          rej()
        }
      })
      .catch(e=>{
        console.log(e);
        rej()
      })  
    });

  }

  //获取临时素材
  getMaterial(mediaId,type,permanent){
    var self = this;
    return new Promise((res,rej)=>{
      self.fetchAccessToken()
      .then(data=>{
        if(permanent){
          var url = api.permanent.get+'access_token='+ data.access_token;
          if(type==='news' || type==='video'){
            request({
              json:true,
              body:{
                media_id:mediaId
              },
              method:'POST'
            })
            .then(data=>{
              var _data = data.body;
              if(!_data){
                throw new Error('getmaterial fails')
              }else{
                res(_data)
              }
            })
            .catch(e=>{
              rej();
            })

          }else{
            res(url);
          }

        }else{
          var url = api.temporary.get+'access_token='+ data.access_token +'&media_id='+mediaId;

          res(type==='video'?url.replace('https://','http://'):url)
        }
      })
    })

  }
  getMaterialCount(){
    var self = this;
    return new Promise((res,rej)=>{
      self.fetchAccessToken()
      .then(data=>{
        return request({
          json:true,
          url:api.permanent.getCount+`access_token=`+data.access_token
        })
      })
      .then(data=>{
        res(data.body);
      })
      .catch(err=>{
        rej(err);
        console.log('getCount',err);
      })
    })
  }
  deleteMaterial(mediaId){
    var self = this;
    return new Promise((res,rej)=>{
      self.fetchAccessToken()
      .then(data=>{
        return request({
          json:true,
          method:'POST',
          url:api.permanent.delete+`access_token=`+data.access_token,
          body:{
            media_id:mediaId
          }
        })
      })
      .then(data=>{
        res(data.body);
      })
      .catch(err=>{
        rej(err);
        console.log('deleteMaterial',err);
      })
    })
  }
  batchMaterial(opts){
    var self = this;
    if(typeof opts !== 'object'){
      opts = {};
    }
    opts.type = opts.type || 'image';
    opts.offset = opts.offset || 0;
    opts.count = opts.count || 10;

    // console.log(opts)
    return new Promise((res,rej)=>{
      self.fetchAccessToken()
      .then(data=>{
        return request({
          json:true,
          method:'POST',
          url:api.permanent.batch+`access_token=`+data.access_token,
          body:opts
        });
      })
      .then(data=>{
        var _data = data.body;
                // console.log(_data)
                if(!_data){
                  throw new Error('batchMaterial fails')
                }else{
                  res(_data)
                }
              })
      .catch(e=>{
                // console.log('batchMaterial fails')
                rej();
              })
    })
  }
  editMaterial(opts){
    var self = this;
    return new Promise((res,rej)=>{
      self.fetchAccessToken()
      .then(data=>{
        return request({
          json:true,
          method:'POST',
          url:api.permanent.edit+`access_token=`+data.access_token,
          body:opts
        })
      })
      .then(data=>{
        // console.log(data.body.errcode)
        res(data.body.errcode===0);
      })
      .catch(err=>{
        rej(err);
        console.log('editMaterial',err);
      })
    })
  }
  createMenu(menu){
    var self = this;
    return new Promise((res,rej)=>{
      self.fetchAccessToken()
      .then(data=>{
        return request({
          json:true,
          url:api.menu.create+`access_token=`+data.access_token,
          method:'POST',
          body:menu
        })
      })
      .then(data=>{
        var _data = data.body;
        if(!_data){
          throw Error('createMenu fails');
        }else{
          res(_data);
        }
      })
      .catch(e=>{
        rej(e);
      })
    })
  }
  getMenu(){
    var self = this;
    return new Promise((res,rej)=>{
      self.fetchAccessToken()
      .then(data=>{
        return request({
          json:true,
          url:api.menu.get+`access_token=`+data.access_token
        })
      })
      .then(data=>{
        var _data = data.body;
        if(!_data){
          throw Error('getMenu fails');
        }else{
          res(_data);
        }
      })
      .catch(e=>{
        rej(e);
      })
    })
  }
  deleteMenu(){
    var self = this;
    return new Promise((res,rej)=>{
      self.fetchAccessToken()
      .then(data=>{
        return request({
          json:true,
          url:api.menu.delete+`access_token=`+data.access_token
        })
      })
      .then(data=>{
        var _data = data.body;
        if(!_data){
          throw Error('deleteMenu fails');
        }else{
          res(_data);
        }
      })
      .catch(e=>{
        rej(e);
      })
    })
  }

}


  module.exports = Wechat;