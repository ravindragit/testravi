var folder_title = '';
App.config(function($stateProvider) {

    $stateProvider.state('loginredirect-view', {
        url: BASE_PATH+"/loginredirect/mobile_view/index/value_id/:value_id",
        controller: 'LoginredirectController',
        templateUrl: 'templates/loginredirect/l1/view.html'
    });


}).controller('LoginredirectController', function($ionicHistory, $cordovaOauth,AUTH_EVENTS, $ionicScrollDelegate, $location,$window, $scope, $state,$rootScope, $translate, $stateParams, Loginredirect, Application, Customer, Dialog, HomepageLayout) {

    
    $scope.value_id = Loginredirect.value_id = $stateParams.value_id;

    $scope.customer = {};

    $scope.redirectLoginUrl = "";
    
    $scope.is_logged_in = Loginredirect.isLoggedIn();
    $scope.app_name = Application.app_name;

    $scope.display_login_form = !$scope.is_logged_in;
    $scope.display_account_form = $scope.is_logged_in;
    
    HomepageLayout.getData().then(function(data) {
        if(data.customer_account.name) {
            $scope.page_title = data.customer_account.name;
        }
    });
    
    $rootScope.$on('$stateChangeStart', function(event, toState,toParams, fromState, fromParams){ 
    
        if($scope.redirectLoginUrl!="" && fromState.name=="home" && toState.name=="loginredirect-view"){
            event.preventDefault();
            window.location.href = $scope.redirectLoginUrl;  // commented for now

        }
         if($scope.redirectLoginUrl!="" && fromState.name!="home" && toState.name=="loginredirect-view"){
            event.preventDefault();
            window.location.href = $scope.redirectLoginUrl;  // commented for now
            $state.go("home");

        
    }
        
        // Would print "Hello World!" when 'parent' is activated
        // Would print "Hello UI-Router!" when 'parent.child' is activated
    })

     $rootScope.$on(AUTH_EVENTS.logoutSuccess, function() {
        $scope.redirectLoginUrl = '';

        

    });

   

    
    
    $scope.closeLoginModal = function() {
           $ionicHistory.goBack();
    };

    $scope.post = function() {

        $scope.is_loading = true;
        Loginredirect.login($scope.customer).success(function(data) {
            if(data.success) {

                Loginredirect.saveCredentials(data.token);
                Loginredirect.id = data.customer_id;
                Loginredirect.can_access_locked_features = data.can_access_locked_features;
                //Loginredirect.flushData();
                //$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);

                console.log(data.appurl);
                //$state.go("mcommerce-sales-store", {value_id: $scope.value_id});
                var location = window.location.href;
                location = location.split("#");
                location = location[0]+"#"+BASE_PATH+"/"+data.appurl;
                //alert(location[0]+"#overview/"+data.appurl);
                $scope.redirectLoginUrl = location;
                setTimeout(function(){
                        window.location.href = location;  // commented for now
                },1000);
                $scope.is_logged_in = true;
                //$location.url(data.appurl);

              

                return false;

                 
            }
        }).error(function(data) {
            if(data && angular.isDefined(data.message)) {
                Dialog.alert($translate.instant("Error"), data.message, $translate.instant("OK"));
            }

        }).finally(function() {
            $scope.is_loading = false;
        });
        
    };
    
    $scope.logout = function() {
        Loginredirect.logout().success(function(data) {
            if(data.success) {
                $scope.closeLoginModal();
                folder_title = '';
            }
        });
    };
    
    $scope.save = function() {

        $scope.is_loading = true;

        Customer.save($scope.customer).success(function(data) {
            if(angular.isDefined(data.message)) {
                Dialog.alert("", data.message, $translate.instant("OK"));
            }

            if(data.success) {
                $scope.closeLoginModal();
            }

        }).error(function(data) {
            if(data && angular.isDefined(data.message)) {
                Dialog.alert($translate.instant("Error"), data.message, $translate.instant("OK"));
            }

        }).finally(function() {
            $scope.is_loading = false;
        });
    };

    $scope.loadContent = function() {
        if(!$scope.is_logged_in) return;

        $scope.is_loading = true;
        Loginredirect.find().success(function(customer) {
            $scope.customer = customer;
        }).finally(function() {
            $scope.is_loading = false;
        });
    };
    
    $scope.displayLoginForm = function() {
        $scope.display_forgot_password_form = false;
        $scope.display_account_form = false;
        $scope.display_privacy_policy = false;
        $scope.display_login_form = true;
    };

    $scope.displayForgotPasswordForm = function() {
        $scope.display_login_form = false;
        $scope.display_account_form = false;
        $scope.display_privacy_policy = false;
        $scope.display_forgot_password_form = true;
    };

    $scope.displayAccountForm = function() {
        $scope.display_login_form = false;
        $scope.display_forgot_password_form = false;
        $scope.display_privacy_policy = false;
        $scope.display_account_form = true;
    };

    $scope.displayPrivacyPolicy = function(from) {
        $scope.displayed_from = from || '';
        $scope.display_login_form = false;
        $scope.display_forgot_password_form = false;
        $scope.display_account_form = false;
        $scope.display_privacy_policy = true;
    };

    $scope.scrollTop = function() {
        $ionicScrollDelegate.scrollTop(false);
    };    

    $scope.loadContent();
});

App.run(function($rootScope,Loginredirect,$http,Url) {


       $http({
                method: 'GET',
                url: Url.get("loginredirect/mobile_view/findall", {}),
                cache: false,
                responseType:'json'
            }).success(function(data) {
                //alert(data);
                $rootScope.hideMenusData = data;
                angular.forEach($rootScope.hideMenusData, function(value, key) {
                  //alert(key + ': ' + value.hide);
                  if(value.hide==1)
                    $("ul.homepage-custom li:nth-child("+(key+1)+")").addClass("hide");
                });
                
            });
    
    // css to hide all menus
    //var css = 'ul.homepage-custom li { display: none }',
    var css = '.hide { display: none!important }',

    head = document.body || document.getElementsByTagName('body')[0],
    style = document.createElement('style');

    //style.type = 'text/css';
    if (style.styleSheet){
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);
    
    

    $rootScope.timer = setInterval( function(){

            if($("ul.homepage-custom li").length>0){

                angular.forEach($rootScope.hideMenusData, function(value, key) {
                  //alert(key + ': ' + value.hide);
                  if(value.hide==1)
                    $("ul.homepage-custom li:nth-child("+(key+1)+")").addClass("hide");
                });

                // $("ul.homepage-custom li").each(function(){

                //     if($(this).find('p').text()=="Login Redirect")
                //         $(this).removeClass("hide");
                //     else{
                //         $(this).addClass("hide");
                //     }
                // })

                clearInterval($rootScope.timer);
            }else{
                console.log("Menu not yet loaded");
            }

    },1000);

    
});


