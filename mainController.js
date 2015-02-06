_.intersectionObjects =function(array) {
    var slice = Array.prototype.slice; // added this line as a utility
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
        return _.every(rest, function(other) {
            //return _.indexOf(other, item) >= 0;
            return _.any(other, function(element) { return _.isEqual(element, item); });
        });
    });
};
var appName='ladder';
angular.module(appName,[])
.controller('mainController',['$scope','group','user','eventForm',function($scope,group,user,eventForm){
    var disableHoverEvent=false;
    var selectClicked=false,otherClicked=false;
    $scope.group=group;
    $scope.user=user;
    $scope.eventForm=eventForm;
    $scope.eventForm.isEditMode=false;
    $scope.isGroupEditMode=false;
    $scope.showsHowToWrite=false;
    var calendar=(function(){
        var memo={};
        return function(year,month){
            if(memo[year+'/'+month]){
                return memo[year+'/'+month];
            }
            var first=new Date(year,month,1);
            var last;//来月の1日の1日前という算出方法をとる
            if(month==11){
                //12月の時は来月というのが来年の1月になる
                last=new Date(year+1,0,1);
            }else{
                last=new Date(year,month+1,1);
            }
            last.setDate(last.getDate()-1);
            var res=[];//カレンダー用配列
            res.year=year;
            res.month=month;
            var i=0;
            first=first.getDay();
            last=last.getDate();
            loop:while(true){
                var row=[];
                for(var j=1;j<=7;j++){
                    //i*7+j-first.getDay()でその部分の日付
                    if(i+j-first>0&&i+j-first<=last){
                        //日付が正常範囲に収まっている
                        row.push(i+j-first);
                    }else{
                        //来月もしくは先月の範囲の部分
                        row.push('');
                    }
                }
                res.push(row);
                if(row[row.length-1]==='') break;
                i+=7;
            }
            return memo[year+'/'+month]=res;
        }
    })();
    function findGroup(name){
        for(var i=0;i<$scope.group.length;i++){
            if($scope.group[i].name==name) return i;
        }
        return -1;
    }
    function filter(arr,year,month,groupID){
        var res=[];
        for(var i=0,j=arr.length;i<j;i++){
            if(arr[i].year===year&&arr[i].month===month){
                arr[i].group=groupID;
                arr[i].type='event';
                arr[i].id=i;
                res.push(arr[i]);
            }
        }
        return res;
    }
    var getEvents=(function(){
        var memo={};
        return function(groupID,year,month){
            if(groupID!=='private'&&!$scope.group[groupID].updated&&memo[groupID+':'+year+'/'+month]){
                $scope.group[groupID].updated=false;
                return memo[groupID+':'+year+'/'+month];
            }else{
                var res=[];
                var parent_res=[];
                if(groupID==='private'){
                    for(var i=0;i<$scope.user.following.length;i++){
                        parent_res=parent_res.concat(getEvents($scope.user.following[i],year,month));
                    }
                    res=res.concat(filter($scope.user.private.eventList,year,month,'private',parent_res));
                    parent_res=parent_res.concat(res);
                    res=res.concat(habit($scope.user.private.habit,year,month,'private',parent_res));
                    return res;
                }else{
                    if($scope.group[groupID].parents){
                        for(var i=0;i<$scope.group[groupID].parents.length;i++){
                            parent_res=parent_res.concat(getEvents($scope.group[groupID].parents[i],year,month));
                        }
                    }
                    res=res.concat(filter($scope.group[groupID].eventList,year,month,groupID,parent_res));
                    parent_res=parent_res.concat(res);
                    res=res.concat(habit($scope.group[groupID].habit,year,month,groupID,parent_res));
                    $scope.group[groupID].updated=false;
                    return memo[groupID+':'+year+'/'+month]=res;
                }
            }
        }
    })();
    function habit(arr,year,month,groupID,eventListRes){
        //arrは習慣の一覧,year,monthはそのまま
        //毎週何曜日、毎月20日みたいな処理をする
        //返り値は指定された月の具体的な日付がくっついた配列
        var all_res=[];
        var res=[];
        var cal=calendar(year,month);
        var day={
            'sunday':0,'sun':0,'日曜日':0,
            'monday':1,'mon':1,'月曜日':1,
            'tuesday':2,'tue':2,'火曜日':2,
            'wednesday':3,'wed':3,'水曜日':3,
            'thursday':4,'thu':4,'木曜日':4,
            'friday':5,'fri':5,'金曜日':5,
            'saturday':6,'sat':6,'土曜日':6
        };
        var monthDic={
            'January':0,'Jan':0,'睦月':0,
            'February':1,'Feb':1,'如月':1,
            'March':2,'Mar':2,'弥生':2,
            'April':3,'Apr':3,'卯月':3,
            'May':4,'皐月':4,
            'June':5,'Jun':5,'水無月':5,
            'July':6,'Jul':6,'文月':6,
            'August':7,'Aug':7,'葉月':7,
            'September':8,'Sep':8, '長月':8,
            'October':9,'Oct':9,'神無月':9,
            'November':10,'Nov':10,'霜月':10,
            'December':11,'Dec':11,'師走':11
        };
        for(var i=0;i<arr.length;i++){
            arr[i].type='habit';
            arr[i].group=groupID;
            var selectors=splitSelectors(arr[i].selector);
            var notSelectors=selectors[1];
            selectors=selectors[0];
            var exceptions=[];
            for(var or_i=0,or_j=selectors.length;or_i<or_j;or_i++){
                var mon=month;
                res=[];
                //or_iはselectors[or_i]。selectorsはorで分けられ、さらにandで分けられた配列になっているから
                if(arr[i].selector.indexOf('not:')!==-1){
                    //notフィルタがある場合
                    //このフィルタだけ分けてる理由は、後から取り除くよりも、追加前に確認し、当てはまったら追加しないという方が処理が楽だから
                    for(var j=0,j3=notSelectors.length;j<j3;j++){
                        if(notSelectors[j]==='public-holiday'||notSelectors[j]==='祝日'){
                            //祝日を除くフィルタ
                            var events=getEvents(0,year,mon);
                            for(var k=0;k<events.length;k++){
                                exceptions.push(events[k].date);
                            }
                        }else{
                            var key=notSelectors[j].split('=')[0];//not:name='なんとか'みたいにしてるから
                            var val=notSelectors[j].replace(/^.+?=/,'');//not:name='なんとか'みたいにしてるから
                            val=val.replace(/^"(.+)"$/,'$1');//name="なんとか"としていて valが"なんとか"になっている
                            for(var k=0;k<eventListRes.length;k++){
                                if(eventListRes[k][key]===val){
                                    //除外対象リストの構築
                                    exceptions.push(eventListRes[k].date);
                                }
                            }
                        }
                    }
                }
                exceptions=_.uniq(exceptions);
                exceptions.sort();
                if(arr[i].name==='自主練あり') console.log(JSON.stringify(exceptions));
                for(var i2=0,j2=selectors[or_i].length;i2<j2;i2++){
                    var key=selectors[or_i][i2][0];
                    var val=selectors[or_i][i2][1];
                    var tmp_res=[];
                    switch(key){
                        case 'date':
                            if(mon===month){
                                if(_.indexOf(exceptions,parseInt(val,10),true)===-1){
                                    tmp_res.push({year:year,month:mon,date:parseInt(val,10),name:arr[i].name,group:groupID,id:i,type:'habit'});
                                }
                            }
                            break;
                        case 'month':
                            if(monthDic[val]){
                                mon=monthDic[val];
                            }else{
                                mon=parseInt(val,10)-1;
                            }
                            break;
                        case 'day':
                            if(val.match(/^\d/)){
                                val=val.match(/^(\d+)(?:st|nd|rd|th)-?(.+)$/);
                                var ordinalNum=parseInt(val[1],10);
                                var valDay=day[val[2]];
                                var dayCount=0;
                                dayLoop:for(var j=0,j3=cal.length;j<j3;j++){
                                    if(cal[j][valDay]){
                                        j=j-1+ordinalNum;
                                        if(mon===month){
                                            if(_.indexOf(exceptions,cal[j][valDay],true)===-1){
                                                tmp_res.push({year:year,month:mon,date:cal[j][valDay],name:arr[i].name,group:groupID,id:i,type:'habit'});
                                            }
                                        }
                                        break dayLoop;
                                    }
                                }
                            }else{
                                val=val.match(/^(.+)$/);
                                var valDay=day[val[1]];
                                var dayCount=0;
                                for(var j=0,j3=cal.length;j<j3;j++){
                                    if(cal[j][valDay] && mon===month){
                                        if(_.indexOf(exceptions,cal[j][valDay],true)===-1){
                                            tmp_res.push({year:year,month:mon,date:cal[j][valDay],name:arr[i].name,group:groupID,id:i,type:'habit'});
                                        }
                                    }
                                }
                            }
                            break;
                    }
                    if(key!=='not'||key!=='month'){
                        if(res.length===0){
                            res=_.clone(tmp_res);
                        }else{
                            res=_.intersectionObjects(res,tmp_res);
                            //セレクタのand処理部分
                        }
                    }
                }
                all_res=all_res.concat(res);
            }
        }
        return all_res;
    }
    $scope.nextMonth=function(){
        $scope.month++;
        if($scope.month+1>12){
            $scope.year+=1;
            $scope.month-=12;
        }
        $scope.click('button');
    };
    $scope.lastMonth=function(){
        $scope.month--;
        if($scope.month+1<1){
            $scope.month+=12;
            $scope.year-=1;
        }
        $scope.click('button');
    };
    $scope.nextYear=function(){
        $scope.year++;
        $scope.click('button');
    };
    $scope.lastYear=function(){
        $scope.year--;
        $scope.click('button');
    };
    $scope.format=function(event){
        event=event.split(':');
        if(event[2]==='event'){
            if(event[1]=='private'){
                return $scope.user.private.eventList[event[0]].name;
            }else{
                return $scope.group[event[1]].eventList[event[0]].name;
            }
        }else{
            if(event[1]=='private'){
                return $scope.user.private.habit[event[0]].name;
            }else{
                return $scope.group[event[1]].habit[event[0]].name;
            }
        }
    };
    $scope.showHowToWrite=function(){
        $scope.showsHowToWrite=!$scope.showsHowToWrite;
    }
    function formatCalendar(calendar){
        var c=0;
        var res=[],row=[];
        res.push(calendar.year+'/'+(calendar.month+1));
        res.push([' S',' M',' T',' W',' T',' F',' S'].join(' '));
        for(var c=0;calendar[c];c++){
            row=[];
            for(var i=0,j=calendar[c].length;i<j;i++){
                row.push(('  '+calendar[c][i]).slice(-2));
            }
            row=row.join(' ');
            res.push(row);
        }
        return res.join('\n');
    }
    function splitSelectors(selector){
        var startString=null;
        var before=0;
        var selectors=[];
        var notSelectors=[];
        var i=0;
        var s=selector;
        var i1=s.indexOf('"',i+1);
        var i2=s.indexOf(' ',i+1);
        if(i1===-1) i1=Infinity;
        if(i2===-1) i2=Infinity;
        i=Math.min(i1,i2);
        var j=0;
        while(i>j&&i!==Infinity){
            if(selector.charAt(i)==='"'){
                if(startString===null){
                    startString=i;
                }else{
                    startString=null;
                }
            }
            if(selector.charAt(i)===' '&&startString===null){
                //startStringがnullつまり文字列中でないなら、区切る
                selectors.push(selector.substring(before,i));
                before=i+1;//スペースを含まないから
            }
            j=i;
            var i1=s.indexOf('"',i+1);
            var i2=s.indexOf(' ',i+1);
            if(i1===-1) i1=Infinity;
            if(i2===-1) i2=Infinity;
            i=Math.min(i1,i2);
        }
        selectors.push(selector.substring(before));
        for(var i=0,j=selectors.length;i<j;i++){
            if(selectors[i].indexOf(',')!=-1){
                var s=selectors[i];
                var elems=[];
                var startString=null;
                var before=0;
                var k1=s.indexOf('"');
                var k2=s.indexOf(',');
                if(k1===-1) k1=Infinity;
                if(k2===-1) k2=Infinity;
                k=Math.min(k1,k2);
                var l=0;
                while(k>l&&k!==Infinity){
                    if(s.charAt(k)==='"'){
                        if(startString===null){
                            startString=k;
                        }else{
                            startString=null;
                        }
                    }
                    if(s.charAt(k)===','&&startString===null){
                        //startStringがnullつまり文字列中でないなら、区切る
                        var elem=s.substring(before,k).split(':')
                        elems.push(elem);
                        if(elem[0]==='not'){
                            notSelectors.push(elems[elems.length-1][1]);
                        }
                        before=k+1;//スペースを含まないから
                    }
                    l=k;
                    var k1=s.indexOf('"',k+1);
                    var k2=s.indexOf(',',k+1);
                    if(k1===-1) k1=Infinity;
                    if(k2===-1) k2=Infinity;
                    k=Math.min(k1,k2);
                }
                var elem=s.substring(before).split(':')
                elems.push(elem);
                if(elem[0]==='not'){
                    notSelectors.push(elems[elems.length-1][1]);
                }
                elems.sort(function(a,b){
                    return a[0]=='month'?-1:1;
                });
                selectors[i]=elems;
            }else{
                selectors[i]=selectors[i].split(':');
                var key=selectors[i][0];
                selectors[i].splice(0,1);
                var val=selectors[i].join(':');
                selectors[i]=[];
                selectors[i].push([key,val]);
                if(key==='not'){
                    notSelectors.push(val);
                }
            }
        }
        return [selectors,notSelectors];
    }
    $scope.calendar=calendar;
    var today=new Date();
    $scope.year=today.getFullYear();
    $scope.month=today.getMonth();
    $scope.date=today.getDate();
    $scope.selected=$scope.date;
    $scope.search_keyword='';
    $scope.eventCalendar=function(date){
        var events=[];
        var eventCalendar=[]//日付と対応させているイベントカレンダー.フォーマットはcalendar()とは違うから注意
        for(var i=0,i2=user.following.length;i<i2;i++){
            events.push(getEvents(user.following[i],$scope.year,$scope.month));
        }
        events.push(getEvents('private',$scope.year,$scope.month));
        for(var i=0,i2=events.length;i<i2;i++){
            for(var j=0,j2=events[i].length;j<j2;j++){
                if(!eventCalendar[events[i][j].date]){
                    eventCalendar[events[i][j].date]=[];
                }
                eventCalendar[events[i][j].date].push(events[i][j].id+':'+events[i][j].group+':'+events[i][j].type);
            }
        }
        if(eventCalendar[date]){
            return eventCalendar[date];
        }else{
            return [];
        }
    };
    $scope.mouseenter=function(date){
        if(!disableHoverEvent){
            if(date){
                $scope.selected=date;
            }
        }
    };
    $scope.mouseleave=function(date){
        if(!disableHoverEvent){
            $scope.selected=null;
        }
    };
    $scope.select=function(date){
        $scope.selected=date;
        disableHoverEvent=true;
        selectClicked=true;
    }
    $scope.follow=function(id){
        //フォロー処理。一応ソートかけておく
        $scope.user.following.push(id);
        $scope.user.following.sort();
    };
    $scope.unfollow=function(id){
        //フォロー解除する。親グループが解除されそうになったら、確認取る。確認取れたら子グループも解除する。確認取れなかったら親の解除もキャンセル
        var unfollowList=[];
        unfollowList.push($scope.user.following.indexOf(id));
        for(var i=0,j=$scope.user.following.length;i<j;i++){
            //フォローしているものを回す
            if(group[$scope.user.following[i]].parents){
                //親要素がある
                if(parentsList($scope.user.following[i]).indexOf(id)!=-1){
                    //親にidが含まれている
                    if(!confirm('このグループの子グループ('+group[$scope.user.following[i]].name+')をフォローしています。このグループをフォロー解除するとこちらも解除になります。よろしいですか?')){
                        return;
                    }
                    unfollowList.push(i);
                }
            }
        }
        unfollowList.sort(function(a,b){return (b-a);});
        for(var i=0,j=unfollowList.length;i<j;i++){
            $scope.user.following.splice(unfollowList[i],1);
        }
    };
    function parentsList(groupID){
        if(!group[groupID].parents) return [];
        var res=group[groupID].parents;
        for(var i=0,j=group[groupID].parents.length;i<j;i++){
            res=parentsList(group[groupID].parents[i]).concat(res);
        }
        return res;
    }
    $scope.search=function(){
        //キーワードで検索する。例えば「新潟」で新潟高校がでるみたいな
        var res=[];
        if($scope.search_keyword==''){
            return res;
        }
        for(var i=0,j=$scope.group.length;i<j;i++){
            if($scope.group[i].name.indexOf($scope.search_keyword)!==-1){
                res.push(i);
            }
        }
        return res;
    };
    $scope.followsParent=function followsParent(groupID){
        var parents=parentsList(groupID);
        for(var i=0,j=parents.length;i<j;i++){
            if(!follows(parents[i])){
                return parents[i];
            }
        }
        return true;
    };
    function follows(id){
        return $scope.user.following.indexOf(id)!==-1;
    };
    $scope.follows=follows;
    $scope.click=function(name){
        //カレンダーの日付の選択の解除に使用。カレンダーの外側がクリックされていたら選択解除するだけ
        if(name=='setting'||name=='detail'||name=='button'||name=='how-to-write'){
            otherClicked=true;
        }else{
            if(name=='body'&&!selectClicked&&!otherClicked){
                disableHoverEvent=false;
                $scope.selected=null;
                $scope.eventForm.isEditMode=false;
            }
            selectClicked=false;
            otherClicked=false;
        }
    };
    $scope.bookedClass=function(date){
        return $scope.eventCalendar(date).length<5?'booked-'+$scope.eventCalendar(date).length:'booked-5'
    };
    $scope.switchToEdit=function(){
        //event= eventのid:groupのid:eventのtype(event or habit)
        arguments=Array.prototype.slice.call(arguments);
        if(arguments.length===1){
            //switchToEdit(event)の場合
            var event=arguments[0];
            $scope.eventForm.mode='edit';
            event=event.split(':');
            if(event[2]==='event'){
                if(event[1]==='private'){
                    $scope.eventForm.type=event[2];
                    $scope.eventForm.year=$scope.user.private.eventList[event[0]].year;
                    $scope.eventForm.month=$scope.user.private.eventList[event[0]].month+1;
                    $scope.eventForm.date=$scope.user.private.eventList[event[0]].date;
                    $scope.eventForm.name=$scope.user.private.eventList[event[0]].name;
                    $scope.eventForm.id=event[0];
                    $scope.eventForm.selectedGroup=event[1];
                }else{
                    $scope.eventForm.type=event[2];
                    $scope.eventForm.year=group[event[1]].eventList[event[0]].year;
                    $scope.eventForm.month=group[event[1]].eventList[event[0]].month+1;
                    $scope.eventForm.date=group[event[1]].eventList[event[0]].date;
                    $scope.eventForm.name=group[event[1]].eventList[event[0]].name;
                    $scope.eventForm.id=event[0];
                    $scope.eventForm.selectedGroup=parseInt(event[1],10);
                }
            }else if(event[2]==='habit'){
                if(event[1]==='private'){
                    $scope.eventForm.type=event[2];
                    $scope.eventForm.rule=$scope.user.private.habit[event[0]].selector;
                    $scope.eventForm.name=$scope.user.private.habit[event[0]].name;
                    $scope.eventForm.id=event[0];
                    $scope.eventForm.selectedGroup=event[1];
                }else{
                    $scope.eventForm.type=event[2];
                    $scope.eventForm.rule=group[event[1]].habit[event[0]].selector;
                    $scope.eventForm.name=group[event[1]].habit[event[0]].name;
                    $scope.eventForm.id=event[0];
                    $scope.eventForm.selectedGroup=parseInt(event[1],10);
                }
            }
        }else if(arguments.length===3){
            //switchToEdit(year,month,date)の場合
            $scope.eventForm.mode='add';
            $scope.eventForm.type='event';
            $scope.eventForm.rule='';
            $scope.eventForm.id=0;
            $scope.eventForm.name='';
            $scope.eventForm.year=arguments[0];
            $scope.eventForm.month=arguments[1]+1;
            $scope.eventForm.date=arguments[2];
        }
        $scope.eventForm.isEditMode=true;
    };
    $scope.makeAGroup=function(){
        $scope.isGroupEditMode=true;
    };
}]);