angular.module(appName)
.controller('eventListCtrl',['$scope','group','user','eventListToEdit','eventForm',function($scope,group,user,eventListToEdit,eventForm){//{{{
    $scope.eventListToEdit=eventListToEdit;
    $scope.group=group;
    $scope.user=user;
    $scope.habitList= eventListToEdit.id!=='private' ? group[eventListToEdit.id].habit : user['private'].habit;
    $scope.eventList= eventListToEdit.id!=='private' ? group[eventListToEdit.id].event : user['private'].event;
    $scope.switchToEdit=function(){//{{{
        //event= eventのid:groupのid:eventのtype(event or habit)
        arguments=Array.prototype.slice.call(arguments);
        if(arguments.length===1){//{{{
            //switchToEdit(event)の場合
            var event=arguments[0];
            $scope.eventForm.mode='edit';
            event=event.split(':');
            eventForm.type=event[2];
            eventForm.id=event[0];
            if(event[1]!=='private'){
                eventForm.selectedGroup=parseInt(event[1],10);
            }else{
                eventForm.selectedGroup=event[1];
            }
            if(event[2]==='event'){
                if(event[1]==='private'){
                    eventForm.year=user['private'].event[event[0]].year;
                    eventForm.month=user['private'].event[event[0]].month+1;
                    eventForm.date=user['private'].event[event[0]].date;
                    eventForm.name=user['private'].event[event[0]].name;
                }else{
                    eventForm.year=group[event[1]].event[event[0]].year;
                    eventForm.month=group[event[1]].event[event[0]].month+1;
                    eventForm.date=group[event[1]].event[event[0]].date;
                    eventForm.name=group[event[1]].event[event[0]].name;
                }
            }else if(event[2]==='habit'){
                if(event[1]==='private'){
                    eventForm.rule=user['private'].habit[event[0]].selector;
                    eventForm.name=user['private'].habit[event[0]].name;
                }else{
                    eventForm.rule=group[event[1]].habit[event[0]].selector;
                    eventForm.name=group[event[1]].habit[event[0]].name;
                }
            }//}}}
        }else if(arguments.length===2&&arguments[1]===true){//{{{
            //switchToEdit(event,true);で、複製モードの時
            var event=arguments[0];
            $scope.eventForm.mode='add';
            event=event.split(':');
            eventForm.type=event[2];
            eventForm.id=0;
            if(event[1]!=='private'){
                eventForm.selectedGroup=parseInt(event[1],10);
            }else{
                eventForm.selectedGroup=event[1];
            }
            if(event[2]==='event'){
                if(event[1]==='private'){
                    eventForm.year=user['private'].event[event[0]].year;
                    eventForm.month=user['private'].event[event[0]].month+1;
                    eventForm.date=user['private'].event[event[0]].date;
                    eventForm.name=user['private'].event[event[0]].name;
                }else{
                    eventForm.year=group[event[1]].event[event[0]].year;
                    eventForm.month=group[event[1]].event[event[0]].month+1;
                    eventForm.date=group[event[1]].event[event[0]].date;
                    eventForm.name=group[event[1]].event[event[0]].name;
                }
            }else if(event[2]==='habit'){
                if(event[1]==='private'){
                    eventForm.rule=user['private'].habit[event[0]].selector;
                    eventForm.name=user['private'].habit[event[0]].name;
                }else{
                    eventForm.rule=group[event[1]].habit[event[0]].selector;
                    eventForm.name=group[event[1]].habit[event[0]].name;
                }
            }//}}}
        }else if(arguments.length===3){//{{{
            //switchToEdit(year,month,date)の場合
            eventForm.mode='add';
            eventForm.type='event';
            eventForm.rule='';
            eventForm.id=0;
            eventForm.name='';
            eventForm.year=arguments[0];
            eventForm.month=arguments[1]+1;
            eventForm.date=arguments[2];
        }//}}}
        $scope.eventForm.isEditMode=true;
    };//}}}
}]);
