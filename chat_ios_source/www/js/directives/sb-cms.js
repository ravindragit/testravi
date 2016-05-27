App.directive("sbCmsText", function() {
    return {
        restrict: 'A',
        scope: {
            block: "="
        },
        template:
        '<div class="item item-text-wrap item-custom">' +
        '   <img width="{{block.size}}%" ng-src="{{ block.image_url }}" ng-if="block.image_url" class="{{ block.alignment }}" />' +
        '   <div class="content" ng-bind-html="block.content | trusted_html" sb-a-click></div>' +
        '</div>'
    };
}).directive("sbCmsImage", function() {
    return {
        restrict: 'A',
        scope: {
            block: "=",
            gallery: "="
        },
        template:
        '<div class="item item-image-gallery item-custom">' +
        '   <ion-scroll direction="y">' +
        '       <ion-gallery ion-gallery-items="block.gallery" ng-if="!is_loading"></ion-gallery>' +
        '   </ion-scroll>' +
        '   <div class="padding description">{{ block.description }}</div>' +
        '</div>'
    };
}).directive("sbCmsVideo", function() {
    return {
        restrict: 'A',
        scope: {
            block: "="
        },
        template:
        '<div class="cms_block">'
            + '<div sb-video video="block"></div>'
        + '</div>'
    };
}).directive("sbCmsAddress", function() {
    return {
        restrict: 'A',
        scope: {
            block: "=",
            onShowMap: "&",
            onAddToContact: "&"
        },
        template:
        '<div>' +
        '    <div class="item item-text-wrap item-custom" ng-if="block.show_address">' +
        '       <h2 ng-if="block.label">{{ block.label}}</h2>' +
        '       <p ng-if="block.address">{{ block.address }}</p>' +
        '   </div>' +
        '   <div class="item item-text-wrap item-icon-left item-custom" ng-if="handle_address_book" ng-click="addToContact()">' +
        '       <i class="icon ion-ios-cloud-download"></i>' +
        '       {{ "Add to address book" | translate }}' +
        '   </div>' +
        '   <div class="item item-text-wrap item-icon-left item-custom" ng-if="(block.latitude && block.longitude || block.address) && block.show_geolocation_button && !itinerary_link" ng-click="showMap()">' +
        '       <i class="icon ion-ios-location-outline"></i>' +
        '       {{ "Locate" | translate }}' +
        '   </div>' +
        '   <div class="item item-text-wrap item-icon-left item-custom" ng-if="itinerary_link && block.show_geolocation_button" href="{{ itinerary_link }}" target="{{ itinerary_link_target }}">' +
        '       <i class="icon ion-ios-location-outline"></i>' +
        '       {{ "Locate" | translate }}' +
        '   </div>' +
        '</div>',
        controller: function ($cordovaGeolocation, $ionicLoading, $rootScope, $scope, $state, $stateParams, $window /*$location, $q, Url/*, Application, GoogleMapService*/) {

            $scope.handle_address_book = false; // Application.handle_address_book;

            $scope.showMap = function () {
                if($rootScope.isOverview) {
                    $rootScope.showMobileFeatureOnlyError();
                    return;
                }

                $ionicLoading.show();

                $cordovaGeolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }).then(function(position) {
                    $scope.getItineraryLink(position.coords, $scope.block);

                    $ionicLoading.hide();
                }, function() {
                    var null_point = {"latitude":null,"longitude":null};
                    $scope.getItineraryLink(null_point, $scope.block);

                    $ionicLoading.hide();
                });
            };

            $scope.addToContact = function () {

                if ($scope.onAddToContact && angular.isFunction($scope.onAddToContact)) {
                    $scope.onAddToContact($scope.block);
                }
            };

            $scope.getItineraryLink = function(point1,point2) {
                var link = "https://www.google.com/maps/dir/";

                if(point1.latitude) {
                    link += point1.latitude + "," + point1.longitude;
                }

                if(point2.latitude) {
                    link += "/" + point2.latitude + "," + point2.longitude;
                }

                $window.open(link, $rootScope.getTargetForLink(), "location=no");
            };

        }
    };
}).directive("sbCmsButton", function() {
    return {
        restrict: 'A',
        scope: {
            block: "="
        },
        template:
        '   <a href="{{ url }}" target="{{ target }}" class="item item-text-wrap item-icon-left item-custom">' +
        '       <i class="icon" ng-class="icon"></i>' +
        '       {{ label | translate }}' +
        '   </a>',
        controller: function ($ionicPopup, $rootScope, $scope, $timeout, $translate, $window, Application) {
            $scope.openLink = function() {

                if($rootScope.isOverview) {
                    $rootScope.showMobileFeatureOnlyError();
                    return;
                }

                $window.open($scope.block.content, $rootScope.getTargetForLink(), "location=no");
            };
        },
        link: function(scope, element) {

            if(scope.block.type_id == "phone") {

                scope.icon = "ion-ios-telephone-outline";
                scope.label = "Phone";

                if(!scope.block.content.startsWith('tel:')) {
                    scope.block.content = "tel:" + scope.block.content;
                }

                scope.url = scope.block.content;

                scope.target = "_self";

            } else {

                scope.icon = "ion-ios-world-outline";
                scope.label = "Website";

                var a = angular.element(element).find("a");
                a.on("click", function() {
                    scope.openLink();
                    return false;
                });

                scope.$on("$destroy", function() {
                    a.off("click");
                });
            }
        }
    };
}).directive("sbCmsFile", function() {
    return {
        restrict: 'A',
        scope: {
            block: "="
        },
        template:
        '<div class="item item-text-wrap item-icon-left item-custom" ng-click="openFile()">' +
        '   <i class="icon ion-paperclip"></i>' +
        '   {{ block.display_name }}' +
        '</div>',
        controller: function ($rootScope, $scope) {

            $scope.openFile = function() {

                if($rootScope.isOverview) {
                    $rootScope.showMobileFeatureOnlyError();
                    return;
                }

                if(ionic.Platform.isAndroid()) {
                	window.open($scope.block.file_url, "_system", "location=no");
                } else {
                	window.open($scope.block.file_url, $rootScope.getTargetForLink(), "EnableViewPortScale=yes");
                }

            };

        }
    };
});