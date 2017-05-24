/*
 * 处理weixin的业务逻辑
 * replay、支付、错误信息的通知等
 */
'use strict'


var config = require('../config');
var Wechat = require('./wechat.config');
var menu = require('./menu');
var crawler = require('../crawler')
var wechatAPI = new Wechat(config.wechat);

function* reply(next) {
	var message = this.weixin;
	console.log(wechatAPI)
	yield wechatAPI.deleteMenu().then(function () {
		return wechatAPI.createMenu(menu)
	}).then(function (msg) {
		console.log(msg)
	})
	if (message.MsgType === 'event') {
		if (message.Event === 'subscribe') {
			this.body = '欢迎观看慕课视频\n点击菜单查看视频信息\n'+'回复 前端 后端 数据库 \n'+'有你想要的！！！';
		} else if (message.Event === 'unsubscribe') {
			this.body = '';
			console.log(message.FromUserName + '欢迎下次再来');
		} else if (message.Event === 'LOCATION') {
			this.body = '您上报的地理位置是：' + message.Latitude + ',' + message.Longitude;
		} else if (message.Event === 'CLICK') {
			//点击自定义菜单
			var CourseList = yield crawler.getCrawlCourseList(message.EventKey);
			var messages = [];
			CourseList.forEach(function (item) {
				var msg = {
					title: item.name,
					picUrl: item.img,
					url: item.link
				}
				messages.push(msg);
			});
			this.body = messages;
		}
	} else if (message.MsgType === 'text') {
		var content = message.Content;
		var reply = '点击菜单查看视频信息';
		if (content === '前端') {
			var CourseList = yield crawler.getCrawlCourseList('V_HTML_CSS');
			var messages = [];
			CourseList.forEach(function (item) {
				var msg = {
					title: item.name,
					picUrl: item.img,
					url: item.link
				}
				messages.push(msg);
			});
			reply = messages
		} else if (content === '后端') {
			var CourseList = yield crawler.getCrawlCourseList('V_PHP');
			var messages = [];
			CourseList.forEach(function (item) {
				var msg = {
					title: item.name,
					picUrl: item.img,
					url: item.link
				}
				messages.push(msg);
			});
			reply = messages
		} else if (content === '数据库') {
			var CourseList = yield crawler.getCrawlCourseList('V_mySQL');
			var messages = [];
			CourseList.forEach(function (item) {
				var msg = {
					title: item.name,
					picUrl: item.img,
					url: item.link
				}
				messages.push(msg);
			});
			reply = messages
		}
		this.body = reply;
	}
	yield next;
}

exports.reply = reply;