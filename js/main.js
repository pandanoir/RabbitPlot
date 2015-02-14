'use strict';(function(R,E){function J(a,c){return a-c}function M(a,c,d){var b=new Date(a,c,d);return b.getFullYear()===r(a)&&b.getMonth()===r(c)&&b.getDate()===r(d)}function r(a){return parseInt(a,10)}function P(a){a.replace(/[\uff21-\uff3a\uff41-\uff5a\uff10-\uff19]/g,function(a){return String.fromCharCode(a.charCodeAt(0)-65248)})}function N(a){return 0===a%400||0===a%4&&0!==a%100}function L(){var a="",c,d;for(c=0;32>c;c++){d=16*Math.random()|0;if(8==c||12==c||16==c||20==c)a+="-";a+=(12==c?4:16==
c?d&3|8:d).toString(16)}return a}var O=0<navigator.userAgent.indexOf("iPhone")&&-1==navigator.userAgent.indexOf("iPad")||0<navigator.userAgent.indexOf("iPod")||0<navigator.userAgent.indexOf("Android"),Q=Array.prototype.slice;angular.module("rabbit",["ngTouch","ngAnimate","ngMaterial","ngMessages"]).controller("mainCtrl",["$scope","_","calendar","eventCal","mode","$mdSidenav",function(a,c,d,b,f,h){a._=c;a.mode=f;f.editsEventForm=!1;f.editsGroupForm=!1;a.splitSelector=b.splitSelector;a.openNav=function(){h("left").toggle()};
d.selected=d.date;a.eventCalendar=b.eventCalendar}]).config(["$httpProvider",function(a){a.defaults.transformRequest=function(a){if(a===E)return a;if(angular.isObject(a)){var d=[],b;for(b in a)if(a.hasOwnProperty(b)){var f=a[b];d[d.length]=encodeURIComponent(b)+"="+encodeURIComponent(null==f?"":f)}a=d.join("&").replace(/%20/g,"+")}else a=null==a?"":a.toString();return a};a.defaults.headers.post={"Content-Type":"application/x-www-form-urlencoded"}}]).filter("format",["group","user",function(a,c){return function(d,
b){d=d.split(":");var f="",f="private"==d[1]?c["private"][d[2]][d[0]].name:0===r(d[1])&&-1===r(d[0])?"[mes]\u632f\u66ff\u4f11\u65e5":a[d[1]][d[2]][d[0]].name;!1!==b&&0===f.indexOf("[mes]")&&(f=f.replace(/^\[mes\]/,""));return f}}]).run(["_","db","group","$rootScope",function(a,c,d,b){var f=a.clone(d)[0];localStorage&&localStorage.getItem("group")&&(d.length=0,Array.prototype.push.apply(d,angular.fromJson(localStorage.getItem("group"))),d[0]=a.clone(f));c.list().then(function(h){h=h.data;for(var e=
0,k=h.length;e<k;e++){for(var l in h[e])h[e][l]=angular.fromJson(h[e][l]);h[e].updated=!0}h.sort(function(a,b){return a.id-b.id});e=d.length=0;for(k=h.length;e<k;e++)d[h[e].id]=h[e];d[0]=a.clone(f);b.$broadcast("updated");localStorage.setItem("group",angular.toJson(d));c.getNameList().then(function(b){for(var c=0,e=b.data[0].length;c<e;c++)d[c]||(d[c]={name:angular.fromJson(b.data[0][c])},b.data[1][c]&&(d[c].parents=angular.fromJson(b.data[1][c])));d[0]=a.clone(f);localStorage.setItem("group",angular.toJson(d))})})}]).directive("eventItem",
function(){return{restrict:"A",scope:{event:"=appEvent"},template:'<div class="md-item-content event-item" layout="row"><div flex>{{event|format}}</div><div flex><md-button ng-click="mode.switchToEdit(event)">\u7de8\u96c6</md-button><md-button ng-click="mode.switchToEdit(event,true)">\u30b3\u30d4\u30fc</md-button><md-button ng-click="deleteEvent(event)" ng-if="user.hasPermission(event.split(\':\')[1])">\u524a\u9664</md-button></div></div>',replace:!0,controller:["$scope","mode","user","db",function(a,
c,d,b){a.mode=c;a.user=d;a.deleteEvent=function(a){var c=a.split(":")[0],e=a.split(":")[1];a=a.split(":")[2];d.hasPermission(e)&&("private"===e?(d["private"][a].splice(c,1),d.updated=!0,d.save()):(group[e][a].splice(c,1),group[e].updated=!0,b.post(group[e],e,"update")))}}],link:function(a,c,d){}}});angular.module("rabbit").controller("calendarCtrl",["$scope","calendar","mode",function(a,c,d){a.calendar=c;a.nextMonth=function(){a.calendar.month++;a.calendar.selected=null;12<a.calendar.month+1&&(a.calendar.year+=
1,a.calendar.month-=12);d.editsEventForm=!1};a.lastMonth=function(){a.calendar.month--;a.calendar.selected=null;1>a.calendar.month+1&&(1950>a.calendar.year-1?(alert("1950\u5e74\u3088\u308a\u4ee5\u524d\u306f\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u306e\u95a2\u4fc2\u3067\u8868\u793a\u3067\u304d\u307e\u305b\u3093\u3002"),a.calendar.month+=1):(a.calendar.month+=12,--a.calendar.year));d.editsEventForm=!1};a.nextYear=function(){a.calendar.year++;a.calendar.selected=null;d.editsEventForm=!1};a.lastYear=
function(){1950>a.calendar.year-1?alert("1950\u5e74\u3088\u308a\u4ee5\u524d\u306f\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u306e\u95a2\u4fc2\u3067\u8868\u793a\u3067\u304d\u307e\u305b\u3093\u3002"):(a.calendar.year--,a.calendar.selected=null);d.editsEventForm=!1};a.dates="\u65e5\u6708\u706b\u6c34\u6728\u91d1\u571f".split("")}]).directive("appDate",function(){return{scope:{row:"=appRow"},restrict:"A",template:'<span class="date"></span>',replace:!0,controller:["$scope","calendar","eventCal","$filter",
function(a,c,d,b){a.calendar=c;a.bookedClass=function(a){a=d.eventCalendar(a);for(var c=0,e=0,k=a.length;e<k;e++)0!==b("format")(a[e],!1).indexOf("[mes]")&&c++;return 5>c?"booked-"+c:"booked-5"};a.dateClass=function(b){if(0!==b&&32!==b){var d=a.calendar,c=[];d.selected===b&&(c[c.length]="selected");c[c.length]=a.bookedClass(b);b===d.today.date&&d.month===d.today.month&&d.year===d.today.year&&(c[c.length]="today");return c}return[]}}],link:function(a,c,d){function b(){c.removeClass("selected booked-0 booked-1 booked-2 booked-3 booked-4 booked-5 today");
c.addClass(a.dateClass(f).join(" "))}var f=a.row[d.appDate];0!==f&&64!==f&&f!==E&&(c.append(angular.element("<span>").addClass("inner").text(f)),a.$on("updated",b),b(),c.on("mouseenter",function(){!a.calendar.disableHoverEvent&&f&&(a.calendar.selected=f,angular.element(document.querySelectorAll(".selected")).removeClass("selected"),b(),a.$apply())}),c.on("mouseleave",function(){a.calendar.disableHoverEvent||(a.calendar.selected=null,angular.element(document.querySelectorAll(".selected")).removeClass("selected"),
a.$apply())}),c.on("click",function(){O||(a.calendar.disableHoverEvent=a.calendar.selected===f?!a.calendar.disableHoverEvent:!0);a.calendar.selected=f;angular.element(document.querySelectorAll(".selected")).removeClass("selected");b();a.$apply()}))}}});angular.module("rabbit").controller("eventEditorCtrl",["$scope","group","user","eventForm","calendar","db","mode","$mdToast",function(a,c,d,b,f,h,e,k){function l(f,l){var p=b.type;if(""===b.name||"event"===p&&(null===b.year||null===b.month||null===
b.date)||"habit"===p&&""===b.rule||b.selectedGroup===E||null===b.selectedGroup)k.show(k.simple().content("\u5165\u529b\u304c\u4e0d\u9069\u5207\u3067\u3059").position("top right").hideDelay(3E3));else if("event"!==p||M(b.year,b.month-1,b.date))b.isMessage&&(b.name="[mes]"+b.name),"private"===l?(d["private"][p][f]||(d["private"][p][f]={}),"event"===p?(d["private"][p][f].year=b.year,d["private"][p][f].month=b.month-1,d["private"][p][f].date=b.date,d["private"][p][f].name=b.name,d.updated=!0):"habit"===
p&&(d["private"][p][f].selector=b.rule,d["private"][p][f].name=b.name,d.updated=!0)):(c[b.selectedGroup][p][f]||(c[b.selectedGroup][p][f]={}),"event"===p?(c[b.selectedGroup][p][f].year=b.year,c[b.selectedGroup][p][f].month=b.month-1,c[b.selectedGroup][p][f].date=b.date,c[b.selectedGroup][p][f].name=b.name,c[b.selectedGroup].updated=!0):"habit"===p&&(c[b.selectedGroup][p][f].selector=b.rule,c[b.selectedGroup][p][f].name=b.name,c[b.selectedGroup].updated=!0)),k.show(k.simple().content("\u30a4\u30d9\u30f3\u30c8\u3092\u8ffd\u52a0\u3057\u307e\u3057\u305f").position("top right").hideDelay(3E3)),
e.editsEventForm=!1,p=b.selectedGroup,"private"===p?d.save():h.post(a.group[p],p,"update")}var v=[],t=[];a.mode=e;a.group=c;a.user=d;a.eventForm=b;a.calendar=f;a.ruleWriterFase="";a.ruleInput="";a.eventEditor={rules:"",selectedGroup:""};a.ruleGuide={day:[[":sun","\u65e5\u66dc\u65e5"],[":mon","\u6708\u66dc\u65e5"],[":tue","\u706b\u66dc\u65e5"],[":wed","\u6c34\u66dc\u65e5"],[":thu","\u6728\u66dc\u65e5"],[":fri","\u91d1\u66dc\u65e5"],[":sat","\u571f\u66dc\u65e5"]],month:[[":1","1\u6708"],[":2","2\u6708"],
[":3","3\u6708"],[":4","4\u6708"],[":5","5\u6708"],[":6","6\u6708"],[":7","7\u6708"],[":8","8\u6708"],[":9","9\u6708"],[":10","10\u6708"],[":11","11\u6708"],[":12","12\u6708"]],selector:[["month","\u4f55\u6708"],["date","\u4f55\u65e5"],["day","\u4f55\u66dc\u65e5"],["not","\u9664\u304f"],["range","\u7bc4\u56f2"]]};a.addEvent=function(){var d=b.type;"private"===b.selectedGroup?l(a.user["private"][d].length,b.selectedGroup):null!==b.selectedGroup&&l(a.group[b.selectedGroup][d].length,b.selectedGroup)};
a.editEvent=function(){l(b.id,b.selectedGroup)};a.cancel=function(){e.editsEventForm=!1};a.goFase=function(d,c){v[v.length]=a.ruleWriterFase;t[t.length]=c||d;a.ruleWriterFase=d;b.rule=t.join("")};a.cancelFase=function(){a.ruleWriterFase=v.pop();t.pop();b.rule=t.join("")};a.finishWritingRule=function(){a.ruleWriterFase="";v=[];b.rule=t.join("");t=[]};a.startWritingRule=function(){a.ruleWriterFase="selector";v=[];t=[]}}]);angular.module("rabbit").controller("groupEditorCtrl",["$scope","group","groupForm",
"db","$mdToast","mode",function(a,c,d,b,f,h){a.groupForm=d;a.groupForm.parentGroup=[null];a.groupForm.mode="add";a.group=c;a.finishMakingAGroup=function(){h.editsGroupForm=!1};a.addGroup=function(){var d=a.groupForm.parentGroup.reduce(function(a,b){-1===a.indexOf(b)&&(a[a.length]=angular.isNumber(b)?r(b):"");return a},[]),h={event:[],habit:[],name:a.groupForm.name,updated:!0};""!==d.join("")&&(h.parents=d);c[c.length]=h;b.post(h,a.group.length-1,"insert").success(a.finishMakingAGroup);f.show(f.simple().content("\u30b0\u30eb\u30fc\u30d7 "+
a.groupForm.name+" \u3092\u4f5c\u6210\u3057\u307e\u3057\u305f").position("top right").hideDelay(3E3));a.groupForm.name=""};a.cancel=function(){h.editsGroupForm=!1}}]);angular.module("rabbit").controller("detailCtrl",["$scope","eventCal","calendar","user","mode",function(a,c,d,b,f){a.mode=f;a.calendar=d;a.eventCalendar=c.eventCalendar;a.user=b;a.isToday=function(){return d.selected===d.today.date&&d.month===d.today.month&&d.year===d.today.year}}]);angular.module("rabbit").controller("settingCtrl",
["$scope","_","group","user","db","eventListToEdit","groupForm","mode","$mdSidenav","$mdToast","$mdDialog",function(a,c,d,b,f,h,e,k,l,r,t){function A(b){return-1!==a.user.following.indexOf(b)}function C(a){if(!d[a].parents)return[];for(var b=d[a].parents,c=0,f=d[a].parents.length;c<f;c++)b=C(d[a].parents[c]).concat(b);return b}a.group=d;a.user=b;a.groupForm=e;a.search_keyword="";a.searchResult=[];a.hide=function(a){b.hiddenGroup[b.hiddenGroup.length]=a;b.hiddenGroup.sort(J);b.save()};a.show=function(d){b.hiddenGroup=
c.without(a.user.hiddenGroup,d);b.save()};a.followsParent=function(a){a=C(a);for(var b=0,d=a.length;b<d;b++)if(!A(a[b]))return a[b];return!0};a.toggleNav=function(){l("left").close()};a.follows=A;a.follow=function(c){a.user.following[a.user.following.length]=c;a.user.following.sort(J);b.save();r.show(r.simple().content(d[c].name+"\u3092\u30d5\u30a9\u30ed\u30fc\u3057\u307e\u3057\u305f").position("top right").hideDelay(3E3))};a.unfollow=function(c){var f=[];f[f.length]=a.user.following.indexOf(c);for(var e=
0,h=a.user.following.length;e<h;e++)if(d[a.user.following[e]].parents&&-1!=C(a.user.following[e]).indexOf(c)){if(!confirm("\u3053\u306e\u30b0\u30eb\u30fc\u30d7\u306e\u5b50\u30b0\u30eb\u30fc\u30d7("+d[a.user.following[e]].name+")\u3092\u30d5\u30a9\u30ed\u30fc\u3057\u3066\u3044\u307e\u3059\u3002\u3053\u306e\u30b0\u30eb\u30fc\u30d7\u3092\u30d5\u30a9\u30ed\u30fc\u89e3\u9664\u3059\u308b\u3068\u3053\u3061\u3089\u3082\u89e3\u9664\u306b\u306a\u308a\u307e\u3059\u3002\u3088\u308d\u3057\u3044\u3067\u3059\u304b?"))return;
f[f.length]=e}f.sort(function(a,b){return b-a});e=0;for(h=f.length;e<h;e++)a.user.following.splice(f[e],1);b.save()};a.showEventList=function(a){h.id=a;k.showsEventList=!0};a.makeAGroup=function(){k.editsGroupForm=!0;l("left").close()};a.search=function(){var b=[];if(""==a.search_keyword||!d)return b;for(var c=0,f=d.length;c<f&&!(30<b.length);c++)d[c]&&d[c].name&&-1!==d[c].name.indexOf(a.search_keyword)&&(b[b.length]=c);a.searchResult=b};a.randomSearch=function(){var b=[];if(5>d.length)Array.prototype.push.apply(b,
d);else for(;5>b.length;){var f=Math.random()*d.length|0;-1===c.indexOf(b,f)&&(b[b.length]=f)}a.searchResult=b};a.hideAll=function(){b.hiddenGroup.length=0;b.hiddenGroup=c.clone(b.following);b.hiddenGroup[b.hiddenGroup.length]=-1;b.hiddenGroup.sort(J);b.save()};a.showAll=function(){b.hiddenGroup=[];b.save()};a.importSetting=function(){t.show({controller:["$scope","$mdDialog",function(a,b){a.text="";a.answer=function(a){b.hide(a)}}],template:'<md-dialog><md-content>\u30b3\u30d4\u30fc\u3057\u305f\u30c7\u30fc\u30bf\u3092\u8cbc\u308a\u4ed8\u3051\u3066\u304f\u3060\u3055\u3044\u3002<br><input ng-model="text"><md-button ng-click="answer(text)">ok</md-button></md-content></md-dialog>'}).then(function(a){a=
JSON.parse(a);for(var d in a)b[d]=a[d];b.save()})};a.exportSetting=function(){t.show(t.alert().title("").content("\u3053\u308c\u3092\u30b3\u30d4\u30fc\u3057\u3066\u79fb\u884c\u5148\u3067\u8cbc\u308a\u4ed8\u3051\u3066\u304f\u3060\u3055\u3044\u3002"+angular.toJson(b)).ok("ok"))}}]);angular.module("rabbit").controller("eventListCtrl",["$scope","group","user","eventListToEdit","mode",function(a,c,d,b,f){a.eventListToEdit=b;a.group=c;a.user=d;"private"!==b.id&&""!==b.id?(a.habitList=c[b.id].habit,a.eventList=
c[b.id].event):(a.habitList=d["private"].habit,a.eventList=d["private"].event);a.mode=f}]);angular.module("rabbit").factory("_",function(){return _}).factory("user",["_","$rootScope","$mdDialog","group",function(a,c,d,b){if(localStorage&&angular.fromJson(localStorage.getItem("private"))){var f=angular.fromJson(localStorage.getItem("private"));f.id||(f.id=L());f.updated=!0}else f={following:[],"private":{event:[],habit:[],name:"\u30d7\u30e9\u30a4\u30d9\u30fc\u30c8"},hiddenGroup:[],id:L()},d.show(d.alert().title("[\u91cd\u8981]\u30e6\u30fc\u30b6\u30fc\u60c5\u5831\u3092\u751f\u6210\u3057\u307e\u3057\u305f\u3002").content("\u3053\u308c\u306f\u3042\u306a\u305f\u306e\u30d1\u30bd\u30b3\u30f3\u306b\u306e\u307f\u4fdd\u5b58\u3055\u308c\u308b\u3082\u306e\u3067\u3001\u30c7\u30fc\u30bf\u30d9\u30fc\u30b9\u306b\u767b\u9332\u3055\u308c\u305f\u308a\u3001\u3069\u3053\u304b\u3078\u9001\u3089\u308c\u305f\u308a\u3057\u307e\u305b\u3093\u3002\u305f\u3060\u3057\u3001\u306a\u306b\u304b\u306e\u62cd\u5b50\u306b\u30c7\u30fc\u30bf\u304c\u6d88\u53bb\u3055\u308c\u3066id\u304c\u5909\u66f4\u3055\u308c\u3066\u3057\u307e\u3046\u3068\u30b0\u30eb\u30fc\u30d7\u306e\u6a29\u9650\u304c\u6d88\u3048\u3066\u3057\u307e\u3044\u307e\u3059\u3002\u3060\u304b\u3089\u3001\u6b21\u306e\u6587\u5b57\u5217\u3092\u4fdd\u5b58\u3057\u3066\u304a\u3044\u3066\u304f\u3060\u3055\u3044\u3002"+
angular.toJson(f)).ok("ok"));f.isHiddenGroup=function(b){return-1!==a.indexOf(this.hiddenGroup,b,!0)};f.save=function(){c.$broadcast("updated");localStorage.setItem("private",angular.toJson(this))};f.hasPermission=function(d){return"private"===d||-1!==a.indexOf(b[d].permission,f.id)};f.save();return f}]).factory("eventForm",function(){return{name:"",year:(new Date).getFullYear(),month:(new Date).getMonth()+1,date:(new Date).getDate(),type:"event",rule:""}}).factory("groupForm",function(){return{name:""}}).factory("group",
["$http",function(a){var c=[{id:0,event:[{name:"[mes]\u5341\u4e94\u591c",year:2E3,month:8,date:12},{name:"[mes]\u5341\u4e94\u591c",year:2001,month:9,date:1},{name:"[mes]\u5341\u4e94\u591c",year:2002,month:8,date:21},{name:"[mes]\u5341\u4e94\u591c",year:2003,month:8,date:11},{name:"[mes]\u5341\u4e94\u591c",year:2004,month:8,date:28},{name:"[mes]\u5341\u4e94\u591c",year:2005,month:8,date:18},{name:"[mes]\u5341\u4e94\u591c",year:2006,month:9,date:6},{name:"[mes]\u5341\u4e94\u591c",year:2007,month:8,
date:25},{name:"[mes]\u5341\u4e94\u591c",year:2008,month:8,date:14},{name:"[mes]\u5341\u4e94\u591c",year:2009,month:9,date:3},{name:"[mes]\u5341\u4e94\u591c",year:2010,month:8,date:22},{name:"[mes]\u5341\u4e94\u591c",year:2011,month:8,date:12},{name:"[mes]\u5341\u4e94\u591c",year:2012,month:8,date:30},{name:"[mes]\u5341\u4e94\u591c",year:2013,month:8,date:19},{name:"[mes]\u5341\u4e94\u591c",year:2014,month:8,date:8},{name:"[mes]\u5341\u4e94\u591c",year:2015,month:8,date:27},{name:"[mes]\u5341\u4e94\u591c",
year:2016,month:8,date:15}],habit:[{name:"[mes]\u5143\u65e6",selector:"month:1 date:1"},{name:"[mes]\u6210\u4eba\u306e\u65e5",selector:"month:1 day:2nd-mon"},{name:"[mes]\u662d\u548c\u306e\u65e5",selector:"month:4 date:29"},{name:"[mes]\u5efa\u56fd\u8a18\u5ff5\u65e5",selector:"month:2 date:11"},{name:"[mes]\u61b2\u6cd5\u8a18\u5ff5\u65e5",selector:"month:5 date:3"},{name:"[mes]\u307f\u3069\u308a\u306e\u65e5",selector:"month:5 date:4"},{name:"[mes]\u3053\u3069\u3082\u306e\u65e5",selector:"month:5 date:5"},
{name:"[mes]\u6d77\u306e\u65e5",selector:"month:7 day:3rd-mon"},{name:"[mes]\u656c\u8001\u306e\u65e5",selector:"month:9 day:3rd-mon"},{name:"[mes]\u4f53\u80b2\u306e\u65e5",selector:"month:10 day:2nd-mon"},{name:"[mes]\u6587\u5316\u306e\u65e5",selector:"month:11 date:3"},{name:"[mes]\u52e4\u52b4\u611f\u8b1d\u306e\u65e5",selector:"month:11 date:23"},{name:"[mes]\u5929\u7687\u8a95\u751f\u65e5",selector:"month:12 date:23"}],name:"\u795d\u65e5",updated:!0}],d={name:"[mes]\u79cb\u5206\u306e\u65e5",month:8};
_.each([23,23,23,23,23,23,23,23,23,23,23,23,22,23,23,23,22,23,23,23,22,23,23,23,22,23,23,23,22,23,23],function(a,b){c[0].event[c[0].event.length]=_.extend(_.clone(d),{year:2E3+b,date:a})});var b={name:"[mes]\u6625\u5206\u306e\u65e5",month:2};_.each([20,20,21,21,20,20,21,21,20,20,21,21,20,20,21,21,20,20,21,21,20,20,21,21,20,20,20,21,20,20,20],function(a,d){c[0].event[c[0].event.length]=_.extend(_.clone(b),{year:2E3+d,date:a})});return c}]).factory("calendar",function(){var a=new Date,c=[];return{year:a.getFullYear(),
month:a.getMonth(),date:a.getDate(),calendar:function(a,b){if(c[a-1950]){if(c[a-1950][b])return c[a-1950][b]}else c[a-1950]=[];var f=(new Date(a,b,1)).getDay(),h=[31,28,31,30,31,30,31,31,30,31,30,31][b];1===b&&N(a)&&(h=29);var e=[];e.year=a;e.month=b;for(var k=0;0===k||_.last(e[k-1])<h;){e[k]=[];for(var l=1;7>=l;l++)e[k][e[k].length]=0<7*k+l-f?7*k+l-f<=h?7*k+l-f:64:0;k++}return c[a-1950][b]=e},today:{year:a.getFullYear(),month:a.getMonth(),date:a.getDate()},selected:a.getDate(),selectedDay:function(){return null==
this.selected?"":"\u65e5\u6708\u706b\u6c34\u6728\u91d1\u571f".split("")[(new Date(this.year,this.month,this.selected)).getDay()]},disableHoverEvent:O}}).factory("eventListToEdit",function(){return{id:""}}).factory("error",["$mdToast",function(a){var c=c||Error;return function(d){a.show(a.simple().content(d).position("top right").hideDelay(3E3));return new c(d)}}]).factory("mode",["_","eventForm","$mdSidenav","user","group",function(a,c,d,b,f){return{editsEventForm:!1,editsGroupForm:!1,showsEventList:!1,
switchToEdit:function(){var h=Q.call(arguments);if(1===h.length||2===h.length&&!0===h[1]){var e=h[0].split(":");c.mode=1===h.length?"edit":"add";a.extend(c,{type:e[2],id:1===h.length?e[0]:0});c.selectedGroup="private"!==e[1]?r(e[1]):"private";"event"===e[2]?(a.map(["year","month","date","name"],function(a){c[a]="private"===e[1]?b["private"].event[e[0]][a]:f[e[1]].event[e[0]][a]}),c.month+=1):"habit"===e[2]&&("private"===e[1]?(c.rule=b["private"].habit[e[0]].selector,c.name=b["private"].habit[e[0]].name):
(c.rule=f[e[1]].habit[e[0]].selector,c.name=f[e[1]].habit[e[0]].name));c.isMessage="[mes]"===c.name.slice(0,5);c.isMessage&&(c.name=c.name.slice(5))}else 3===h.length&&a.extend(c,{mode:"add",type:"event",rule:"",id:0,name:"",year:h[0],month:h[1]+1,date:h[2]});this.editsEventForm=!0;d("left").close()}}}]).factory("db",["_","group","user","$http","$rootScope","$log",function(a,c,d,b,f,h){return{post:function(c,d,l){c=a.clone(c);c.id=d;c.permission=c.permission||[];c.parents=c.parents||"";delete c.updated;
for(var r in c)c[r]=P(angular.toJson(c[r]));c.type=l;f.$broadcast("updated");return b.post("http://www40.atpages.jp/chatblanc/genderC/database.php",c).success(function(a){h.log("updated");h.log(a)}).error(function(a){h.log(a)})},list:function(){return b.post("http://www40.atpages.jp/chatblanc/genderC/database.php",{type:"list",groupID:d.following.join(",")}).success(function(a){return a}).error(function(a){h.log(a)})},getNameList:function(){return b.post("http://www40.atpages.jp/chatblanc/genderC/database.php",
{type:"namelist"}).success(function(a){return a})}}}]).factory("eventCal",["_","group","user","calendar","error",function(a,c,d,b,f){function h(b,f,D){if("private"!==b&&!c[b])return[];var u=[],w=[];"private"===b?(a.each(d.following,function(a){w=w.concat(h(a,f,D))}),u=u.concat(e(d["private"].event,f,D,"private")),w=w.concat(u),u=u.concat(k(d["private"].habit,f,D,"private",w)),d.updated=!1):(c[b].parents&&a.each(c[b].parents,function(a){w=w.concat(h(a,f,D))}),u=u.concat(e(c[b].event,f,D,b)),w=w.concat(u),
u=u.concat(k(c[b].habit,f,D,b,w)),c[b].updated=!1);if(0===b){var z=a.map(u,function(a){return a.date});b=a.intersection(z,l("day:sun",f,D,[]));u.push.apply(u,a.map(b,function(b){for(var c=1;-1!==a.indexOf(z,b+c,!0);)c+=1;return{year:f,month:D,date:b+c,name:"[mes]\u632f\u66ff\u4f11\u65e5",group:0,id:-1,type:"habit"}}));u.sort()}return u}function e(b,c,d,f){var e=[];if(!b)return e;for(var h=0,H=b.length;h<H;h++)if(b[h].year===c&&b[h].month===d){var K=a.clone(b[h]);K.group=f;K.type="event";K.id=h;e[e.length]=
K}return e}function k(b,c,d,f,e){if(!b)return[];for(var h=[],H=0,K=b.length;H<K;H++){b[H].type="habit";b[H].group=f;var n=l(b[H].selector,c,d,e);a.each(n,function(a,e){n[e]={year:c,month:d,date:a,name:b[H].name,group:f,id:H,type:"habit"}});h=h.concat(n)}return h}function l(d,e,p,u){function w(d,e,n,p){var y=function(){return a.flatten(u)},q=function(a){a=a.toLowerCase();return"public-holiday"===a||"publicholiday"===a||"\u795d\u65e5"===a},u=b.calendar(e,n),z={sunday:0,sun:0,"\u65e5\u66dc\u65e5":0,
monday:1,mon:1,"\u6708\u66dc\u65e5":1,tuesday:2,tue:2,"\u706b\u66dc\u65e5":2,wednesday:3,wed:3,"\u6c34\u66dc\u65e5":3,thursday:4,thu:4,"\u6728\u66dc\u65e5":4,friday:5,fri:5,"\u91d1\u66dc\u65e5":5,saturday:6,sat:6,"\u571f\u66dc\u65e5":6},D={january:0,jan:0,"\u7766\u6708":0,february:1,feb:1,"\u5982\u6708":1,march:2,mar:2,"\u5f25\u751f":2,april:3,apr:3,"\u536f\u6708":3,may:4,"\u7690\u6708":4,june:5,jun:5,"\u6c34\u7121\u6708":5,july:6,jul:6,"\u6587\u6708":6,august:7,aug:7,"\u8449\u6708":7,september:8,
sep:8,"\u9577\u6708":8,october:9,oct:9,"\u795e\u7121\u6708":9,november:10,nov:10,"\u971c\u6708":10,december:11,dec:11,"\u5e2b\u8d70":11};if(A[e-1950])if(A[e-1950][n]){if(A[e-1950][n][d])return a.clone(A[e-1950][n][d])}else A[e-1950][n]={};else A[e-1950]=[],A[e-1950][n]={};var k=d.split(":")[0],g=d.split(":").slice(1).join(":"),m=[],l=[],G=[],t=[],x,F,v,B=[];if("not"===k)if(m=y(),q(g)){g=h(0,e,n);q=0;for(B=g.length;q<B;q++)g[q]=g[q].date;m=a.difference(m,g);A[e-1950][n][d]=a.clone(m)}else if(0===g.indexOf("year")||
0===g.indexOf("month")||0===g.indexOf("date")||0===g.indexOf("day"))g=g.replace(/=/,":"),m=a.difference(y(),w(g,e,n));else{var E=g.split("=")[0],C=g.replace(/^.+?=/,""),C=C.replace(/^"(.+)"$/,"$1");a.each(p,function(b){if(b[E]===C||0===b[E].indexOf("[mes]")&&b[E].slice(5)===C)m=a.without(m,b.date)})}else if("is"===k){m=y();if(q(g)){g=h(0,e,n);q=0;for(B=g.length;q<B;q++)g[q]=g[q].date;m=a.intersection(m,g)}else{if("last"===g)return d=[31,28,31,30,31,30,31,31,30,31,30,31][n],N(e)&&1===n&&(d=29),[d];
throw f("unexpected a value of a yesterday selector."+g);}A[e-1950][n][d]=a.clone(m)}else if("yesterday"===k){m=y();B=g.split(":")[0];g.split(":").slice(1).join(":");if(q(g))m=a.intersection(m,a.map(w("is:"+g,e,n),function(a){return a+1})),A[e-1950][n][d]=a.clone(m);else if("day"===B||"date"===B)m=a.intersection(y(),a.map(w(g,e,n),function(a){return a+1}));else throw f("unexpected a value of a yesterday selector."+g);A[e-1950][n][d]=a.clone(m)}else if("range"===k)if(".."===g.slice(0,2)){g="..."===
g.slice(0,3)?g.slice(3):g.slice(2);g=a.map(g.split("/"),r);x=new Date(g[0],g[1]-1,g[2]);if(!M(g[0],g[1]-1,g[2]))throw f("invalid range selector."+k+":"+g);x.getFullYear()<e||x.getFullYear()==e&&x.getMonth()<n?m=[]:x.getFullYear()==e&&x.getMonth()==n?(m=y(),m=m.slice(0,a.lastIndexOf(m,x.getDate(),!0)+1)):m=y()}else if(".."===g.slice(-2)){g="..."===g.slice(-3)?g.slice(0,-3):g.slice(0,-2);g=a.map(g.split("/"),r);q=new Date(g[0],g[1]-1,g[2]);if(!M(g[0],g[1]-1,g[2]))throw f("invalid range selector."+k+
":"+g);q.getFullYear()>e||q.getFullYear()==e&&q.getMonth()>n?m=[]:q.getFullYear()==e&&q.getMonth()==n?(m=y(),m=m.slice(a.indexOf(m,q.getDate(),!0))):m=y()}else if(-1!==g.indexOf(".."))m=[],g=g.split("..."),1===g.length&&(g=g[0].split("..")),l=[],G=[],t=[],q=g[0],B=[],x=g[1],F=x.substr(x.length-4,4),v=x.substr(x.length-5,5),q=a.map(q.split("/"),r),3===q.length?B.push(new Date(q[0],q[1]-1,q[2])):2===q.length&&B.push(new Date(e-1,q[0]-1,q[1]),new Date(e,q[0]-1,q[1])),a.each(B,function(b){b.getFullYear()>
e||b.getFullYear()==e&&b.getMonth()>n?l=[]:b.getFullYear()==e&&b.getMonth()==n?(l=y(),l=l.slice(a.indexOf(l,b.getDate(),!0))):l=y();t.push(l)}),B=a.zip(B,t),a.each(B,function(b){var d=b[0];b=b[1];var c;if("date"===F||"week"===F||"year"===F||"dates"===v||"weeks"===v||"years"===v){var f;f="date"===F||"week"===F||"year"===F?r(x.substring(0,x.length-4)):r(x.substring(0,x.length-5));c=new Date(d.getTime());"date"===F||"dates"===v?c.setDate(c.getDate()+f):"week"===F||"weeks"===v?c.setDate(c.getDate()+7*
f):"year"!==F&&"years"!==v||c.setFullYear(c.getFullYear()+f)}else c=x.split("/"),c=a.map(c,r),3===c.length?c=new Date(c[0],c[1]-1,c[2]):(c=new Date(d.getFullYear(),c[0]-1,c[1]),c.getTime()<d.getTime()&&c.setFullYear(c.getFullYear()+1));c.getFullYear()<e||c.getFullYear()==e&&c.getMonth()<n?G=[]:c.getFullYear()==e&&c.getMonth()==n?(G=y(),G=G.slice(0,a.lastIndexOf(G,c.getDate(),!0)+1)):G=y();a.isEmpty(a.intersection(b,G))||(m=a.intersection(b,G))});else throw f('invalid selector "'+k+":"+g+'" in '+c[groupID].name+
".");else if("date"===k)m[m.length]=r(g);else if("month"===k)m=!D[g.toLowerCase()]&&r(g)!==n+1||D[g.toLowerCase()]&&D[g.toLowerCase()]!=n?[]:y();else if("day"===k)if(g.match(/^\d/))g=g.toLowerCase().match(/^(\d+)(?:st|[nr]d|th)-?(.+)$/),q=r(g[1]),m=[(w("day:"+g[2],e,n)||[])[q-1]];else if("last"===g.slice(0,4).toLowerCase()){var g=g.toLowerCase(),I=g.slice(4);"-"===I.charAt(0)&&(I=I.slice(1));m=[a.last(w("day:"+I,e,n))]}else I=z[g.toLowerCase()],a.some(u,function(a){""!==a[I]&&(m[m.length]=a[I])});
else if("year"===k)m="leap-year"===g||"leap_year"===g||"\u3046\u308b\u3046\u5e74"===g||"\u958f\u5e74"===g?N(e)?y():[]:r(g)!==e?[]:y();else throw f('undefined key "'+k+'".');for(;64===m[m.length-1];)m.pop();"day"===k&&(A[e-1950][n][d]=a.clone(m));return m}if(""===d)throw f("cannot exec empty selector.");d=t(v(d));u=u||[];var z=[];a.each(d,function(b){if(1===b[1])z[z.length]=w(b[0],e,p,u);else if(0===b[1])if("&&"===b[0])z.push(a.intersection(z.pop(),z.pop()));else if("||"===b[0])z.push(a.union(z.pop(),
z.pop()));else throw f("undefined operator "+b[0]);});if(1!=z.length)throw console.log(z,d),f("unexpected error in execSelectors().");return z.pop()}function v(a){function b(a){""!==a[0]&&(c[c.length]=a)}if(C[a])return C[a];for(var c=[],d=!1,f=0,e=0,h=a.length;e<h;e++){var k=a.charAt(e);if(d)'"'===k?d=!1:"\\"===k&&(e+=1);else if('"'===k)d=!0;else if(" "===k)b([a.substring(f,e),1]),k=a.substr(e).match(/^ (?:and|&&|\u304b\u3064|or|\|\||\u307e\u305f\u306f) |^ /)[0],b([{" ":"&&"," and ":"&&"," \u304b\u3064 ":"&&",
" && ":"&&"," or ":"||"," \u307e\u305f\u306f ":"||"," || ":"||"}[k],0]),f=e+k.length,e+=k.length;else if("("===k||")"===k)b([a.substring(f,e),1]),b([k,"("===k?2:3]),f=e+1}""!==a.substring(f)&&b([a.substring(f),1]);return C[a]=c}function t(a){for(var b=[],c=[],d={"||":0,"&&":1},e=0,h=a.length;e<h;e++)if(1===a[e][1])c[c.length]=a[e].concat();else if(0===a[e][1]){var k=a[e][0];b[b.length-1]&&d[k]<=d[b[b.length-1][0]]&&(c[c.length]=b.pop());b[b.length]=a[e]}else if(2===a[e][1])b[b.length]=a[e];else if(3===
a[e][1]){for(;2!=b[b.length-1][1];)if(c[c.length]=b.pop(),0===b.length)throw f("found mismatched parentheses");b.pop()}for(;0<b.length;){if(2===b[b.length-1][1])throw f("found mismatched parentheses.");c[c.length]=b.pop()}return c}var A=[],C={},p=[],E="",J=-1,L=-1;return{eventCalendar:function(c){var e=[],f=[],k=a.difference(d.following,d.hiddenGroup);if(b.year!==J||b.month!==L)J=b.year,L=b.month,p=[];else if(k.join(",")!==E||d.updated||a.any(k,function(a){return!0===a.updated}))p=[],E=k.join(",");
else return p[c]||[];for(var l=0,r=k.length;l<r;l++)e[e.length]=h(k[l],b.year,b.month);d.isHiddenGroup(-1)||(e[e.length]=h("private",b.year,b.month));l=0;for(r=e.length;l<r;l++)for(var t=0,v=e[l].length;t<v;t++){var n=e[l][t].date;f[n]||(f[n]=[]);f[n][f[n].length]=e[l][t].id+":"+e[l][t].group+":"+e[l][t].type}p=a.clone(f);E=k.join(",");return p[c]||[]},splitSelector:v,execSelectors:l}}]).run(["calendar","$timeout",function(a,c){function d(){var b=new Date;b.setDate(b.getDate()+1);b.setHours(0);b.setMinutes(0);
b.setSeconds(0);b.setMilliseconds(0);var h=new Date;a.today.year=h.getFullYear();a.today.month=h.getMonth();a.today.date=h.getDate();c(d,b-new Date)}var b=new Date;b.setDate(b.getDate()+1);b.setHours(0);b.setMinutes(0);b.setSeconds(0);b.setMilliseconds(0);c(d,b-new Date)}])})(window);
