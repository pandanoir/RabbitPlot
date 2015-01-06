var appName='rabbit';
var QUOTATION=0;
angular.module(appName,['ngTouch','ngAnimate'])
.controller('mainController',['$scope','eventForm','calF','eventCal','$timeout','$filter','$sce',function($scope,eventForm,calendar,eventCal,$timeout,$filter,$sce){//{{{
    $scope._=_;
    $scope.eventForm=eventForm;
    $scope.calF=calendar;
    $scope.eventForm.isEditMode=false;
    $scope.showsHowToWrite=false;
    $scope.showsSetting=false;
    $scope.showsDialog=false;
    $scope.showsDialogButton=false;
    $scope.showsInputDialog=false;
    $scope.dialogMessage='';
    $scope.dialogInputValue='';
    $scope.showHowToWrite=function(){
        $scope.showsHowToWrite=!$scope.showsHowToWrite;
    }
    $scope.splitSelector=eventCal.splitSelector;
    var today=new Date();
    var dialogCallback=angular.noop;
    $scope.calF.selected=$scope.calF.date;
    $scope.eventCalendar=eventCal.eventCalendar;
    $scope.dialog=function(){//{{{
        var arg=Array.prototype.slice.call(arguments);
        var mes,val,showsDialog,showsInputDialog,time,focus,locked;
        if($scope.locked) return;
        if(arg.length===1){
            if(angular.isString(arg[0])){
                mes=arg[0];
            }else{
                mes=arg[0]['mes'];
                val=arg[0]['val']||'';

                if(angular.isUndefined(arg[0]['showsDialog'])) showsDialog=false;
                else showsDialog=arg[0]['showsDialog'];

                if(angular.isUndefined(arg[0]['showsInputDialog'])) showsInputDialog=false;
                else showsInputDialog=arg[0]['showsInputDialog'];

                if(showsDialog===false && showsInputDialog===false){
                    showsDialog=true;
                }
                if(!angular.isUndefined(arg[0]['dialogType'])){
                    //showsDialogよりshowsInputDialogより優先
                    if(arg[0]['dialogType']==='dialog'){
                        showsDialog=true;
                        showsInputDialog=false;
                    }else if(arg[0]['dialogType']==='input'){
                        showsDialog=false;
                        showsInputDialog=true;
                    }
                }
                locked=arg[0]['locked']||false;
                focus=arg[0]['focus'];
                time=arg[0]['time'];
                dialogCallback=arg[0]['callback']||angular.noop;
            }
        }else if(arg.length===2){
            mes=arg[0];
            time=arg[1];
        }
        $scope.showsDialog=showsDialog;
        $scope.showsInputDialog=showsInputDialog;
        $scope.focus=focus;
        $scope.locked=locked;
        if(angular.isString(mes)){
            $scope.dialogMessage=mes;
        }else{
            $scope.dialogMessage=angular.toJson(mes);
        }

        if(angular.isString(val)){
            $scope.dialogInputValue=val;
        }else{
            $scope.dialogInputValue=angular.toJson(val);
        }
        if(time!==true){
            $scope.showsDialogButton=false;
            $timeout(function(){
                $scope.showsDialog=false;
                $scope.showsInputDialog=false;
                $scope.locked=false;
            },time||800);
        }else{
            $scope.showsDialogButton=true;
        }
        console.log($scope);
    };//}}}
    $scope.hideDialog=function(){
        dialogCallback($scope.dialogInputValue);
        $scope.showsDialog=false;
        $scope.showsInputDialog=false;
        $scope.locked=false;
    };
}])//}}}
.config(['$httpProvider',function ($httpProvider) {//{{{
    $httpProvider.defaults.transformRequest = function(data){
        function serializeData(data) { 
            // If this is not an object, defer to native stringification.
            if (! angular.isObject(data)) {return((data == null) ? "" : data.toString());}
            var buffer = [];
            // Serialize each key in the object.
            for (var name in data) { 
                if (!data.hasOwnProperty(name)) {continue;}
                var value = data[name];
                buffer[buffer.length]=encodeURIComponent(name)+"="+encodeURIComponent((value == null) ? "" : value); 
            }
            // Serialize the buffer and clean it up for transportation.
            var source = buffer.join("&").replace(/%20/g, "+"); 
            return source; 
        }
        if (data === undefined) {return data;}
        return serializeData(data);
    }
    $httpProvider.defaults.headers.post={'Content-Type': 'application/x-www-form-urlencoded'};
}])//}}}
.filter('format',['group','user',function(group,user){//{{{
    return function(event,removeMes){
        event=event.split(':');
        //event[2]はhabit or eventだからこれでok
        var res='';
        if(event[1]=='private'){
            res=user['private'][event[2]][event[0]].name;
        }else{
            res=group[event[1]][event[2]][event[0]].name;
        }
        if(removeMes!==false && res.indexOf('[mes]')===0){
            res=res.replace(/^\[mes\]/,'');
        }
        return res;
    };
}])//}}}
.run(['db','group','$rootScope',function(db,group,$rootScope){//{{{
    var o={//{{{
        id:0,
        event:[
            {name:'春分の日',year:2000,month:2,date:20},{name:'秋分の日',year:2000,month:8,date:23},
            {name:'春分の日',year:2001,month:2,date:20},{name:'秋分の日',year:2001,month:8,date:23},
            {name:'春分の日',year:2002,month:2,date:21},{name:'秋分の日',year:2002,month:8,date:23},
            {name:'春分の日',year:2003,month:2,date:21},{name:'秋分の日',year:2003,month:8,date:23},
            {name:'春分の日',year:2004,month:2,date:20},{name:'秋分の日',year:2004,month:8,date:23},
            {name:'春分の日',year:2005,month:2,date:20},{name:'秋分の日',year:2005,month:8,date:23},
            {name:'春分の日',year:2006,month:2,date:21},{name:'秋分の日',year:2006,month:8,date:23},
            {name:'春分の日',year:2007,month:2,date:21},{name:'秋分の日',year:2007,month:8,date:23},
            {name:'春分の日',year:2008,month:2,date:20},{name:'秋分の日',year:2008,month:8,date:23},
            {name:'春分の日',year:2009,month:2,date:20},{name:'秋分の日',year:2009,month:8,date:23},
            {name:'春分の日',year:2010,month:2,date:21},{name:'秋分の日',year:2010,month:8,date:23},
            {name:'春分の日',year:2011,month:2,date:21},{name:'秋分の日',year:2011,month:8,date:23},
            {name:'春分の日',year:2012,month:2,date:20},{name:'秋分の日',year:2012,month:8,date:22},
            {name:'春分の日',year:2013,month:2,date:20},{name:'秋分の日',year:2013,month:8,date:23},
            {name:'春分の日',year:2014,month:2,date:21},{name:'秋分の日',year:2014,month:8,date:23},
            {name:'春分の日',year:2015,month:2,date:21},{name:'秋分の日',year:2015,month:8,date:23},
            {name:'春分の日',year:2016,month:2,date:20},{name:'秋分の日',year:2016,month:8,date:22},
            {name:'春分の日',year:2017,month:2,date:20},{name:'秋分の日',year:2017,month:8,date:23},
            {name:'春分の日',year:2018,month:2,date:21},{name:'秋分の日',year:2018,month:8,date:23},
            {name:'春分の日',year:2019,month:2,date:21},{name:'秋分の日',year:2019,month:8,date:23},
            {name:'春分の日',year:2020,month:2,date:20},{name:'秋分の日',year:2020,month:8,date:22},
            {name:'春分の日',year:2021,month:2,date:20},{name:'秋分の日',year:2021,month:8,date:23},
            {name:'春分の日',year:2022,month:2,date:21},{name:'秋分の日',year:2022,month:8,date:23},
            {name:'春分の日',year:2023,month:2,date:21},{name:'秋分の日',year:2023,month:8,date:23},
            {name:'春分の日',year:2024,month:2,date:20},{name:'秋分の日',year:2024,month:8,date:22},
            {name:'春分の日',year:2025,month:2,date:20},{name:'秋分の日',year:2025,month:8,date:23},
            {name:'春分の日',year:2026,month:2,date:20},{name:'秋分の日',year:2026,month:8,date:23},
            {name:'春分の日',year:2027,month:2,date:21},{name:'秋分の日',year:2027,month:8,date:23},
            {name:'春分の日',year:2028,month:2,date:20},{name:'秋分の日',year:2028,month:8,date:22},
            {name:'春分の日',year:2029,month:2,date:20},{name:'秋分の日',year:2029,month:8,date:23},
            {name:'春分の日',year:2030,month:2,date:20},{name:'秋分の日',year:2030,month:8,date:23},

            {name:'十五夜',year:2000,month:8,date:12},{name:'十五夜',year:2001,month:9,date:1},
            {name:'十五夜',year:2002,month:8,date:21},{name:'十五夜',year:2003,month:8,date:11},
            {name:'十五夜',year:2004,month:8,date:28},{name:'十五夜',year:2005,month:8,date:18},
            {name:'十五夜',year:2006,month:9,date:6},{name:'十五夜',year:2007,month:8,date:25},
            {name:'十五夜',year:2008,month:8,date:14},{name:'十五夜',year:2009,month:9,date:3},
            {name:'十五夜',year:2010,month:8,date:22},{name:'十五夜',year:2011,month:8,date:12},
            {name:'十五夜',year:2012,month:8,date:30},{name:'十五夜',year:2013,month:8,date:19},
            {name:'十五夜',year:2014,month:8,date:8},{name:'十五夜',year:2015,month:8,date:27},
            {name:'十五夜',year:2016,month:8,date:15}
        ],
        habit:[
            {name:'元旦',selector:'month:1 date:1'},{name:'成人の日',selector:'month:1 day:2nd-mon'},
            {name:'昭和の日',selector:'month:4 date:29'},{name:'建国記念日',selector:'month:2 date:11'},
            {name:'憲法記念日',selector:'month:5 date:3'},{name:'みどりの日',selector:'month:5 date:4'},
            {name:'こどもの日',selector:'month:5 date:5'},{name:'海の日',selector:'month:7 day:3rd-mon'},
            {name:'敬老の日',selector:'month:9 day:3rd-mon'},{name:'体育の日',selector:'month:10 day:2nd-mon'},
            {name:'文化の日',selector:'month:11 date:3'},{name:'勤労感謝の日',selector:'month:11 date:23'},
            {name:'天皇誕生日',selector:'month:12 date:23'}
        ],
        name:'休日',
        updated:true
    };//}}}
    if(localStorage&&localStorage.getItem('group')){
        group.length=0;
        Array.prototype.push.apply(group,angular.fromJson(localStorage.getItem('group')));
        group[0]=_.clone(o);
    }
    db.list().then(function(mes){
        mes=mes.data;
        for(var i=0,i2=mes.length;i<i2;i++){
            for(var key in mes[i]){
                mes[i][key]=angular.fromJson(mes[i][key]);
            }
            mes[i].updated=true;
        }
        mes.sort(function(a,b){return a.id-b.id});
        group.length=0;
        for(var i=0,i2=mes.length;i<i2;i++){
            group[mes[i].id]=mes[i];
        }
        group[0]=_.clone(o);
        $rootScope.$broadcast('updated');
        localStorage.setItem('group',angular.toJson(group));
        db.getNameList().then(function(mes){
            for(var i=0,i2=mes.data[0].length;i<i2;i++){
                if(!group[i]){
                    group[i]={
                        name:angular.fromJson(mes.data[0][i])
                    };
                    if(mes.data[1][i]){
                        group[i].parents=angular.fromJson(mes.data[1][i]);
                    }
                }
            }
            group[0]=_.clone(o);
            localStorage.setItem('group',angular.toJson(group));
        });
    });
}])//}}}
.directive('appDate',[function(){//{{{
    return {
        scope:{'row':'=appRow'},
        restrict:'A',
        template:'<span class="date" ng-transclude></span>',
        transclude:true,
        replace:true,
        controller:['$scope','calF','eventCal','$filter',function($scope,calendar,eventCal,$filter){
            $scope.calendar=calendar;
            $scope.bookedClass=function(date){
                var tmpCalendar=eventCal.eventCalendar(date);
                var len=0;
                for(var i=0,i2=tmpCalendar.length;i<i2;i++){
                    if($filter('format')(tmpCalendar[i],false).indexOf('[mes]')!==0){
                        len++;
                    }
                }
                if(len<5){
                    return 'booked-'+len;
                }else{
                    return 'booked-5';
                }
            };
            $scope.dateClass=function(date){
                var calendar=$scope.calendar;
                var res=[];
                if(calendar.selected===date) res[res.length]='selected';
                res[res.length]=$scope.bookedClass(date);
                if(date===calendar.today.date&&calendar.month===calendar.today.month&&calendar.year===calendar.today.year){
                    res[res.length]='today';
                }
                return res;
            }
        }],
        link:function(scope,elm,attrs){
            var date=scope.row[attrs['appDate']];
            if(date!==''&&date!==undefined){
                function updateClass(){
                    elm.removeClass('selected booked-0 booked-1 booked-2 booked-3 booked-4 booked-5 today');
                    elm.addClass(scope.dateClass(date).join(' '));
                }
                scope.$on('updated',updateClass);
                updateClass();
                elm.on('mouseenter',function(){
                    if(!scope.calendar.disableHoverEvent){
                        if(date){
                            scope.calendar.selected=date;
                            angular.element(document.querySelectorAll('.selected')).removeClass('selected');
                            updateClass();
                            scope.$apply();
                        }
                    }
                });
                elm.on('mouseleave',function(){
                    if(!scope.calendar.disableHoverEvent){
                        scope.calendar.selected=null;
                        angular.element(document.querySelectorAll('.selected')).removeClass('selected');
                        scope.$apply();
                    }
                });
                elm.on('click',function(){
                    if(scope.calendar.selected===date){
                        scope.calendar.disableHoverEvent=!scope.calendar.disableHoverEvent;
                    }else{
                        scope.calendar.disableHoverEvent=true;
                    }
                    scope.calendar.selected=date;
                    angular.element(document.querySelectorAll('.selected')).removeClass('selected');
                    updateClass();
                    scope.$apply();
                });
            }
        }
    };
}]);//}}}
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
_.unionObjects=function(){
    var res=[];
    _.each(Array.prototype.slice.call(arguments),function(obj){
        _.each(obj,function(arr){
            if(!_.some(res,function(a){return _.isEqual(a,arr);})){
                res.push(arr);
            }
        });
    });
    return res;

};
