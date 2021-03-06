angular.module(appName)
.controller('settingCtrl',function($scope,_,group,user,db,eventListToEdit,groupForm,mode,$mdSidenav,$mdToast,$mdDialog){//{{{
    $scope.group=group;
    $scope.user=user;
    $scope.groupForm=groupForm;
    $scope.search_keyword='';
    $scope.searchResult=[];
    $scope.hide=function(id){//{{{
        user.hiddenGroup[user.hiddenGroup.length]=id;
        user.hiddenGroup.sort(sortByNumber);
        user.save();
        db.updateUser();
    };//}}}
    $scope.show=function(id){//{{{
        user.hiddenGroup=_.without(user.hiddenGroup,id);
        user.save();
        db.updateUser();
    };//}}}
    $scope.followsParent=function followsParent(groupID){//{{{
        var parents=parentsList(groupID);
        for(var i=0,_i=parents.length;i<_i;i++){
            if(!follows(parents[i])){
                return parents[i];
            }
        }
        return true;
    };//}}}
    $scope.toggleNav=function(){
        $mdSidenav('left').close();
    };
    function follows(id){return user.following.indexOf(id)!==-1;};
    $scope.follows=follows;
    $scope.follow=function(id){//{{{
        //フォロー処理。一応ソートかけておく
        user.follow(id);
        $mdToast.show($mdToast.simple().content(group[id].name+'をフォローしました').position('top right').hideDelay(3000));
    };//}}}
    $scope.unfollow=function(id){//{{{
        //フォロー解除する。親グループが解除されそうになったら、確認取る。確認取れたら子グループも解除する。確認取れなかったら親の解除もキャンセル
        var unfollowList=[];
        unfollowList[unfollowList.length]=user.following.indexOf(id);
        for(var i=0,_i=user.following.length;i<_i;i++){
            //フォローしているものを回す
            if(group[user.following[i]].parents){
                //親要素がある
                if(parentsList(user.following[i]).indexOf(id)!==-1){
                    //親にidが含まれている
                    if(!confirm('このグループの子グループ('+group[user.following[i]].name+')をフォローしています。このグループをフォロー解除するとこちらも解除になります。よろしいですか?')){
                        return;
                    }
                    unfollowList[unfollowList.length]=i;
                }
            }
        }
        unfollowList.sort(function(a,b){return (b-a);});
        for(var i=0,_i=unfollowList.length;i<_i;i++){
            user.following.splice(unfollowList[i],1);
        }
        user.save();
        db.updateUser();
    };//}}}
    $scope.showEventList=function(id){
        eventListToEdit.id=id;
        mode.showsEventList=true;
    };
    function parentsList(groupID){
        if(!group[groupID].parents) return [];
        var res=group[groupID].parents;
        for(var i=0,_i=group[groupID].parents.length;i<_i;i++){
            res=parentsList(group[groupID].parents[i]).concat(res);
        }
        return res;
    }
    $scope.makeGroup=function(){
        mode.editsGroup=true;
        $mdSidenav('left').close();
    };
    $scope.search=function(){//{{{
        //キーワードで検索する。例えば「新潟」で新潟高校がでるみたいな
        var res=[];
        if($scope.search_keyword===''){
            return res;
        }
        if(!group){
            return res;
        }
        var keyword=toHiragana($scope.search_keyword);
        for(var i=0,_i=group.length;i<_i;i++){
            if(res.length>30) break;
            if(group[i] && (group[i].name && toHiragana(group[i].name).indexOf(keyword)!==-1 || group[i].description && toHiragana(group[i].description).indexOf(keyword)!==-1)){
                res[res.length]=i;
            }
        }
        $scope.searchResult=res;
    };//}}}
    $scope.randomSearch=function(){//{{{
        //ランダム検索
        var res=[];
        if(group.length<5){
            res.push.apply(res,group);
        }else{
            while(res.length<5){
                var elm=(Math.random()*group.length)|0;
                if(_.indexOf(res,elm)===-1){
                    res[res.length]=elm;
                }
            }
        }
        $scope.searchResult=res;
    };//}}}
    $scope.hideAll=function(){//{{{
        user.hiddenGroup.length=0;
        user.hiddenGroup=_.clone(user.following);
        user.hiddenGroup[user.hiddenGroup.length]=-1;//privateのidが-1
        user.hiddenGroup.sort(sortByNumber);
        user.save();
        db.updateUser();
    };//}}}
    $scope.showAll=function(){//{{{
        user.hiddenGroup=[];
        user.save();
        db.updateUser();
    };//}}}
    $scope.loginMode=_.bind(mode.switchToLogin,mode);
});//}}}
