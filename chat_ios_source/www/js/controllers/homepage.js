App.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider.state('home', {
        url: BASE_PATH,
        templateUrl: 'templates/home/view.html',
        controller: 'HomeController'
    });

    $urlRouterProvider.otherwise(BASE_PATH);

}).controller('HomeController', function($ionicHistory, $location, $scope, $state, $window, Application, HomepageLayout, Padlock) {

    $ionicHistory.clearHistory();

    $scope.loadContent = function() {
        
        $scope.is_loading = true;
        
        if($window.localStorage.getItem('sb-uc')) {
            Padlock.unlock_by_qrcode = true;
        }
        
        HomepageLayout.getFeatures().then(function (features) {

            $scope.layout_id = HomepageLayout.properties.layoutId;

            /** Homepage Slider */
            var homepage_slider =  {
                is_active_for_layout: (HomepageLayout.properties.menu.visibility == 'homepage'),
                is_visible: features.data.homepage_slider_is_visible,
                duration: features.data.homepage_slider_duration * 1000,
                loop_at_beginning: features.data.homepage_slider_loop_at_beginning,
                images: new Array()
            };

            var tmp_images = features.data.homepage_slider_images;

            /** Prepend IMAGE_URL for images */
            for(var i=0; i < tmp_images.length; i++) {
                homepage_slider.images[i] = IMAGE_URL + tmp_images[i];
            }

            $scope.showSlider = function() {
                return (homepage_slider.is_active_for_layout && homepage_slider.is_visible && homepage_slider.images);
            };

            $scope.homepage_slider = homepage_slider;

            $scope.features = features;

            $scope.tabbar_is_transparent = HomepageLayout.properties.tabbar_is_transparent;

            /** Load first feature is needed */
            if (!Application.is_customizing_colors && HomepageLayout.properties.options.autoSelectFirst && features.first_option !== false) {
                $ionicHistory.nextViewOptions({
                    historyRoot: true,
                    disableAnimate: false
                });
                $location.path(features.options[0].path);
            }

            $scope.menu_is_visible = true;

            $scope.is_loading = false;

        });

    };

    $scope.loadContent();

});