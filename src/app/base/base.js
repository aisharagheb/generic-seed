angular.module('orderCloud')
    .config(BaseConfig)
    .controller('BaseCtrl', BaseController)
;

function BaseConfig($stateProvider, $injector) {
    var baseViews = {
        '': {
            templateUrl: 'base/templates/base.tpl.html',
            controller: 'BaseCtrl',
            controllerAs: 'base'
        }
    };

    if ($injector.has('base')) {
        var baseConfig = $injector.get('base');

        //conditional base left
        baseConfig.left ? baseViews['left@base'] = {
            'templateUrl': 'base/templates/base.left.tpl.html'
        } : angular.noop();

        //conditional base right
        baseConfig.right ? baseViews['right@base'] = {
            'templateUrl': 'base/templates/base.right.tpl.html'
        } : angular.noop();

        //conditional base top
        baseConfig.top ? baseViews['top@base'] = {
            'templateUrl': 'base/templates/base.top.tpl.html'
        } : angular.noop();

        //conditional base bottom
        baseConfig.bottom ? baseViews['bottom@base'] = {
            'templateUrl': 'base/templates/base.bottom.tpl.html'
        } : angular.noop();
    }

    var baseState = {
        url: '',
        abstract: true,
        views: baseViews
    };

    $stateProvider.state('base', baseState);
}

function BaseController($rootScope, $ocMedia, Underscore, snapRemote, defaultErrorMessageResolver, base) {
    var vm = this;
    vm.left = base.left;
    vm.right = base.right;

    defaultErrorMessageResolver.getErrorMessages().then(function (errorMessages) {
        errorMessages['customPassword'] = 'Password must be at least eight characters long and include at least one letter and one number';
        //regex for customPassword = ^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!$%@#£€*?&]{8,}$
        errorMessages['positiveInteger'] = 'Please enter a positive integer';
        //regex positiveInteger = ^[0-9]*[1-9][0-9]*$
        errorMessages['ID_Name'] = 'Only Alphanumeric characters, hyphens and underscores are allowed';
        //regex ID_Name = ([A-Za-z0-9\-\_]+)
        errorMessages['confirmpassword'] = 'Your passwords do not match';
        errorMessages['noSpecialChars'] = 'Only Alphanumeric characters are allowed';
    });

    vm.snapOptions = {
        disable: (!base.left && base.right) ? 'left' : ((base.left && !base.right) ? 'right' : 'none')
    };

    function _isMobile() {
        return $ocMedia('max-width:991px');
    }

    function _initDrawers(isMobile) {
        snapRemote.close('MAIN');
        if (isMobile && (base.left || base.right)) {
            snapRemote.enable('MAIN');
        } else {
            snapRemote.disable('MAIN');
        }
    }

    _initDrawers(_isMobile());

    $rootScope.$watch(_isMobile, function(n, o) {
        if (n === o) return;
        _initDrawers(n);
    });
}
