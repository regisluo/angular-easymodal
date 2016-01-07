    var easyModalApp = angular.module("easyModalApp", ['emodalService']);

    easyModalApp.controller("easyAlertController",['$scope','emodal',function ($scope, emodal) {
        $scope.showModal1 = function(){emodal.alert("Messages go here!");};
        $scope.showModal2 = function(){emodal.alert("<strong>Disappear in 2 seconds</strong>",
                                                      {okLabel:'New Label',okClass:'btn btn-success',fadein:2000}
                                                     );
        };
    }]);

    easyModalApp.controller("easyConfirmController",['$scope','emodal', function ($scope, emodal) {
        $scope.showModal1 = function(){
           emodal.confirm("Are you sure to delete?",
               function(){
                   $scope.data='You have clicked OK!';
               },
               function(){
                   $scope.data='You have clicked Cancel!';
               }
           );
        };
        $scope.showModal2 = function(){
            emodal.confirm("It is not recoverable!",
                function(){
                    $scope.data='You have clicked YES!';
                },
                function(){
                    $scope.data='You have clicked NO!';
                },
                {
                    title:'Are you sure to delete?',
                    okLabel:'YES',
                    okClass:'btn btn-success',
                    cancelLabel:'NO',
                    cancelClass:'btn btn-danger'
                }
            );
        };
        $scope.showModal3 = function(){
            emodal.confirm("Args passed into callback!",
                function(arg){
                    $scope.data='You have clicked OK! Arg is: '+arg.info;
                },
                function(arg){
                    $scope.data='You have clicked Cancel! Arg is: '+arg.info;
                },
                {
                    title:'Confirm dialog can also accept args!',
                    okArgs:{info:true},
                    cancelArgs:{info:false}
                }
            );
        };
    }]);

    easyModalApp.controller("easyModalController",['$scope','emodal',function ($scope, emodal) {
        $scope.showModal1 = function(){
            emodal.modal({template:'Messages go here!',cancelShow:true});
        };
        $scope.showModal2 = function(){
            emodal.modal("../partials/externalTemplate.html",
                {title:'Title Here',
                 okLabel:'Submit'});
        };
        $scope.showModal3 = function(){
            emodal.modal("../partials/externalTemplate.html",
                {
                title:'Callback Function',
                okCallback:okCallbackFun,
                okArgs:{id:1},
                cancelCallback:cancelCallbackFun,
                cancelArgs:{info:'some text'}
               });
        };
        $scope.showModal4 = function(){
            emodal.modal({
                template:'<strong>Message from external controller:</strong><p></p>{{data}}',
                title:'External Controller',
                controller:'externalController'
            });
        };
        $scope.showModal5 = function(){
            emodal.modal({
                template:'There are two extra buttons!',
                title:'Extra Buttons Demo',
                okCallback:okCallbackFun,
                okArgs:{id:1},
                cancelCallback:cancelCallbackFun,
                cancelArgs:{info:'some text'},
                buttons:[
                           {label:'Extra-1',class:'btn btn-warning',callback:extraCallBackFun1,args:{info:'from extra button 1'}},
                           {label:'Extra-2',class:'btn btn-success',callback:extraCallBackFun2,args:{info:'from extra button 2'}}
                         ]
            });
        };
        var okCallbackFun = function (arg) {
            $scope.data = '[ok callback] Parameter: '+arg.id;
        };
        var cancelCallbackFun = function (arg) {
            $scope.data = '[cancel callback] Parameter: '+arg.info;
        };
        var extraCallBackFun1 = function (arg) {
            $scope.data = '[extra callback 1] Parameter: '+arg.info;
        };
        var extraCallBackFun2 = function (arg) {
            $scope.data = '[extra callback 2] Parameter: '+arg.info;
        };
    }]);
    
    easyModalApp.controller("externalController",['$scope', function ($scope) {
        $scope.data = 'hello from externalController!';
    }]);