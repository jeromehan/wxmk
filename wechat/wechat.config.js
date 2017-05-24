/*
 * 处理access_token以及和微信交互的逻辑
 */
'use strict'

var fs = require('fs');
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var util = require('../util');

var prefix = 'https://api.weixin.qq.com/cgi-bin/';
var api = {
	accessToken:prefix+'token?grant_type=client_credential',
	menu:{
		create:prefix+'menu/create?',  //access_token=ACCESS_TOKEN  创建菜单
		get:prefix+'menu/get?',        //access_token=ACCESS_TOKE  获取菜单,GET请求
		delete:prefix+'menu/delete?',  //access_token=ACCESS_TOKEN	删除菜单,GET请求
	}
}

function Wechat(opts){     //构造函数
	var that = this;
	this.appID = opts.appID;
	this.appSecret = opts.appSecret;
	this.getAccessToken = opts.getAccessToken;
	this.saveAccessToken = opts.saveAccessToken;
	this.fetchAccessToken();
}

Wechat.prototype.fetchAccessToken = function(){
	var that = this;
	// 如果this上已经存在有效的access_token，直接返回this对象
	if(this.access_token && this.expires_in){
		if(this.isvalidAccessToken(this)){
			return Promise.resolve(this);
		}
	}
	return this.getAccessToken().then(function(data){
		try{
			data = JSON.parse(data);
		}catch(e){
			return that.updateAccessToken();
		}
		if(that.isvalidAccessToken(data)){
			return Promise.resolve(data);
		}else{
			return that.updateAccessToken();
		}
	}).then(function(data){
		that.access_token = data.access_token;
		that.expires_in = data.expires_in;
		that.saveAccessToken(JSON.stringify(data));
		return Promise.resolve(data);
	});
}

Wechat.prototype.isvalidAccessToken = function(data){
	if(!data || !data.access_token || !data.expires_in) return false;
	var access_token = data.access_token;
	var expires_in = data.expires_in;
	var now = new Date().getTime();
	return (now < expires_in) ? true : false;
}

Wechat.prototype.updateAccessToken = function(){
	var appID = this.appID;
	var appSecret = this.appSecret;
	var url = api.accessToken + '&appid='+ appID +'&secret='+ appSecret;
	return new Promise(function(resolve,reject){
		request({url:url,json:true}).then(function(response){
			var data = response.body;
			var now = new Date().getTime();
			var expires_in = now + (data.expires_in - 20) * 1000;   //考虑到网络延迟、服务器计算时间,故提前20秒发起请求
			data.expires_in = expires_in;
			resolve(data);
		});
	});
}
Wechat.prototype.replay = function(){
	var content = this.body;
	var message = this.weixin;

	var xml = util.tpl(content,message);

	this.status = 200;
	this.type = 'application/xml';
	this.body = xml;
}

//创建菜单
Wechat.prototype.createMenu = function(menu){
	var that = this;
	return new Promise(function(resolve,reject){
		that.fetchAccessToken().then(function(data){
			var url = api.menu.create + 'access_token=' + data.access_token;
			request({url:url,method:'POST',body:menu,json:true}).then(function(response){
				var _data = response.body;
				if(_data.errcode === 0){
					resolve(_data.errmsg);
				}else{
					throw new Error('create menu failed!');
				}
			}).catch(function(err){
				reject(err);
			});
		});
	});
}

//获取菜单
Wechat.prototype.getMenu = function(){
	var that = this;
	return new Promise(function(resolve,reject){
		that.fetchAccessToken().then(function(data){
			var url = api.menu.get + 'access_token=' + data.access_token;
			request({url:url,json:true}).then(function(response){
				var _data = response.body;
				if(_data.menu){
					resolve(_data.menu);
				}else{
					throw new Error('get menu failed!');
				}
			}).catch(function(err){
				reject(err);
			});
		});
	});
}

//删除菜单
Wechat.prototype.deleteMenu = function(){
	var that = this;
	return new Promise(function(resolve,reject){
		that.fetchAccessToken().then(function(data){
			var url = api.menu.delete + 'access_token=' + data.access_token;
			request({url:url,json:true}).then(function(response){
				var _data = response.body;
				if(_data.errcode === 0){
					resolve(_data.errmsg);
				}else{
					throw new Error('delete menu failed!');
				}
			}).catch(function(err){
				reject(err);
			});
		});
	});
}
module.exports = Wechat;