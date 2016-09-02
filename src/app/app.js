angular.module('orderCloud', [
    'ngSanitize',
    'ngAnimate',
    'ngMessages',
    'ngTouch',
    'snap',
    'ui.tree',
    'ui.router',
    'ui.bootstrap',
    'LocalForageModule',
    'toastr',
    'cgBusy',
    'jcs-autoValidate'
    ])
    .config(Routing)
    .config(ErrorHandling)
    .controller('AppCtrl', AppCtrl)
    .config(DatePickerConfig)
;

function DatePickerConfig(uibDatepickerConfig, uibDatepickerPopupConfig){
    uibDatepickerConfig.showWeeks = false;
    uibDatepickerPopupConfig.showButtonBar = false;
}

function Routing($urlRouterProvider, $urlMatcherFactoryProvider, $locationProvider) {
    $urlMatcherFactoryProvider.strictMode(false);
    $urlRouterProvider.otherwise('/home');
    $locationProvider.html5Mode(true);
}

function ErrorHandling($provide) {
    $provide.decorator('$exceptionHandler', handler);

    function handler($delegate, $injector) {
        return function(ex, cause) {
            $delegate(ex, cause);
            $injector.get('toastr').error(ex.data ? (ex.data.error || (ex.data.Errors ? ex.data.Errors[0].Message : ex.data)) : ex.message, 'Error');
        };
    }
}

function AppCtrl($q, $rootScope, $state, $ocMedia, toastr, appname) {
    var vm = this;
    vm.name = appname;
    vm.title = appname;
    vm.$state = $state;
    vm.$ocMedia = $ocMedia;
    vm.contentLoading = undefined;

    function cleanLoadingIndicators() {
        if (vm.contentLoading && vm.contentLoading.promise && !vm.contentLoading.promise.$cgBusyFulfilled) vm.contentLoading.resolve(); //resolve leftover loading promises
    }

    //Detect if the app was loaded on a touch device with relatively good certainty
    //http://stackoverflow.com/a/6262682
    vm.isTouchDevice = (function() {
        var el = document.createElement('div');
        el.setAttribute('ongesturestart', 'return;'); // or try "ontouchstart"
        return typeof el.ongesturestart === "function";
    })();

    vm.logout = function() {
        LoginService.Logout();
    };

    $rootScope.$on('$stateChangeStart', function(e, toState) {
        cleanLoadingIndicators();
        var defer = $q.defer();
        //defer.delay = 200;
        defer.wrapperClass = 'indicator-container';
        (toState.data && toState.data.loadingMessage) ? defer.message = toState.data.loadingMessage : defer.message = null;
        defer.templateUrl = 'common/loading-indicators/templates/view.loading.tpl.html';
        vm.contentLoading = defer;
    });

    $rootScope.$on('$stateChangeSuccess', function(e, toState) {
        cleanLoadingIndicators();
        if (toState.data && toState.data.componentName) {
            vm.title = toState.data.componentName + ' | ' + appname;
        } else {
            vm.title = appname;
        }
    });

    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
        cleanLoadingIndicators();
        console.log(error);
    });
}
