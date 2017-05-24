'use strict'
var cheerio = require('cheerio');
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var prefix = 'http://www.imooc.com';
var coursePrefix='http://www.imooc.com/course/list?'
var courseLink = {
	V_HTML_CSS:coursePrefix+'c=html',
	v_js:coursePrefix+'c=javascript',
	V_HTML5:coursePrefix+'c=html5',
	V_NODE_JS:coursePrefix+'c=nodejs',
	V_WEB_APP:coursePrefix+'c=webapp',
	V_PHP:coursePrefix+'c=php',
	V_JAVA:coursePrefix+'c=java',
	V_C:coursePrefix+'c=c',
	V_pyhton:coursePrefix+'c=python',
    V_mySQL:coursePrefix+'c=mysql',
    V_oracle:coursePrefix+'c=oracle',
    V_mongodb:coursePrefix+'c=mongodb'
}
function getListByEventKey(eventKey){
	return new Promise(function(resolve,reject){
		request(courseLink[eventKey],function(err,res,body){
			if(!err && res.statusCode == 200){
				var $ = cheerio.load(body);
				var dlList = $('.course-card-container');
				var courseList = [];
				dlList.each(function(index){
					if(index < 5){  //选前5个
						var link = prefix + $(this).find('a').attr('href');
                        console.log(link)
						var img = $(this).find('.course-card-bk img').attr('src');
						var name = $(this).find('.course-card-content .course-card-name').html();
                        name=unescape(name.replace(/;/g,'').replace(/&#x/g, "%u"));
						var course = {
							name:name,
							img:img,
							link:link
						}
                        console.log(course)
						courseList.push(course);
					}
				});
				resolve(courseList);
			}
		});
	});
}


exports.getCrawlCourseList = function* (eventKey){
	return yield getListByEventKey(eventKey);
}