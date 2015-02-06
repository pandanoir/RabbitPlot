angular.module(appName)
.controller('calendarCtrl',['$scope','calF','mode',function($scope,calendar,mode){
    $scope.calF=calendar;
    $scope.nextMonth=function(){//{{{
        $scope.calF.month++;
        $scope.calF.selected=null;
        if($scope.calF.month+1>12){
            $scope.calF.year+=1;
            $scope.calF.month-=12;
        }
        mode.editsEventForm=false;
    };//}}}
    $scope.lastMonth=function(){//{{{
        $scope.calF.month--;
        $scope.calF.selected=null;
        if($scope.calF.month+1<1){
            //1月より前==前年の12月だから繰り下げ
            if($scope.calF.year-1<MEMO_LIMIT){
                alert(MEMO_LIMIT+'年より以前はパフォーマンスの関係で表示できません。');
                //calendar()関数のメモ化の関係
                $scope.calF.month+=1;
            }else{
                $scope.calF.month+=12;
                $scope.calF.year-=1;
            }
        }
        mode.editsEventForm=false;
    };//}}}
    $scope.nextYear=function(){//{{{
        $scope.calF.year++;
        $scope.calF.selected=null;
        mode.editsEventForm=false;
    };//}}}
    $scope.lastYear=function(){//{{{
        if($scope.calF.year-1<MEMO_LIMIT){
            alert(MEMO_LIMIT+'年より以前はパフォーマンスの関係で表示できません。');
        }else{
            $scope.calF.year--;
            $scope.calF.selected=null;
        }
        mode.editsEventForm=false;
    };//}}}
}]);
