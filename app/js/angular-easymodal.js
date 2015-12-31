angular.module('emodalService', []).factory('emodal', ["$document", "$compile", "$rootScope", "$controller", "$timeout",
    function ($document, $compile, $rootScope, $controller, $timeout) {
        var factory = {};
        var body = $document.find('body');
        var defaults = {
            id: null, // modal id, used as the id attribute in the HTML tag
            title:null,//title shown as the modal header
            template: null,//simple String html template
            templateClass:null,//css class for simple String html template
            templateUrl: null,//external html file URL
            footerTemplate: null,// footerTemplate replacing the default footer
            backdrop: true,//whether backdrop is enabled
            backdropClass: "modal-backdrop",//backdrop default css class
            backdropCancel: true,// whether modal vanish by clicking backdrop
            okLabel:'OK',//label of ok button
            okClass:'btn btn-primary',//css class of ok button
            okShow:true,//if ok button shown on the modal
            okCallback:null,//callback function if ok is clicked
            okCallbackObj:null,//"this" object inside okCallback function
            okArgs:null,//okCallback function passed in arguments
            cancelLabel:'Cancel',//label of cancel button
            cancelClass:'btn',//css class of cancel button
            cancelShow:false,//if cancel button shown on the modal
            cancelCallback:null,//callback function if cancel is clicked
            cancelCallbackObj:null,//"this" object inside cancelCallback function
            cancelArgs:null,//cancelCallback function passed in arguments
            fadein:null,//millionseconds that modal vanish automatically
            modalClass: "modal",//the main modal css class
            controller: null,//external controller generally provides data to the modal
            css: {
                top: '30%',
                margin: '0 auto'
            }
        };

        factory.alert =  function () {
            if(arguments[0] instanceof Object){
                this.modal(arguments[0],'alert');
            }else{
                var options = {};
                options.template = arguments[0];
                if(angular.isString(arguments[1])){
                    options.okLabel = arguments[1];
                }else if(angular.isNumber(arguments[1])){
                    options.fadein = arguments[1];
                };
                if(angular.isNumber(arguments[2])){
                    options.fadein = arguments[2];
                };
                this.modal(options,'alert');
            }
        };

        factory.confirm = function () {
            if(arguments[0] instanceof Object){
                this.modal(arguments[0],'confirm');
            }else{
                var options = {};
                options.template = arguments[0];
                options.okCallback = arguments[1];
                options.cancelCallback = arguments[2];
                options.okCallbackObj = arguments[3];
                options.cancelCallbackObj = arguments[4];
                options.cancelShow = true;
                this.modal(options,'confirm');
            }
        };
        factory.modal = function (templateUrl,options, passedInLocals) {
            var isAlert = false;
            var isConfirm = false;
            if(arguments.length>0){
                if(angular.isObject(templateUrl)){
                    passedInLocals = options;
                    options = templateUrl;
                    if(passedInLocals == 'alert'){
                        isAlert = true;
                    }
                    if(passedInLocals == 'confirm'){
                        isConfirm = true;
                    }
                } else {
                    options = options == null?{}:options;
                    options.templateUrl = templateUrl;
                }
                options = angular.extend({}, defaults, options);
            }else{
                options = defaults;
            }
            var idAttr = options.id ? ' id="' + options.id + '" ' : '';
            options.okClass = options.okClass==null?'btn btn-primary':options.okClass;
            var defaultFooter = '';
            if(options.okShow || options.okCallback){
                defaultFooter += '<button class="'+options.okClass+'" ng-click="$modalOK()">{{$modalOKLabel}}</button>';
            }
            if(options.cancelShow || options.cancelCallback){
                defaultFooter += '<button class="'+options.cancelClass+'" ng-click="$modalCancel()">{{$modalCancelLabel}}</button>'
            }
            var footerTemplate = '<div class="modal-footer">' + (options.footerTemplate || defaultFooter) + '</div>';
            if(isAlert){
                options.templateClass = options.templateClass==null?'alert alert-info':options.templateClass;
            }
            if(isConfirm){
                options.templateClass = options.templateClass==null?'alert alert-danger':options.templateClass;
            }
            var modalBody = (function(){
                if(options.template){
                    if(angular.isString(options.template)){
                        return '<div class="modal-body '+options.templateClass+'">' + options.template + '</div>';
                    } else {
                        return '<div class="modal-body">' + options.template.html() + '</div>';
                    }
                } else if(options.templateUrl){
                    return '<div class="modal-body" ng-include="\'' + options.templateUrl + '\'"></div>'
                }else{
                    return '<div class="modal-body"></div>';
                }
            })();
            var modalELString = '<div class="' + options.modalClass + ' fade"' + idAttr + ' style="display: block;">';
            if(isAlert || isConfirm){
                modalELString +=
                    '  <div class="modal-dialog modal-sm">'+
                    '    <div class="modal-content">';
            }else{
                modalELString +=
                    '  <div class="modal-dialog">'+
                    '    <div class="modal-content">';
            }
            if(options.title){
                modalELString +=
                    '      <div class="modal-header">' +
                    '        <button type="button" class="close" ng-click="$modalCancel()">&times;</button>' +
                    '        <h3>{{$title}}</h3>' +
                    '      </div>';
            }else{
                if(!isAlert && !isConfirm){
                    modalELString +=
                        '      <div class="modal-header">' +
                        '        <button type="button" class="close" ng-click="$modalCancel()">&times;</button>' +
                        '      </div>';
                }else{
                    modalELString +=
                        '      <div class="modal-header"></div>';
                }
            }
            modalELString +=
                modalBody +
                footerTemplate +
                '    </div>' +
                '  </div>' +
                '</div>';

            var modalEl = angular.element(modalELString);
            for(key in options.css) {
                modalEl.css(key, options.css[key]);
            }
            var backDropHtml = "<div ";
            if(options.backdropCancel){
                backDropHtml+='ng-click="$modalCancel()"';
            }
            backDropHtml+=">";
            var backdropEl = angular.element(backDropHtml);
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

            scope.$modalOK = function () {
                if(options.okCallback){
                    options.okCallback.call(options.okCallbackObj,options.okArgs);
                }
                closeFun();
            };
            scope.$modalCancel = function () {
                if(options.cancelCallback){
                    options.cancelCallback.call(options.cancelCallbackObj,options.cancelArgs);
                }
                closeFun();
            };

            scope.$modalOKLabel = options.okLabel;
            scope.$modalCancelLabel = options.cancelLabel;

            if (options.controller) {
                locals = angular.extend({$scope: scope}, passedInLocals);
                ctrl = $controller(options.controller, locals);
                modalEl.contents().data('$ngControllerController', ctrl);
            }

            $compile(modalEl)(scope);
            $compile(backdropEl)(scope);
            body.append(modalEl);

            if (options.backdrop) body.append(backdropEl);
            if(options.fadein){
                $timeout(function () {closeFun()},options.fadein);
            }
            $timeout(function () {
                modalEl.addClass('in');
            }, 200);
        };
        return factory;
    }]);
