import _ from 'underscore'

import a from '@/a.js'

import '../css/index.css' //css的引入方式。

_.delay(function(){
	alert(0);
	alert(a);
},100)