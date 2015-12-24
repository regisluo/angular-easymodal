    var easyModalApp = angular.module("easyModalApp", ['easyModalService']);
    /**
     * @description simple alert modal.
     * emodal.alert(arg1,agr2,arg3) {function}
     * @param arg1:{string}.required. The message that will be shown in the modal.
     * @param arg2:{string}.optional.The customized button label.Default is "OK".
     *         OR
     *        {number}.optional. MillionSeconds that the modal vanish.
     * @param arg3:{number}.If arg2 is provided,arg3 is {number}: MillionSeconds that the modal vanish.
     */
    easyModalApp.controller("easyAlertController",['$scope','emodal',function ($scope, emodal) {
        $scope.showModal1 = function(){emodal.alert("Messages go here!");};
        $scope.showModal2 = function(){emodal.alert("Messages go here!","New Button Label");};
        $scope.showModal3 = function(){emodal.alert("<strong>Title</strong> <p></p>Disappear in 2 seconds",2000);};
        $scope.showModal4 = function(){emodal.alert("<strong>Title</strong><p></p>Disappear in 2 seconds","New Button Label",2000);};
    }]);

    /**
     * @description simple confirm modal
     * emodal.confirm(arg1,agr2,arg3) {function}
     * OR
     * emodal.confirm(arg1,agr2,arg3,arg4,arg5) {function}
     *
     * @param arg1:{string}.required. The message that will be shown in the modal.
     * @param arg2:{function}.required.Callback function after "OK" is pressed.
     * @param arg3:{function}.optional.Callback function after "Cancel" is pressed.
     * OR
     * @param arg1:{string}.required. The message that will be shown in the modal.
     * @param arg2:{string}.required. The customized button label.Default is "OK".
     * @param arg3:{string}.required. The customized button label.Default is "Cancel".
     * @param arg4:{function}.required.Callback function after "OK" is pressed.
     * @param arg5:{function}.optional.Callback function after "Cancel" is pressed.
     */
    easyModalApp.controller("easyConfirmController",['$scope','emodal', function ($scope, emodal) {
        $scope.showModal1 = function(){
           emodal.confirm("Are you sure to delete?<p></p>It is not recoverable!",
               function(){
                   $scope.data='You have pressed OK!';
               },
               function(){
                   $scope.data='You have pressed Cancel!';
               }
           );
        };
        $scope.showModal2 = function(){
            emodal.confirm("Are you sure to delete?<p></p>It is not recoverable!",
                "New OK Label","New Cancel Label",
                function(){console.log('deleted.')},
                function(){console.log('canceled.')});
        };
    }]);
    /**
     * @description create a basic modal
     * emodal.modal(templateURL,{}) {function}
     * 
     * @param templateURL:{string}. optional. External HTML template URL.
     * @param {}:{object}.required. Please refer to easyModal.js for details.
     */
    easyModalApp.controller("easyModalController",['$scope','emodal',function ($scope, emodal) {
        var successCallbackFun = function (arg) {
            $scope.data = '[success callback] Parameter: '+arg.id;
        };
        var cancelCallbackFun = function (arg) {
            $scope.data = '[cancel callback] Parameter: '+arg.info;
        };
        $scope.showModal1 = function(){
            emodal.modal({template:'Messages go here!',title:'',cancel:{label:'Cancel',show:true}});
        };
        $scope.showModal2 = function(){
            emodal.modal("../partials/externalTemplate.html",{title:'External Template'});
        };
        $scope.showModal3 = function(){
            emodal.modal({template:'Messages go here!',title:'Callback Function',
                successCallback:successCallbackFun,successArgs:{id:1},
                cancelCallback:cancelCallbackFun,cancelArgs:{info:'i.e. Help text'}
            });
        };
        $scope.showModal4 = function(){
            emodal.modal({
                template:'<strong>Message from external controller:</strong><p></p>{{data}}',
                title:'External Controller',
                controller:'externalController'});
        };
    }]);
    
    easyModalApp.controller("externalController",['$scope', function ($scope) {
        $scope.data = 'hello from externalController!';
    }]);