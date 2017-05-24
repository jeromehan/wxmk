'use strict'

var Koa = require('koa');
var wechat = require('./wechat/middleware');
var config = require('./config');
var weixin = require('./wechat/wechat.reply');
var app = new Koa();
app.use(wechat(config.wechat,weixin.reply));
// //app.use(weixin.sendMsg);
// app.use(weixin.setMenu);
app.listen(3000);

console.log('Listening 3000')