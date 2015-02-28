angular.module(appName)
.controller('mainCtrl',['$scope','_','calendar','eventCal','mode','$mdSidenav',function($scope,_,calendar,eventCal,mode,$mdSidenav){//{{{
    $scope._=_;
    $scope.mode=mode;
    mode.editsEvent=false;
    mode.editsGroup=false;
    $scope.splitSelector=calendar.splitSelector;
    $scope.openNav=function(){
        $mdSidenav('left').toggle();
    };
    calendar.selected=calendar.date;
    $scope.eventCalendar=eventCal.eventCalendar;
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
            if(toInt(event[1])===0&&toInt(event[0])===-1){
                res='[mes]振替休日';
            }else if(toInt(event[1])===0&&toInt(event[0])===-2){
                res='[mes]国民の休日';
            }else{
                res=group[event[1]][event[2]][event[0]].name;
            }
        }
        if(removeMes!==false && res.indexOf('[mes]')===0){
            res=res.replace(/^\[mes\]/,'');
        }
        return res;
    };
}])//}}}
.run(['_','db','group','$rootScope','localStorageService',function(_,db,group,$rootScope,localStorageService){//{{{
    var o=_.clone(group)[0];
    if(localStorageService.get('group')){
        group.length=0;
        Array.prototype.push.apply(group,angular.fromJson(localStorageService.get('group')));
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
        localStorageService.set('group',angular.toJson(group));
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
            localStorageService.set('group',angular.toJson(group));
        });
    });
}])//}}}
;
