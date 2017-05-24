/*
 * 配置文件
 * 
 */
'use strict'

var path = require('path');
var util = require('../util');
var wechat_file = path.join(__dirname, '../file/wechat.txt');

var config = {
    wechat: {
        appID: 'wxd11a7c31ce251955',
        appSecret: '2eaa18464930b5dc16a5cec6d320120c',
        token: 'wxmk',
        getAccessToken: function () {
            return util.readFileAsync(wechat_file);
        },
        saveAccessToken: function (data) {
            return util.writeFileAsync(wechat_file, data);
        },
    }
};
module.exports = config;