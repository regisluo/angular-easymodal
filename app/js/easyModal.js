/**
 * AngularEasyModal
 * @author springquay at gmail.com
 * @license MIT
 * @version 1.0.0
 */
angular.module('easyModalService', []).factory('emodal', ["$document", "$compile", "$rootScope", "$controller", "$timeout",
  function ($document, $compile, $rootScope, $controller, $timeout) {
    var factory = {};
    var defaults = {
      id: null,
      template: null,//simple String html template
      templateUrl: null,//external html URL
      title: 'My Title',//title shown on top of the modal
      backdrop: true,
      success: {label: 'OK', fn: null,show:true},
      cancel: {label: 'Cancel', fn: null,show:false},
      controller: null,//external controller generally provides data to the modal
      backdropClass: "modal-backdrop",
      backdropCancel: true,
      footerTemplate: null,
      modalClass: "modal",
      successCallback:null,//callback function after press OK
      cancelCallback:null,//callback function after press Cancel
      successArgs:null,//successCallback function parameters
      cancelArgs:null,//cancelCallback function parameters
      fadetime:null,//milliseconds that modal vanish automatically
      css: {
        top: '30%',
        margin: '0 auto'
      }
    };
    var body = $document.find('body');

    factory.modal = function (templateUrl/*optional*/, options, passedInLocals) {
            if(angular.isObject(templateUrl)){
                passedInLocals = options;
                options = templateUrl;
            } else {
                options.templateUrl = templateUrl;
            }

            options = angular.extend({}, defaults, options); //options defined in constructor

            var key;
            var successCallbackFun = options.successCallback;
            var cancelCallbackFun = options.cancelCallback;
            var successArgs = options.successArgs;
            var cancelArgs = options.cancelArgs;
            var fadetime = options.fadetime;
            var idAttr = options.id ? ' id="' + options.id + '" ' : '';

            var defaultFooter = '<button class="btn btn-primary" ng-click="$modalSuccess()">{{$modalSuccessLabel}}</button>';
            if(options.cancel.show || cancelCallbackFun){
                defaultFooter = defaultFooter + '<button class="btn" ng-click="$modalCancel()">{{$modalCancelLabel}}</button>'
            }
            var footerTemplate = '<div class="modal-footer">' + (options.footerTemplate || defaultFooter) + '</div>';
            var modalBody = (function(){
                if(options.template){
                    if(angular.isString(options.template)){
                        return '<div class="modal-body">' + options.template + '</div>';
                    } else {
                        return '<div class="modal-body">' + options.template.html() + '</div>';
                    }
                } else {
                    return '<div class="modal-body" ng-include="\'' + options.templateUrl + '\'"></div>'
                }
            })();
            var modalEl = angular.element(
                    '<div class="' + options.modalClass + ' fade"' + idAttr + ' style="display: block;">' +
                    '  <div class="modal-dialog">' +
                    '    <div class="modal-content">' +
                    '      <div class="modal-header">' +
                    '        <button type="button" class="close" ng-click="$modalCancel()">&times;</button>' +
                    '        <h2>{{$title}}</h2>' +
                    '      </div>' +
                            modalBody +
                            footerTemplate +
                    '    </div>' +
                    '  </div>' +
                    '</div>');
            for(key in options.css) {
                modalEl.css(key, options.css[key]);
            }
            var divHTML = "<div ";
            if(options.backdropCancel){
                divHTML+='ng-click="$modalCancel()"';
            }
            divHTML+="/>";
            var backdropEl = angular.element(divHTML);
            backdropEl.addClass(options.backdropClass);
            backdropEl.addClass('fade in');

            var handleEscPressed = function (event) {
                if (event.keyCode === 27) {
                    scope.$modalCancel();
                }
            };
            var closeFun = function () {
                body.unbind('keydown', handleEscPressed);
                modalEl.remove();
                if (options.backdrop) {
                    backdropEl.remove();
                }
            };
            body.bind('keydown', handleEscPressed);
            var ctrl, locals,
            scope = options.scope || $rootScope.$new();
            scope.$title = options.title;
            scope.$modalClose = closeFun;

            scope.$modalCancel = function () {
                var callFun = options.cancel.fn || closeFun;
                callFun.call(this);
                if(cancelCallbackFun){
                    cancelCallbackFun.call(null,cancelArgs);
                }
                scope.$modalClose();
            };

            scope.$modalSuccess = function () {
                var callFun = options.success.fn || closeFun;
                callFun.call(this);
                if(successCallbackFun){
                    successCallbackFun.call(null,successArgs);
                }
                scope.$modalClose();
            };
            scope.$modalSuccessLabel = options.success.label;
            scope.$modalCancelLabel = options.cancel.label;

            if (options.controller) {
                locals = angular.extend({$scope: scope}, passedInLocals);
                ctrl = $controller(options.controller, locals);
                modalEl.contents().data('$ngControllerController', ctrl);
            }

            $compile(modalEl)(scope);
            $compile(backdropEl)(scope);
            body.append(modalEl);
            if (options.backdrop) body.append(backdropEl);
            $timeout(function () {
                modalEl.addClass('in');
            }, 200);
    };
      /**
       * @description simple alert .
       * emodal.alert(arg1,agr2,arg3) {function}
       * @param arg1:{string}.required. The message that will be shown in the modal.
       * @param arg2:{string}.optional.The customized button label.Default is "OK".
       *         OR
       *        {number}.optional. MillionSeconds that the modal vanish.
       * @param arg3:{number}.If arg2 is provided,arg3 is {number}: MillionSeconds that the modal vanish.
       */
    factory.alert =  function () {
        var modalBody = '<div class="modal-body"><div class="alert alert-info">' + arguments[0] + '</div></div>';
        var footerTemplate = '<div class="modal-footer"><button class="btn btn-primary" ng-click="$modalSuccess()">{{$modalSuccessLabel}}</button></div>';
        var modalEl = angular.element(
            '<div class="modal modal-body" style="display: block;">' +
            '<div class="modal-dialog modal-sm">' +
            '<div class="modal-content">' +
            modalBody +
            footerTemplate +
            '</div>' +
            '</div>' +
            '</div>');

        var label=null;
        var scope = arguments[0].scope || $rootScope.$new();
        var closeFun = function () {
            body.unbind('keydown', handleEscPressed);
            modalEl.remove();
        };
        scope.$modalClose = closeFun;

        if(angular.isString(arguments[1])){
            label = arguments[1];
        }else if(angular.isNumber(arguments[1])){
            $timeout(function () {scope.$modalClose()},arguments[1]);
        };
        if(angular.isNumber(arguments[2])){
            $timeout(function () {scope.$modalClose()},arguments[2]);
        };
        var handleEscPressed = function (event) {
            if (event.keyCode === 27) {
                scope.$modalClose();
            }
        };

        body.bind('keydown', handleEscPressed);
        scope.$modalSuccess = function () {
            scope.$modalClose();
        };
        scope.$modalSuccessLabel = label==null?"OK":label;
        $compile(modalEl)(scope);
        body.append(modalEl);
    };
      /**
       * @description simple confirm
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
    factory.confirm = function () {
        var modalBody = '<div class="modal-body"><div class="alert alert-info">' + (angular.isString(arguments[0])?arguments[0]:"") + '</div></div>';
        var footerTemplate = '<div class="modal-footer"><button class="btn btn-primary" ng-click="$modalSuccess()">{{$modalSuccessLabel}}</button>';
        footerTemplate = footerTemplate + '<button class="btn btn-primary" ng-click="$modalCancel()">{{$modalCancelLabel}}</button></div>';
        var modalEl = angular.element(
            '<div class="modal modal-body" style="display: block;">' +
            '<div class="modal-dialog modal-sm">' +
            '<div class="modal-content">' +
            modalBody +
            footerTemplate +
            '</div>' +
            '</div>' +
            '</div>');

        var scope = arguments[0].scope || $rootScope.$new();
        var closeFun = function () {
            body.unbind('keydown', handleEscPressed);
            modalEl.remove();
        };
        scope.$modalClose = closeFun;
        scope.$modalSuccessLabel = 'OK';
        scope.$modalCancelLabel = 'Cancel';
        switch(arguments.length){
            case 2:
                scope.$successCallback = angular.isFunction(arguments[1])?arguments[1]:null;
                break;
            case 3:
                scope.$successCallback = angular.isFunction(arguments[1])?arguments[1]:null;
                scope.$cancelCallback = angular.isFunction(arguments[2])?arguments[2]:null;
                break;
            case 4:
                scope.$modalSuccessLabel = angular.isString(arguments[1])?arguments[1]:'OK';
                scope.$modalCancelLabel = angular.isString(arguments[2])?arguments[2]:'Cancel';
                scope.$successCallback = angular.isFunction(arguments[3])?arguments[3]:null;
                break;
            case 5:
                scope.$modalSuccessLabel = angular.isString(arguments[1])?arguments[1]:'OK';
                scope.$modalCancelLabel = angular.isString(arguments[2])?arguments[2]:'Cancel';
                scope.$successCallback = angular.isFunction(arguments[3])?arguments[3]:null;
                scope.$cancelCallback = angular.isFunction(arguments[4])?arguments[4]:null;
                break;
        }
      var handleEscPressed = function (event) {
            if (event.keyCode === 27) {
                scope.$modalClose();
            }
        };

        body.bind('keydown', handleEscPressed);

        scope.$modalSuccess = function () {
            if(scope.$successCallback != undefined){
                scope.$successCallback.call(null,null);
            };
            scope.$modalClose();
        };
        scope.$modalCancel = function () {
            if(scope.$cancelCallback != undefined){
                scope.$cancelCallback.call(null,null);
            };
            scope.$modalClose();
        };

        $compile(modalEl)(scope);
        body.append(modalEl);
    };
    return factory;
  }]);
