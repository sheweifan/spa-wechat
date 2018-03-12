var tpl = (message) =>{
	if(message.body === '') return '';
	var str = ``;

	var type = message.type

	if(type === 'text'){
		str = `<Content><![CDATA[${message.body}]]></Content>`;
	}
	else if(type === 'image'){
		str =   `<Image>
		<MediaId><![CDATA[${message.body.MediaId}]]></MediaId>
		</Image>`
	}
	else if(type === 'voice'){
		str =   `<Voice>
		<MediaId><![CDATA[${message.body.MediaId}]]></MediaId>
		</Voice>`
	}
	else if(type === 'video'){
		// MediaId	是	通过素材管理接口上传多媒体文件，得到的id
		// Title	否	视频消息的标题
		// Description	否	视频消息的描述
		str =   `<Video>
		<MediaId><![CDATA[${message.body.MediaId}]]></MediaId>
		<Title><![CDATA[${message.body.Title}]]></Title>
		<Description><![CDATA[${message.body.Description}]]></Description>
		</Video> `
	}
	else if(type === 'music'){
		// Title	否	音乐标题
		// Description	否	音乐描述
		// MusicURL	否	音乐链接
		// HQMusicUrl	否	高质量音乐链接，WIFI环境优先使用该链接播放音乐
		// ThumbMediaId	否	缩略图的媒体id，通过素材管理接口上传多媒体文件，得到的id
		str =   `<Music>
		<Title><![CDATA[${message.body.Title}]]></Title>
		<Description><![CDATA[${message.body.Description}]]></Description>
		<MusicUrl><![CDATA[${message.body.MusicUrl}]]></MusicUrl>
		<HQMusicUrl><![CDATA[${message.body.HQMusicUrl}]]></HQMusicUrl>
		<ThumbMediaId><![CDATA[${message.body.ThumbMediaId}]]></ThumbMediaId>
		</Music>`
	}
	else if(type === 'news'){

		// ArticleCount	是	图文消息个数，限制为10条以内
		// Articles	是	多条图文消息信息，默认第一个item为大图,注意，如果图文数超过10，则将会无响应
		// Title	否	图文消息标题
		// Description	否	图文消息描述
		// PicUrl	否	图片链接，支持JPG、PNG格式，较好的效果为大图360*200，小图200*200
		// Url	否	点击图文消息跳转链接

		var _str = `<ArticleCount>${message.body.length}</ArticleCount>
		<Articles>`;

		for(var i in message.body){
			_str+= `<item>
			<Title><![CDATA[${message.body[i].Title}]]></Title>
			<Description><![CDATA[${message.body[i].Description}]]></Description>
			<PicUrl><![CDATA[${message.body[i].PicUrl}]]></PicUrl>
			<Url><![CDATA[${message.body[i].Url}]]></Url>
			</item>`;
		};	

		_str+=`</Articles>`

		str = _str;
		// str +=   `<Music>
		// 			<Title><![CDATA[${message.body.Title}]]></Title>
		// 			<Description><![CDATA[${message.body.Description}]]></Description>
		// 			<MusicUrl><![CDATA[${message.body.MusicUrl}]]></MusicUrl>
		// 			<HQMusicUrl><![CDATA[${message.body.HQMusicUrl}]]></HQMusicUrl>
		// 			<ThumbMediaId><![CDATA[${message.body.ThumbMediaId}]]></ThumbMediaId>
		// 		</Music>`
	}


	// oUserName	是	接收方帐号（收到的OpenID）
	// FromUserName	是	开发者微信号
	// CreateTime	是	消息创建时间 （整型）
	return `<xml>
	<ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
	<FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
	<CreateTime>${message.now}</CreateTime>
	<MsgType><![CDATA[${type}]]></MsgType>
	${str}
	</xml>`

}

module.exports = tpl;
