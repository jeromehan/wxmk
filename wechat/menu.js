/*
 * 配置自定义菜单
 */
'use strict'
module.exports = {
    'button': [{
            'name': '前端开发',
            'sub_button': [{
                    'type': 'click',
                    'name': 'HTML/CSS',
                    'key': 'V_HTML_CSS',
                    'sub_button': []
                },
                {
                    'type': 'click',
                    'name': 'JavaScript',
                    'key': 'v_js',
                    'sub_button': []
                },
                {
                    'type': 'click',
                    'name': 'Html5',
                    'key': 'V_HTML5',
                    'sub_button': []
                },
                {
                    'type': 'click',
                    'name': 'Nodejs',
                    'key': 'V_NODE_JS',
                    'sub_button': []
                },
                {
                    'type': 'click',
                    'name': 'WebAPP',
                    'key': 'V_WEB_APP',
                    'sub_button': []
                }
            ]
        },
        {
            'name': '后端开发',
            'sub_button': [{
                    'type': 'click',
                    'name': 'PHP',
                    'key': 'V_PHP',
                },
                {
                    'type': 'click',
                    'name': 'JAVA',
                    'key': 'V_JAVA',
                },
                {
                    'type': 'click',
                    'name': 'C',
                    'key': 'V_C',
                },
                {
                    'type': 'click',
                    'name': 'Python',
                    'key': 'V_pyhton',
                    'sub_button': []
                }
            ]
        },
        {
            'name': '数据库',
            'sub_button': [{
                    'type': 'click',
                    'name': 'MySQL',
                    'key': 'V_mySQL',
                },
                {
                    'type': 'click',
                    'name': 'Oracle',
                    'key': 'V_oracle',
                },
                {
                    'type': 'click',
                    'name': 'MongoDB',
                    'key': 'V_mongodb',
                },
            ]
        }
    ]
}