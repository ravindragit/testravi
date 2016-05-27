App.factory('Hfiveplaces', function ($rootScope, $http, Url) {

    var factory = {};

    factory.value_id = null;

    factory.find = function (place_id) {

        if (!this.value_id) return;

        return $http({
            method: 'GET',
            url: Url.get("hfiveplaces/mobile_api_hfiveplaces/find", {
                value_id: this.value_id,
                place_id: place_id
            }),
            cache: !$rootScope.isOverview,
            responseType: 'json'
        });
    };

    factory.findAll = function (position,query) {

        if (!this.value_id) return;

        var parameters = {
            value_id: this.value_id
        };

        if (angular.isObject(position)) {
            parameters.latitude = position.latitude;
            parameters.longitude = position.longitude;
        }

        if(query){
            parameters.search_query=query;
            return $http({
            method: 'GET',
                url: Url.get("hfiveplaces/mobile_api_hfiveplaces/searchall", parameters),
                cache: !$rootScope.isOverview,
                responseType: 'json'
            });
        }

        return $http({
            method: 'GET',
            url: Url.get("hfiveplaces/mobile_api_hfiveplaces/findall", parameters),
            cache: !$rootScope.isOverview,
            responseType: 'json'
        });
    };

    factory.findcmsAll = function (page_id) {
        
        if (!this.value_id) return;

        return $http({
            method: 'GET',
            url: Url.get("hfiveplaces/mobile_api_hfiveplaces/findcmsall", {
                page_id: page_id,
                value_id: this.value_id
            }),
            cache: !$rootScope.isOverview,
            responseType: 'json'
        });
    };

    factory.findsearchAll = function (query,position) {

        if (!query) return;
        if (!this.value_id) return;

        var parameters = {
            value_id: this.value_id,
            search_query: query
        };

        if (angular.isObject(position)) {
            parameters.latitude = position.latitude;
            parameters.longitude = position.longitude;
        }

        return $http({
            method: 'GET',
            url: Url.get("hfiveplaces/mobile_api_hfiveplaces/searchall", parameters),
            cache: !$rootScope.isOverview,
            responseType: 'json'
        });
    };

    factory.findsearchformAll = function () {

        if (!this.value_id) return;

        var parameters = {
            value_id: this.value_id
        };

        return $http({
            method: 'GET',
            url: Url.get("hfiveplaces/mobile_api_hfiveplaces/searchpage", parameters),
            cache: !$rootScope.isOverview,
            responseType: 'json'
        });
    };

    return factory;
});