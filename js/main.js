'use strict';(function(Q,A){function C(a,d){return a-d}function K(a,d,c){var b=new Date(a,d,c);return b.getFullYear()===h(a)&&b.getMonth()===h(d)&&b.getDate()===h(c)}function h(a){return parseInt(a,10)}function O(a){a.replace(/[\uff21-\uff3a\uff41-\uff5a\uff10-\uff19]/g,function(a){return String.fromCharCode(a.charCodeAt(0)-65248)})}function L(a){return 0===a%400||0===a%4&&0!==a%100}function I(){var a="",d,c;for(d=0;32>d;d++){c=16*Math.random()|0;if(8==d||12==d||16==d||20==d)a+="-";a+=(12==d?4:16==
d?c&3|8:c).toString(16)}return a}var N=0<navigator.userAgent.indexOf("iPhone")&&-1==navigator.userAgent.indexOf("iPad")||0<navigator.userAgent.indexOf("iPod")||0<navigator.userAgent.indexOf("Android"),P=Array.prototype.slice;angular.module("rabbit",["ngTouch","ngAnimate","ngMaterial","ngMessages"]).controller("mainCtrl",["$scope","_","calendar","eventCal","mode","$mdSidenav",function(a,d,c,b,e,k){a._=d;a.mode=e;e.editsEventForm=!1;e.editsGroupForm=!1;a.splitSelector=b.splitSelector;a.openNav=function(){k("left").toggle()};
c.selected=c.date;a.eventCalendar=b.eventCalendar}]).config(["$httpProvider",function(a){a.defaults.transformRequest=function(a){if(a===A)return a;if(angular.isObject(a)){var c=[],b;for(b in a)if(a.hasOwnProperty(b)){var e=a[b];c[c.length]=encodeURIComponent(b)+"="+encodeURIComponent(null==e?"":e)}a=c.join("&").replace(/%20/g,"+")}else a=null==a?"":a.toString();return a};a.defaults.headers.post={"Content-Type":"application/x-www-form-urlencoded"}}]).filter("format",["group","user",function(a,d){return function(c,
b){c=c.split(":");var e="",e="private"==c[1]?d["private"][c[2]][c[0]].name:0===h(c[1])&&-1===h(c[0])?"[mes]\u632f\u66ff\u4f11\u65e5":a[c[1]][c[2]][c[0]].name;!1!==b&&0===e.indexOf("[mes]")&&(e=e.replace(/^\[mes\]/,""));return e}}]).run(["_","db","group","$rootScope",function(a,d,c,b){var e=a.clone(c)[0];localStorage&&localStorage.getItem("group")&&(c.length=0,Array.prototype.push.apply(c,angular.fromJson(localStorage.getItem("group"))),c[0]=a.clone(e));d.list().then(function(k){k=k.data;for(var f=
0,t=k.length;f<t;f++){for(var l in k[f])k[f][l]=angular.fromJson(k[f][l]);k[f].updated=!0}k.sort(function(a,b){return a.id-b.id});f=c.length=0;for(t=k.length;f<t;f++)c[k[f].id]=k[f];c[0]=a.clone(e);b.$broadcast("updated");localStorage.setItem("group",angular.toJson(c));d.getNameList().then(function(b){for(var d=0,f=b.data[0].length;d<f;d++)c[d]||(c[d]={name:angular.fromJson(b.data[0][d])},b.data[1][d]&&(c[d].parents=angular.fromJson(b.data[1][d])));c[0]=a.clone(e);localStorage.setItem("group",angular.toJson(c))})})}]);
angular.module("rabbit").controller("calendarCtrl",["$scope","calendar","mode",function(a,d,c){a.calendar=d;a.nextMonth=function(){a.calendar.month++;a.calendar.selected=null;12<a.calendar.month+1&&(a.calendar.year+=1,a.calendar.month-=12);c.editsEventForm=!1};a.lastMonth=function(){a.calendar.month--;a.calendar.selected=null;1>a.calendar.month+1&&(1950>a.calendar.year-1?(alert("1950\u5e74\u3088\u308a\u4ee5\u524d\u306f\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u306e\u95a2\u4fc2\u3067\u8868\u793a\u3067\u304d\u307e\u305b\u3093\u3002"),
a.calendar.month+=1):(a.calendar.month+=12,--a.calendar.year));c.editsEventForm=!1};a.nextYear=function(){a.calendar.year++;a.calendar.selected=null;c.editsEventForm=!1};a.lastYear=function(){1950>a.calendar.year-1?alert("1950\u5e74\u3088\u308a\u4ee5\u524d\u306f\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u306e\u95a2\u4fc2\u3067\u8868\u793a\u3067\u304d\u307e\u305b\u3093\u3002"):(a.calendar.year--,a.calendar.selected=null);c.editsEventForm=!1};a.dates="\u65e5\u6708\u706b\u6c34\u6728\u91d1\u571f".split("")}]);
angular.module("rabbit").controller("eventEditorCtrl",["$scope","group","user","eventForm","calendar","db","mode","$mdToast",function(a,d,c,b,e,k,f,t){function l(e,l){var p=b.type;if(""===b.name||"event"===p&&(null===b.year||null===b.month||null===b.date)||"habit"===p&&""===b.rule||b.selectedGroup===A||null===b.selectedGroup)t.show(t.simple().content("\u5165\u529b\u304c\u4e0d\u9069\u5207\u3067\u3059").position("top right").hideDelay(3E3));else if("event"!==p||K(b.year,b.month-1,b.date))b.isMessage&&
(b.name="[mes]"+b.name),"private"===l?(c["private"][p][e]||(c["private"][p][e]={}),"event"===p?(c["private"][p][e].year=b.year,c["private"][p][e].month=b.month-1,c["private"][p][e].date=b.date,c["private"][p][e].name=b.name,c.updated=!0):"habit"===p&&(c["private"][p][e].selector=b.rule,c["private"][p][e].name=b.name,c.updated=!0)):(d[b.selectedGroup][p][e]||(d[b.selectedGroup][p][e]={}),"event"===p?(d[b.selectedGroup][p][e].year=b.year,d[b.selectedGroup][p][e].month=b.month-1,d[b.selectedGroup][p][e].date=
b.date,d[b.selectedGroup][p][e].name=b.name,d[b.selectedGroup].updated=!0):"habit"===p&&(d[b.selectedGroup][p][e].selector=b.rule,d[b.selectedGroup][p][e].name=b.name,d[b.selectedGroup].updated=!0)),t.show(t.simple().content("\u30a4\u30d9\u30f3\u30c8\u3092\u8ffd\u52a0\u3057\u307e\u3057\u305f").position("top right").hideDelay(3E3)),f.editsEventForm=!1,p=b.selectedGroup,"private"===p?c.save():k.post(a.group[p],p,"update")}var r=[],h=[];a.mode=f;a.group=d;a.user=c;a.eventForm=b;a.calendar=e;a.ruleWriterFase=
"";a.ruleInput="";a.eventEditor={rules:"",selectedGroup:""};a.ruleGuide={day:[[":sun","\u65e5\u66dc\u65e5"],[":mon","\u6708\u66dc\u65e5"],[":tue","\u706b\u66dc\u65e5"],[":wed","\u6c34\u66dc\u65e5"],[":thu","\u6728\u66dc\u65e5"],[":fri","\u91d1\u66dc\u65e5"],[":sat","\u571f\u66dc\u65e5"]],month:[[":1","1\u6708"],[":2","2\u6708"],[":3","3\u6708"],[":4","4\u6708"],[":5","5\u6708"],[":6","6\u6708"],[":7","7\u6708"],[":8","8\u6708"],[":9","9\u6708"],[":10","10\u6708"],[":11","11\u6708"],[":12","12\u6708"]],
selector:[["month","\u4f55\u6708"],["date","\u4f55\u65e5"],["day","\u4f55\u66dc\u65e5"],["not","\u9664\u304f"],["range","\u7bc4\u56f2"]]};a.addEvent=function(){var c=b.type;"private"===b.selectedGroup?l(a.user["private"][c].length,b.selectedGroup):null!==b.selectedGroup&&l(a.group[b.selectedGroup][c].length,b.selectedGroup)};a.editEvent=function(){l(b.id,b.selectedGroup)};a.cancel=function(){f.editsEventForm=!1};a.goFase=function(c,e){r[r.length]=a.ruleWriterFase;h[h.length]=e||c;a.ruleWriterFase=
c;b.rule=h.join("")};a.cancelFase=function(){a.ruleWriterFase=r.pop();h.pop();b.rule=h.join("")};a.finishWritingRule=function(){a.ruleWriterFase="";r=[];b.rule=h.join("");h=[]};a.startWritingRule=function(){a.ruleWriterFase="selector";r=[];h=[]}}]);angular.module("rabbit").controller("groupEditorCtrl",["$scope","group","groupForm","db","$mdToast","mode",function(a,d,c,b,e,k){a.groupForm=c;a.groupForm.parentGroup=[null];a.groupForm.mode="add";a.group=d;a.finishMakingAGroup=function(){k.editsGroupForm=
!1};a.addGroup=function(){var c=a.groupForm.parentGroup.reduce(function(a,b){-1===a.indexOf(b)&&(a[a.length]=angular.isNumber(b)?h(b):"");return a},[]),k={event:[],habit:[],name:a.groupForm.name,updated:!0};""!==c.join("")&&(k.parents=c);d[d.length]=k;b.post(k,a.group.length-1,"insert").success(a.finishMakingAGroup);e.show(e.simple().content("\u30b0\u30eb\u30fc\u30d7 "+a.groupForm.name+" \u3092\u4f5c\u6210\u3057\u307e\u3057\u305f").position("top right").hideDelay(3E3));a.groupForm.name=""};a.cancel=
function(){k.editsGroupForm=!1}}]);angular.module("rabbit").controller("detailCtrl",["$scope","eventCal","calendar","user","mode",function(a,d,c,b,e){a.mode=e;a.calendar=c;a.eventCalendar=d.eventCalendar;a.user=b;a.isToday=function(){return c.selected===c.today.date&&c.month===c.today.month&&c.year===c.today.year}}]);angular.module("rabbit").controller("settingCtrl",["$scope","_","group","user","db","eventListToEdit","groupForm","mode","$mdSidenav","$mdToast","$mdDialog",function(a,d,c,b,e,k,f,t,
h,r,J){function v(b){return-1!==a.user.following.indexOf(b)}function D(a){if(!c[a].parents)return[];for(var b=c[a].parents,e=0,d=c[a].parents.length;e<d;e++)b=D(c[a].parents[e]).concat(b);return b}a.group=c;a.user=b;a.groupForm=f;a.search_keyword="";a.searchResult=[];a.hide=function(a){b.hiddenGroup[b.hiddenGroup.length]=a;b.hiddenGroup.sort(C);b.save()};a.show=function(c){b.hiddenGroup=d.without(a.user.hiddenGroup,c);b.save()};a.followsParent=function(a){a=D(a);for(var b=0,c=a.length;b<c;b++)if(!v(a[b]))return a[b];
return!0};a.toggleNav=function(){h("left").close()};a.follows=v;a.follow=function(e){a.user.following[a.user.following.length]=e;a.user.following.sort(C);b.save();r.show(r.simple().content(c[e].name+"\u3092\u30d5\u30a9\u30ed\u30fc\u3057\u307e\u3057\u305f").position("top right").hideDelay(3E3))};a.unfollow=function(e){var d=[];d[d.length]=a.user.following.indexOf(e);for(var f=0,k=a.user.following.length;f<k;f++)if(c[a.user.following[f]].parents&&-1!=D(a.user.following[f]).indexOf(e)){if(!confirm("\u3053\u306e\u30b0\u30eb\u30fc\u30d7\u306e\u5b50\u30b0\u30eb\u30fc\u30d7("+
c[a.user.following[f]].name+")\u3092\u30d5\u30a9\u30ed\u30fc\u3057\u3066\u3044\u307e\u3059\u3002\u3053\u306e\u30b0\u30eb\u30fc\u30d7\u3092\u30d5\u30a9\u30ed\u30fc\u89e3\u9664\u3059\u308b\u3068\u3053\u3061\u3089\u3082\u89e3\u9664\u306b\u306a\u308a\u307e\u3059\u3002\u3088\u308d\u3057\u3044\u3067\u3059\u304b?"))return;d[d.length]=f}d.sort(function(a,b){return b-a});f=0;for(k=d.length;f<k;f++)a.user.following.splice(d[f],1);b.save()};a.showEventList=function(a){k.id=a;t.showsEventList=!0};a.makeAGroup=
function(){t.editsGroupForm=!0;h("left").close()};a.search=function(){var b=[];if(""==a.search_keyword||!c)return b;for(var e=0,d=c.length;e<d&&!(30<b.length);e++)c[e]&&c[e].name&&-1!==c[e].name.indexOf(a.search_keyword)&&(b[b.length]=e);a.searchResult=b};a.randomSearch=function(){var b=[];if(5>c.length)Array.prototype.push.apply(b,c);else for(;5>b.length;){var e=Math.random()*c.length|0;-1===d.indexOf(b,e)&&(b[b.length]=e)}a.searchResult=b};a.hideAll=function(){b.hiddenGroup.length=0;b.hiddenGroup=
d.clone(b.following);b.hiddenGroup[b.hiddenGroup.length]=-1;b.hiddenGroup.sort(C);b.save()};a.showAll=function(){b.hiddenGroup=[];b.save()};a.importSetting=function(){J.show({controller:["$scope","$mdDialog",function(a,b){a.text="";a.answer=function(a){b.hide(a)}}],template:'<md-dialog><md-content>\u30b3\u30d4\u30fc\u3057\u305f\u30c7\u30fc\u30bf\u3092\u8cbc\u308a\u4ed8\u3051\u3066\u304f\u3060\u3055\u3044\u3002<br><input ng-model="text"><md-button ng-click="answer(text)">ok</md-button></md-content></md-dialog>'}).then(function(a){a=
JSON.parse(a);for(var c in a)b[c]=a[c];b.save()})};a.exportSetting=function(){J.show(J.alert().title("").content("\u3053\u308c\u3092\u30b3\u30d4\u30fc\u3057\u3066\u79fb\u884c\u5148\u3067\u8cbc\u308a\u4ed8\u3051\u3066\u304f\u3060\u3055\u3044\u3002"+angular.toJson(b)).ok("ok"))}}]);angular.module("rabbit").controller("eventListCtrl",["$scope","group","user","eventListToEdit","mode",function(a,d,c,b,e){a.eventListToEdit=b;a.group=d;a.user=c;"private"!==b.id&&""!==b.id?(a.habitList=d[b.id].habit,a.eventList=
d[b.id].event):(a.habitList=c["private"].habit,a.eventList=c["private"].event);a.mode=e}]);angular.module("rabbit").factory("_",function(){return _}).factory("user",["_","$rootScope","$mdDialog","group",function(a,d,c,b){if(localStorage&&angular.fromJson(localStorage.getItem("private"))){var e=angular.fromJson(localStorage.getItem("private"));e.id||(e.id=I());e.updated=!0}else e={following:[],"private":{event:[],habit:[],name:"\u30d7\u30e9\u30a4\u30d9\u30fc\u30c8"},hiddenGroup:[],id:I()},c.show(c.alert().title("[\u91cd\u8981]\u30e6\u30fc\u30b6\u30fc\u60c5\u5831\u3092\u751f\u6210\u3057\u307e\u3057\u305f\u3002").content("\u3053\u308c\u306f\u3042\u306a\u305f\u306e\u30d1\u30bd\u30b3\u30f3\u306b\u306e\u307f\u4fdd\u5b58\u3055\u308c\u308b\u3082\u306e\u3067\u3001\u30c7\u30fc\u30bf\u30d9\u30fc\u30b9\u306b\u767b\u9332\u3055\u308c\u305f\u308a\u3001\u3069\u3053\u304b\u3078\u9001\u3089\u308c\u305f\u308a\u3057\u307e\u305b\u3093\u3002\u305f\u3060\u3057\u3001\u306a\u306b\u304b\u306e\u62cd\u5b50\u306b\u30c7\u30fc\u30bf\u304c\u6d88\u53bb\u3055\u308c\u3066id\u304c\u5909\u66f4\u3055\u308c\u3066\u3057\u307e\u3046\u3068\u30b0\u30eb\u30fc\u30d7\u306e\u6a29\u9650\u304c\u6d88\u3048\u3066\u3057\u307e\u3044\u307e\u3059\u3002\u3060\u304b\u3089\u3001\u6b21\u306e\u6587\u5b57\u5217\u3092\u4fdd\u5b58\u3057\u3066\u304a\u3044\u3066\u304f\u3060\u3055\u3044\u3002"+
angular.toJson(e)).ok("ok"));e.isHiddenGroup=function(b){return-1!==a.indexOf(this.hiddenGroup,b,!0)};e.save=function(){d.$broadcast("updated");localStorage.setItem("private",angular.toJson(this))};e.hasPermission=function(c){return"private"===c||-1!==a.indexOf(b[c].permission,e.id)};e.save();return e}]).factory("eventForm",function(){return{name:"",year:(new Date).getFullYear(),month:(new Date).getMonth()+1,date:(new Date).getDate(),type:"event",rule:""}}).factory("groupForm",function(){return{name:""}}).factory("group",
["_","$http",function(a,d){var c=[{id:0,event:[{name:"[mes]\u5341\u4e94\u591c",year:2E3,month:8,date:12},{name:"[mes]\u5341\u4e94\u591c",year:2001,month:9,date:1},{name:"[mes]\u5341\u4e94\u591c",year:2002,month:8,date:21},{name:"[mes]\u5341\u4e94\u591c",year:2003,month:8,date:11},{name:"[mes]\u5341\u4e94\u591c",year:2004,month:8,date:28},{name:"[mes]\u5341\u4e94\u591c",year:2005,month:8,date:18},{name:"[mes]\u5341\u4e94\u591c",year:2006,month:9,date:6},{name:"[mes]\u5341\u4e94\u591c",year:2007,month:8,
date:25},{name:"[mes]\u5341\u4e94\u591c",year:2008,month:8,date:14},{name:"[mes]\u5341\u4e94\u591c",year:2009,month:9,date:3},{name:"[mes]\u5341\u4e94\u591c",year:2010,month:8,date:22},{name:"[mes]\u5341\u4e94\u591c",year:2011,month:8,date:12},{name:"[mes]\u5341\u4e94\u591c",year:2012,month:8,date:30},{name:"[mes]\u5341\u4e94\u591c",year:2013,month:8,date:19},{name:"[mes]\u5341\u4e94\u591c",year:2014,month:8,date:8},{name:"[mes]\u5341\u4e94\u591c",year:2015,month:8,date:27},{name:"[mes]\u5341\u4e94\u591c",
year:2016,month:8,date:15}],habit:[{name:"[mes]\u5143\u65e6",selector:"month:1 date:1"},{name:"[mes]\u6210\u4eba\u306e\u65e5",selector:"month:1 day:2nd-mon"},{name:"[mes]\u662d\u548c\u306e\u65e5",selector:"month:4 date:29"},{name:"[mes]\u5efa\u56fd\u8a18\u5ff5\u65e5",selector:"month:2 date:11"},{name:"[mes]\u61b2\u6cd5\u8a18\u5ff5\u65e5",selector:"month:5 date:3"},{name:"[mes]\u307f\u3069\u308a\u306e\u65e5",selector:"month:5 date:4"},{name:"[mes]\u3053\u3069\u3082\u306e\u65e5",selector:"month:5 date:5"},
{name:"[mes]\u6d77\u306e\u65e5",selector:"month:7 day:3rd-mon"},{name:"[mes]\u656c\u8001\u306e\u65e5",selector:"month:9 day:3rd-mon"},{name:"[mes]\u4f53\u80b2\u306e\u65e5",selector:"month:10 day:2nd-mon"},{name:"[mes]\u6587\u5316\u306e\u65e5",selector:"month:11 date:3"},{name:"[mes]\u52e4\u52b4\u611f\u8b1d\u306e\u65e5",selector:"month:11 date:23"},{name:"[mes]\u5929\u7687\u8a95\u751f\u65e5",selector:"month:12 date:23"}],name:"\u795d\u65e5",updated:!0}],b={name:"[mes]\u79cb\u5206\u306e\u65e5",month:8};
a.each([23,23,23,23,23,23,23,23,23,23,23,23,22,23,23,23,22,23,23,23,22,23,23,23,22,23,23,23,22,23,23],function(e,d){c[0].event[c[0].event.length]=a.extend(a.clone(b),{year:2E3+d,date:e})});var e={name:"[mes]\u6625\u5206\u306e\u65e5",month:2};a.each([20,20,21,21,20,20,21,21,20,20,21,21,20,20,21,21,20,20,21,21,20,20,21,21,20,20,20,21,20,20,20],function(b,d){c[0].event[c[0].event.length]=a.extend(a.clone(e),{year:2E3+d,date:b})});return c}]).factory("calendar",["_",function(a){var d=new Date,c=[];return{year:d.getFullYear(),
month:d.getMonth(),date:d.getDate(),calendar:function(b,e){if(c[b-1950]){if(c[b-1950][e])return c[b-1950][e]}else c[b-1950]=[];var d=(new Date(b,e,1)).getDay(),f=[31,28,31,30,31,30,31,31,30,31,30,31][e];1===e&&L(b)&&(f=29);var h=[];h.year=b;h.month=e;for(var l=0;0===l||a.last(h[l-1])<f;){h[l]=[];for(var r=1;7>=r;r++)h[l][h[l].length]=0<7*l+r-d?7*l+r-d<=f?7*l+r-d:64:0;l++}return c[b-1950][e]=h},today:{year:d.getFullYear(),month:d.getMonth(),date:d.getDate()},selected:d.getDate(),selectedDay:function(){return null==
this.selected?"":"\u65e5\u6708\u706b\u6c34\u6728\u91d1\u571f".split("")[(new Date(this.year,this.month,this.selected)).getDay()]},disableHoverEvent:N}}]).factory("eventListToEdit",function(){return{id:""}}).factory("error",["$mdToast",function(a){var d=d||Error;return function(c){a.show(a.simple().content(c).position("top right").hideDelay(3E3));return new d(c)}}]).factory("mode",["_","eventForm","$mdSidenav","user","group",function(a,d,c,b,e){return{editsEventForm:!1,editsGroupForm:!1,showsEventList:!1,
switchToEdit:function(){var k=P.call(arguments);if(1===k.length||2===k.length&&!0===k[1]){var f=k[0].split(":");d.mode=1===k.length?"edit":"add";a.extend(d,{type:f[2],id:1===k.length?h(f[0]):0});d.selectedGroup="private"!==f[1]?h(f[1]):"private";"event"===f[2]?(a.map(["year","month","date","name"],function(a){d[a]="private"===f[1]?b["private"].event[f[0]][a]:e[f[1]].event[f[0]][a]}),d.month+=1):"habit"===f[2]&&("private"===f[1]?(d.rule=b["private"].habit[f[0]].selector,d.name=b["private"].habit[f[0]].name):
(d.rule=e[f[1]].habit[f[0]].selector,d.name=e[f[1]].habit[f[0]].name));d.isMessage="[mes]"===d.name.slice(0,5);d.isMessage&&(d.name=d.name.slice(5))}else 3===k.length&&a.extend(d,{mode:"add",type:"event",rule:"",id:0,name:"",year:k[0],month:k[1]+1,date:k[2]});this.editsEventForm=!0;c("left").close()}}}]).factory("db",["_","group","user","$http","$rootScope","$log",function(a,d,c,b,e,k){return{post:function(c,d,h){c=a.clone(c);c.id=d;c.permission=c.permission||[];c.parents=c.parents||"";delete c.updated;
for(var r in c)c[r]=O(angular.toJson(c[r]));c.type=h;e.$broadcast("updated");return b.post("http://www40.atpages.jp/chatblanc/genderC/database.php",c).success(function(a){k.log("updated");k.log(a)}).error(function(a){k.log(a)})},list:function(){return b.post("http://www40.atpages.jp/chatblanc/genderC/database.php",{type:"list",groupID:c.following.join(",")}).success(function(a){return a}).error(function(a){k.log(a)})},getNameList:function(){return b.post("http://www40.atpages.jp/chatblanc/genderC/database.php",
{type:"namelist"}).success(function(a){return a})}}}]).factory("eventCal",["_","group","user","calendar","error",function(a,d,c,b,e){function k(b,e,h){if("private"!==b&&!d[b])return[];var u=[],w=[];"private"===b?(a.each(c.following,function(a){w=w.concat(k(a,e,h))}),u=u.concat(f(c["private"].event,e,h,"private")),w=w.concat(u),u=u.concat(t(c["private"].habit,e,h,"private",w)),c.updated=!1):(d[b].parents&&a.each(d[b].parents,function(a){w=w.concat(k(a,e,h))}),u=u.concat(f(d[b].event,e,h,b)),w=w.concat(u),
u=u.concat(t(d[b].habit,e,h,b,w)),d[b].updated=!1);if(0===b){var z=a.map(u,function(a){return a.date});b=a.intersection(z,l("day:sun",e,h,[]));u.push.apply(u,a.map(b,function(b){for(var c=1;-1!==a.indexOf(z,b+c,!0);)c+=1;return{year:e,month:h,date:b+c,name:"[mes]\u632f\u66ff\u4f11\u65e5",group:0,id:-1,type:"habit"}}));u.sort()}return u}function f(b,c,e,d){var f=[];if(!b)return f;for(var k=0,h=b.length;k<h;k++)if(b[k].year===c&&b[k].month===e){var H=a.clone(b[k]);H.group=d;H.type="event";H.id=k;f[f.length]=
H}return f}function t(b,c,e,d,f){if(!b)return[];for(var k=[],h=0,H=b.length;h<H;h++){b[h].type="habit";b[h].group=d;var n=l(b[h].selector,c,e,f);a.each(n,function(a,f){n[f]={year:c,month:e,date:a,name:b[h].name,group:d,id:h,type:"habit"}});k=k.concat(n)}return k}function l(c,f,p,u){function w(c,f,n,p){var y=function(){var b=a.flatten(u),c=a.lastIndexOf(b,0,!0),e=a.indexOf(b,64,!0);-1===e&&(e=b.length);return b.slice(c+1,e)},q=function(a){a=a.toLowerCase();return"public-holiday"===a||"publicholiday"===
a||"\u795d\u65e5"===a},u=b.calendar(f,n),z={sunday:0,sun:0,"\u65e5\u66dc\u65e5":0,"\u65e5":0,monday:1,mon:1,"\u6708\u66dc\u65e5":1,"\u6708":1,tuesday:2,tue:2,"\u706b\u66dc\u65e5":2,"\u706b":2,wednesday:3,wed:3,"\u6c34\u66dc\u65e5":3,"\u6c34":3,thursday:4,thu:4,"\u6728\u66dc\u65e5":4,"\u6728":4,friday:5,fri:5,"\u91d1\u66dc\u65e5":5,"\u91d1":5,saturday:6,sat:6,"\u571f\u66dc\u65e5":6,"\u571f":6},M={january:0,jan:0,"\u7766\u6708":0,february:1,feb:1,"\u5982\u6708":1,march:2,mar:2,"\u5f25\u751f":2,april:3,
apr:3,"\u536f\u6708":3,may:4,"\u7690\u6708":4,june:5,jun:5,"\u6c34\u7121\u6708":5,july:6,jul:6,"\u6587\u6708":6,august:7,aug:7,"\u8449\u6708":7,september:8,sep:8,"\u9577\u6708":8,october:9,oct:9,"\u795e\u7121\u6708":9,november:10,nov:10,"\u971c\u6708":10,december:11,dec:11,"\u5e2b\u8d70":11};if(v[f-1950])if(v[f-1950][n]){if(v[f-1950][n][c])return a.clone(v[f-1950][n][c])}else v[f-1950][n]={};else v[f-1950]=[],v[f-1950][n]={};var l=c.split(":")[0],g=c.split(":").slice(1).join(":"),m=[],r=[],F=[],t=
[],x,E,A,B=[];if("not"===l)if(m=y(),q(g)){g=k(0,f,n);q=0;for(B=g.length;q<B;q++)g[q]=g[q].date;m=a.difference(m,g);v[f-1950][n][c]=a.clone(m)}else if(0===g.indexOf("year")||0===g.indexOf("month")||0===g.indexOf("date")||0===g.indexOf("day"))g=g.replace(/=/,":"),m=a.difference(y(),w(g,f,n));else{var D=g.split("=")[0],C=g.replace(/^.+?=/,""),C=C.replace(/^"(.+)"$/,"$1");a.each(p,function(b){if(b[D]===C||0===b[D].indexOf("[mes]")&&b[D].slice(5)===C)m=a.without(m,b.date)})}else if("is"===l){m=y();if(q(g)){g=
k(0,f,n);q=0;for(B=g.length;q<B;q++)g[q]=g[q].date;m=a.intersection(m,g)}else{if("last"===g)return c=[31,28,31,30,31,30,31,31,30,31,30,31][n],L(f)&&1===n&&(c=29),[c];throw e("unexpected a value of a yesterday selector."+g);}v[f-1950][n][c]=a.clone(m)}else if("yesterday"===l){m=y();B=g.split(":")[0];g.split(":").slice(1).join(":");if(q(g))m=a.intersection(m,a.map(w("is:"+g,f,n),function(a){return a+1})),v[f-1950][n][c]=a.clone(m);else if("day"===B||"date"===B)m=a.intersection(y(),a.map(w(g,f,n),function(a){return a+
1}));else throw e("unexpected a value of a yesterday selector."+g);v[f-1950][n][c]=a.clone(m)}else if("range"===l)if(".."===g.slice(0,2)){g="..."===g.slice(0,3)?g.slice(3):g.slice(2);g=a.map(g.split("/"),h);x=new Date(g[0],g[1]-1,g[2]);if(!K(g[0],g[1]-1,g[2]))throw e("invalid range selector."+l+":"+g);x.getFullYear()<f||x.getFullYear()==f&&x.getMonth()<n?m=[]:x.getFullYear()==f&&x.getMonth()==n?(m=y(),m=m.slice(0,a.lastIndexOf(m,x.getDate(),!0)+1)):m=y()}else if(".."===g.slice(-2)){g="..."===g.slice(-3)?
g.slice(0,-3):g.slice(0,-2);g=a.map(g.split("/"),h);q=new Date(g[0],g[1]-1,g[2]);if(!K(g[0],g[1]-1,g[2]))throw e("invalid range selector."+l+":"+g);q.getFullYear()>f||q.getFullYear()==f&&q.getMonth()>n?m=[]:q.getFullYear()==f&&q.getMonth()==n?(m=y(),m=m.slice(a.indexOf(m,q.getDate(),!0))):m=y()}else if(-1!==g.indexOf(".."))m=[],g=g.split("..."),1===g.length&&(g=g[0].split("..")),r=[],F=[],t=[],q=g[0],B=[],x=g[1],E=x.substr(x.length-4,4),A=x.substr(x.length-5,5),q=a.map(q.split("/"),h),3===q.length?
B.push(new Date(q[0],q[1]-1,q[2])):2===q.length&&B.push(new Date(f-1,q[0]-1,q[1]),new Date(f,q[0]-1,q[1])),a.each(B,function(b){b.getFullYear()>f||b.getFullYear()==f&&b.getMonth()>n?r=[]:b.getFullYear()==f&&b.getMonth()==n?(r=y(),r=r.slice(a.indexOf(r,b.getDate(),!0))):r=y();t.push(r)}),B=a.zip(B,t),a.each(B,function(b){var c=b[0];b=b[1];var e;if("date"===E||"week"===E||"year"===E||"dates"===A||"weeks"===A||"years"===A){var d;d="date"===E||"week"===E||"year"===E?h(x.substring(0,x.length-4)):h(x.substring(0,
x.length-5));e=new Date(c.getTime());"date"===E||"dates"===A?e.setDate(e.getDate()+d):"week"===E||"weeks"===A?e.setDate(e.getDate()+7*d):"year"!==E&&"years"!==A||e.setFullYear(e.getFullYear()+d)}else e=x.split("/"),e=a.map(e,h),3===e.length?e=new Date(e[0],e[1]-1,e[2]):(e=new Date(c.getFullYear(),e[0]-1,e[1]),e.getTime()<c.getTime()&&e.setFullYear(e.getFullYear()+1));e.getFullYear()<f||e.getFullYear()==f&&e.getMonth()<n?F=[]:e.getFullYear()==f&&e.getMonth()==n?(F=y(),F=F.slice(0,a.lastIndexOf(F,e.getDate(),
!0)+1)):F=y();a.isEmpty(a.intersection(b,F))||(m=a.intersection(b,F))});else throw e('invalid selector "'+l+":"+g+'" in '+d[groupID].name+".");else if("date"===l)m[m.length]=h(g);else if("month"===l)m=!M[g.toLowerCase()]&&h(g)!==n+1||M[g.toLowerCase()]&&M[g.toLowerCase()]!=n?[]:y();else if("day"===l)if(g.match(/^\d/))g=g.toLowerCase().match(/^(\d+)(?:st|[nr]d|th)-?(.+)$/),q=h(g[1]),m=[(w("day:"+g[2],f,n)||[])[q-1]];else if("last"===g.slice(0,4).toLowerCase()){var g=g.toLowerCase(),G=g.slice(4);"-"===
G.charAt(0)&&(G=G.slice(1));m=[a.last(w("day:"+G,f,n))]}else G=z[g.toLowerCase()],a.some(u,function(a){""!==a[G]&&(m[m.length]=a[G])});else if("year"===l)m="leap-year"===g||"leap_year"===g||"\u3046\u308b\u3046\u5e74"===g||"\u958f\u5e74"===g?L(f)?y():[]:h(g)!==f?[]:y();else throw e('undefined key "'+l+'".');"day"===l&&(v[f-1950][n][c]=a.clone(m));return m}if(""===c)throw e("cannot exec empty selector.");c=J(r(c));u=u||[];var z=[];a.each(c,function(b){if(1===b[1])z[z.length]=w(b[0],f,p,u);else if(0===
b[1])if("&&"===b[0])z.push(a.intersection(z.pop(),z.pop()));else if("||"===b[0])z.push(a.union(z.pop(),z.pop()));else throw e("undefined operator "+b[0]);});if(1!=z.length)throw console.log(z,c),e("unexpected error in execSelectors().");return z.pop()}function r(a){function b(a){""!==a[0]&&(c[c.length]=a)}if(D[a])return D[a];for(var c=[],e=!1,d=0,f=0,k=a.length;f<k;f++){var h=a.charAt(f);if(e)'"'===h?e=!1:"\\"===h&&(f+=1);else if('"'===h)e=!0;else if(" "===h)b([a.substring(d,f),1]),h=a.substr(f).match(/^ (?:and|&&|\u304b\u3064|or|\|\||\u307e\u305f\u306f) |^ /)[0],
b([{" ":"&&"," and ":"&&"," \u304b\u3064 ":"&&"," && ":"&&"," or ":"||"," \u307e\u305f\u306f ":"||"," || ":"||"}[h],0]),d=f+h.length,f+=h.length;else if("("===h||")"===h)b([a.substring(d,f),1]),b([h,"("===h?2:3]),d=f+1}""!==a.substring(d)&&b([a.substring(d),1]);return D[a]=c}function J(a){for(var b=[],c=[],d={"||":0,"&&":1},f=0,k=a.length;f<k;f++)if(1===a[f][1])c[c.length]=a[f].concat();else if(0===a[f][1]){var h=a[f][0];b[b.length-1]&&d[h]<=d[b[b.length-1][0]]&&(c[c.length]=b.pop());b[b.length]=
a[f]}else if(2===a[f][1])b[b.length]=a[f];else if(3===a[f][1]){for(;2!=b[b.length-1][1];)if(c[c.length]=b.pop(),0===b.length)throw e("found mismatched parentheses");b.pop()}for(;0<b.length;){if(2===b[b.length-1][1])throw e("found mismatched parentheses.");c[c.length]=b.pop()}return c}var v=[],D={},p=[],A="",C=-1,I=-1;return{eventCalendar:function(e){var d=[],f=[],h=a.difference(c.following,c.hiddenGroup);if(b.year!==C||b.month!==I)C=b.year,I=b.month,p=[];else if(h.join(",")!==A||c.updated||a.any(h,
function(a){return!0===a.updated}))p=[],A=h.join(",");else return p[e]||[];for(var l=0,r=h.length;l<r;l++)d[d.length]=k(h[l],b.year,b.month);c.isHiddenGroup(-1)||(d[d.length]=k("private",b.year,b.month));l=0;for(r=d.length;l<r;l++)for(var t=0,v=d[l].length;t<v;t++){var n=d[l][t].date;f[n]||(f[n]=[]);f[n][f[n].length]=d[l][t].id+":"+d[l][t].group+":"+d[l][t].type}p=a.clone(f);A=h.join(",");return p[e]||[]},splitSelector:r,execSelectors:l}}]).run(["calendar","$timeout",function(a,d){function c(){var b=
new Date;b.setDate(b.getDate()+1);b.setHours(0);b.setMinutes(0);b.setSeconds(0);b.setMilliseconds(0);var k=new Date;a.today.year=k.getFullYear();a.today.month=k.getMonth();a.today.date=k.getDate();d(c,b-new Date)}var b=new Date;b.setDate(b.getDate()+1);b.setHours(0);b.setMinutes(0);b.setSeconds(0);b.setMilliseconds(0);d(c,b-new Date)}]);angular.module("rabbit").directive("appDate",function(){return{scope:{row:"=appRow"},restrict:"A",template:'<span class="date"></span>',replace:!0,controller:["$scope",
"calendar","eventCal","$filter",function(a,d,c,b){a.calendar=d;a.bookedClass=function(a){a=c.eventCalendar(a);for(var d=0,f=0,h=a.length;f<h;f++)0!==b("format")(a[f],!1).indexOf("[mes]")&&d++;return 5>d?"booked-"+d:"booked-5"};a.dateClass=function(b){if(0!==b&&32!==b){var c=a.calendar,d=[];c.selected===b&&(d[d.length]="selected");d[d.length]=a.bookedClass(b);b===c.today.date&&c.month===c.today.month&&c.year===c.today.year&&(d[d.length]="today");return d}return[]}}],link:function(a,d,c){function b(){d.removeClass("selected booked-0 booked-1 booked-2 booked-3 booked-4 booked-5 today");
d.addClass(a.dateClass(e).join(" "))}var e=a.row[c.appDate];0!==e&&64!==e&&e!==A&&(d.append(angular.element("<span>").addClass("inner").text(e)),a.$on("updated",b),b(),d.on("mouseenter",function(){!a.calendar.disableHoverEvent&&e&&(a.calendar.selected=e,angular.element(document.querySelectorAll(".selected")).removeClass("selected"),b(),a.$apply())}),d.on("mouseleave",function(){a.calendar.disableHoverEvent||(a.calendar.selected=null,angular.element(document.querySelectorAll(".selected")).removeClass("selected"),
a.$apply())}),d.on("click",function(){N||(a.calendar.disableHoverEvent=a.calendar.selected===e?!a.calendar.disableHoverEvent:!0);a.calendar.selected=e;angular.element(document.querySelectorAll(".selected")).removeClass("selected");b();a.$apply()}))}}}).directive("eventItem",function(){return{restrict:"A",scope:{event:"=appEvent"},template:'<div class="md-item-content event-item" layout="row"><div flex>{{event|format}}</div><div flex><md-button ng-click="mode.switchToEdit(event)">\u7de8\u96c6</md-button><md-button ng-click="mode.switchToEdit(event,true)">\u30b3\u30d4\u30fc</md-button><md-button ng-click="deleteEvent(event)" ng-if="user.hasPermission(event.split(\':\')[1])">\u524a\u9664</md-button></div></div>',
replace:!0,controller:["$scope","mode","user","db",function(a,d,c,b){a.mode=d;a.user=c;a.deleteEvent=function(a){var d=a.split(":")[0],f=a.split(":")[1];a=a.split(":")[2];c.hasPermission(f)&&("private"===f?(c["private"][a].splice(d,1),c.updated=!0,c.save()):(group[f][a].splice(d,1),group[f].updated=!0,b.post(group[f],f,"update")))}}],link:function(a,d,c){}}})})(window);
