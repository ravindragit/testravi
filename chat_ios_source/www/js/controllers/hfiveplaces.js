App.config(function($stateProvider) {

    $stateProvider.state('hfiveplaces-list', {
        url: BASE_PATH+"/hfiveplaces/mobile_list/index/value_id/:value_id",
        controller: 'HplacesListController',
        templateUrl: "templates/hfiveplaces/l3/list.html"
    }).state('hfiveplaces-list-map', {
        url: BASE_PATH+"/hfiveplaces/mobile_list_map/index/value_id/:value_id",
        controller: 'HcmsListMapController',
        templateUrl: "templates/hfiveplaces/l1/maps.html"
    }).state('hfiveplaces-view', {
        url: BASE_PATH+"/hfiveplaces/mobile_page_view/index/value_id/:value_id/page_id/:page_id",
        controller: 'HcmsViewController',
        templateUrl: "templates/hfiveplaces/l1/view.html"
    }).state('hfiveplaces-searchpage', {
        url: BASE_PATH+"/hfiveplaces/mobile_searchpage/index/value_id/:value_id",
        controller: 'HsearchpageController',
        templateUrl: "templates/hfiveplaces/l3/searchpage.html"
    });

}).controller('HplacesListController', function ($cordovaGeolocation, $q, $scope, $state, $stateParams, $translate, Hfiveplaces, $location, HfiveGoogleMaps, $rootScope) {

    $scope.$on("connectionStateChange", function(event, args) {
        if(args.isOnline == true) {
            $scope.loadContent();
        }
    });

    $scope.is_loading = true;
    $scope.value_id = Hfiveplaces.value_id = $stateParams.value_id;

    $scope.loadContent = function () {

        $cordovaGeolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }).then(function(position) {
            $scope.position = position.coords;
            $scope.loadPlaces();
        }, function() {
            $scope.loadPlaces();
        });

    };

    $scope.searchquery="";

    $rootScope.$on("callListController", function(event,query){
        $scope.searchquery=query;
    });

    $scope.loadPlaces = function() {
        Hfiveplaces.findAll($scope.position,$rootScope.searchquery).success(function (data) {
            $scope.page_title = data.page_title;
            $scope.collection = data.places.reduce(function (collection, place) {
                var item = {
                    id: place.id,
                    title: place.title,
                    subtitle: place.subtitle,
                    picture: place.picture,
                    url: $scope.basepath+place.url
                };
                collection.push(item);
                return collection;
            }, []);

        }).finally(function () {
            $scope.is_loading = false;
        });

    };

    $scope.goToMap = function () {
        $state.go("hfiveplaces-list-map", {value_id: $scope.value_id, page_id: $stateParams.page_id});
    };

    $scope.showItem = function(item) {
        $state.go("hfiveplaces-view", {value_id: $scope.value_id, page_id: item.id});
    };

    $scope.loadContent();

    var str = $location.absUrl().split("#");
    $scope.basepath="";
    if(str[0]!=undefined)
        $scope.basepath=str[0]+"#/overview";

    $scope.listviewurl=$scope.basepath+"/hfiveplaces/mobile_list/index/value_id/"+$scope.value_id;
    $scope.mapviewurl=$scope.basepath+"/hfiveplaces/mobile_list_map/index/value_id/"+$scope.value_id;

}).controller('HcmsListMapController', function ($cordovaGeolocation, $scope, $state, $stateParams, Hfiveplaces, HfiveGoogleMaps, Dialog, $translate, $ionicModal, $location, $window, $rootScope) {

    $cordovaGeolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }).then(function(position) {
            $scope.position = position.coords;            
            $scope.loadContent();
        });

    $scope.searchquery="";

    $rootScope.$on("callMapController", function(event,query){
        $scope.searchquery=query;
        $rootScope.searchquery=query;
        $scope.loadContent();        
    });

    $ionicModal.fromTemplateUrl('modal.html', function($ionicModal) {
        $scope.modal = $ionicModal;
    }, {
        // Use our scope for the scope of the modal to keep it simple
        scope: $scope,
        // The animation we want to use for the modal entrance
        animation: 'slide-in-down'
    });  

    // add list view link on header


    $scope.$on("connectionStateChange", function(event, args) {
        if(args.isOnline == true) {
            $scope.loadContent();
        }       
    });

    $scope.is_loading = true;
    $scope.value_id = Hfiveplaces.value_id = $stateParams.value_id;
    $scope.address_id = 0;
    $scope.basepath = 0;


    $scope.loadContent = function () { 
        $scope.map_config   ="";

        Hfiveplaces.findAll($scope.position,$rootScope.searchquery).success(function(data) {

            $scope.page_title = data.page_title;
            $scope.collection = data.places;

            var markers = new Array();

            for(var i = 0; i < $scope.collection.length; i++) {

                var place = $scope.collection[i];

                var marker = {
                    title: place.title + "<br />" + place.address.address,
                    link: "#"+place.url,
                    addressid: place.id
                };

                
                $scope.mappicture=place.picture;
                $scope.maptitle=place.title;
                $scope.mapchildcare=place.content;
                $scope.maplink=$scope.basepath+place.url;  
                $scope.mapaddress=place.address.address;              

                if(place.daycare!==""){
                    $scope.mapchildcare=place.daycare.childcare_provider;
                    $scope.mapwebsite=place.daycare.website;
                    $scope.mapemail="mailto:"+place.daycare.email;
                    $scope.mapphone="tel:"+place.daycare.phone_number;
                }

                $scope.myPathVariable=$scope.basepath+place.url;

                marker.is_centered=true;
                if(place.address.latitude && place.address.longitude) {
                    marker.latitude = place.address.latitude;
                    marker.longitude = place.address.longitude;
                    marker.distance = place.distance;
                } else {
                    marker.address = place.address.address;
                }

                if(place.markerimg) {
                    marker.icon = {
                        // url: place.picture,
                        url: place.markerimg,
                        width: 40,
                        height: 50
                    }
                }                
                markers.push(marker);                
            }

            $returnmarker=$scope.map_config = {
                markers: markers,
                bounds_to_marker: true
            };         

        }).finally(function () {
            $scope.is_loading = false;
        });

    };

    // $scope.loadContent();

    var str = $location.absUrl().split("#");
    
    if(str[0]!=undefined)
        $scope.basepath=str[0]+"#/overview";

    $scope.searchviewurl=$scope.basepath+"/hfiveplaces/mobile_searchpage/index/value_id/"+$scope.value_id;
    $scope.listviewurl=$scope.basepath+"/hfiveplaces/mobile_list/index/value_id/"+$scope.value_id;
    $scope.mapviewurl=$scope.basepath+"/hfiveplaces/mobile_list_map/index/value_id/"+$scope.value_id;

    $scope.header_right_button = {
        action: $scope.post,
        title: "ListView"
    };

    $scope.setmodaldatafunc = function(addressid){
        if(addressid!=""){
            for(var i = 0; i < $scope.collection.length; i++) {
                var place = $scope.collection[i];
                if(place.id==addressid){                
                    $scope.mappicture=place.picture;
                    $scope.maptitle=place.title;
                    $scope.mapchildcare=place.content;
                    $scope.maplink=$scope.basepath+place.url;  
                    $scope.mapaddress=place.address.address;
                    if(place.daycare!==""){
                        $scope.mapchildcare=place.daycare.childcare_provider;
                        $scope.mapwebsite=place.daycare.website;
                        $scope.mapemail="mailto:"+place.daycare.email;
                        $scope.mapphone="tel:"+place.daycare.phone_number;
                    }
                }
            }
        }        
    }    


    $scope.showItem = function(item) {
        $state.go("facebook-view", {value_id: $scope.value_id, post_id: item.id});
    };
}).controller('HcmsViewController', function($cordovaSocialSharing, $http, $location, $scope, $stateParams, $timeout, $translate, Application, Hfiveplaces, Url/*, Pictos*/) {

    $scope.$on("connectionStateChange", function(event, args) {
        if(args.isOnline == true) {
            $scope.loadContent();
        }
    });

    $scope.social_sharing_active = false;
    $scope.is_loading = true;
    $scope.value_id = Hfiveplaces.value_id = $stateParams.value_id;

    $scope.loadContent = function() {
        Hfiveplaces.findcmsAll($stateParams.page_id).success(function(data) {
            $scope.social_sharing_active = !!(data.social_sharing_active == 1 && !Application.is_webview);
           
            $scope.detaildaycare = data.daycare;            

            $scope.blocks = data.blocks;
            $scope.page = data.page;

            if($scope.page) {
                $scope.template_header = "templates/hfiveplaces/page/l1/view/subheader.html";
            }

            $scope.page_title = data.page_title;

        }).error(function() {

        }).finally(function() {
            $scope.is_loading = false;
        });

    };

    $scope.share = function () {

        // Fix for $cordovaSocialSharing issue that opens dialog twice
        if($scope.is_sharing) return;

        $scope.is_sharing = true;

        var app_name = Application.app_name;
        var message = "";
        var link = DOMAIN + "/application/device/downloadapp/app_id/" + Application.app_id;
        var subject = "";
        var file = "";

        angular.forEach($scope.blocks, function (block) {
            if (block.gallery) {
                if (block.gallery.length > 0 && file === null) {
                    file = block.gallery[0].url;
                }
            }
        });

        message = $translate.instant("Hi. I just found: $1 in the $2 app.").replace("$1", $scope.page_title).replace("$2", app_name);

        $cordovaSocialSharing
            .share(message, subject, file, link) // Share via native share sheet
            .then(function (result) {
                $scope.is_sharing = false;
            }, function (err) {
                console.log(err);
                $scope.is_sharing = false;
            });
    };

    $scope.onShowMap = function (block) {

        params = {};

        if(block.latitude && block.longitude) {
            params.latitude = block.latitude;
            params.longitude = block.longitude;
        } else if(block.address) {
            params.address = encodeURI(block.address);
        }

        params.title = block.label;
        params.value_id = $scope.value_id;

        $location.path(Url.get("map/mobile_view/index", params));
    };

    $scope.addToContact = function(contact) {

        var contact = { firstname: $scope.place.title };

        if($scope.place.phone) contact.phone = $scope.place.phone;
        if($scope.place.picture) contact.image_url = $scope.place.picture;
        if($scope.place.address.street) contact.street = $scope.place.address.street;
        if($scope.place.address.postcode) contact.postcode = $scope.place.address.postcode;
        if($scope.place.address.city) contact.city = $scope.place.address.city;
        if($scope.place.address.state) contact.state = $scope.place.address.state;
        if($scope.place.address.country) contact.country = $scope.place.address.country;

        $scope.message = new Message();
    };

    $scope.loadContent();

}).controller('HsearchpageController', function ($cordovaGeolocation, $q, $scope, $state, $stateParams, $translate, Hfiveplaces, $location, HfiveGoogleMaps, $window, $rootScope) {

    $scope.searchquery="";
    $scope.$on("connectionStateChange", function(event, args) {
        if(args.isOnline == true) {
            $scope.loadContent();
        }
    });

    // $scope.header_left_button = {
    //     action: $scope.clearsearch,
    //     title: "Clear"
    // };

    $scope.is_loading = true;
    $scope.value_id = Hfiveplaces.value_id = $stateParams.value_id;

    $cordovaGeolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }).then(function(position) {
        $scope.position = position.coords;
        $scope.loadContent();
    }, function() {
        $scope.loadContent();
    });

    $scope.loadContent = function () {
        Hfiveplaces.findsearchformAll().success(function (data) {
            $scope.page_title = data.page_title;  
        }).finally(function () {
            $scope.is_loading = false;
        });

    };

    $scope.clearsearch = function(){
        $rootScope.searchquery="";
        $rootScope.$emit("callMapController", "");
        $state.go("hfiveplaces-list-map", {value_id: $scope.value_id}, { reload: true });
    }

    $scope.search = function(query){
        $rootScope.searchquery=query;
        $rootScope.$emit("callMapController", query);
        $state.go("hfiveplaces-list-map", {value_id: $scope.value_id}, { reload: true });
    }
    
    $scope.searchsingle = function(query){
        $rootScope.searchquery=query;
        $rootScope.$emit("callMapController", query);
        $state.go("hfiveplaces-list-map", {value_id: $scope.value_id}, { reload: true });
    }


    $scope.showItem = function(item) {
        $state.go("hfiveplaces-view", {value_id: $scope.value_id, page_id: item.id});
    };

    // $scope.loadContent();

    var str = $location.absUrl().split("#");
    $scope.basepath="";
    if(str[0]!=undefined)
        $scope.basepath=str[0]+"#/overview";

    $scope.listviewurl=$scope.basepath+"/hfiveplaces/mobile_list/index/value_id/"+$scope.value_id;
    $scope.mapviewurl=$scope.basepath+"/hfiveplaces/mobile_list_map/index/value_id/"+$scope.value_id;

});

function setmodaldata(elem){
    angular.element(document.getElementById('modaladdressid')).scope().setmodaldatafunc(elem.value);
}

function seachdata(){

    console.log(document.getElementsByName('radio-group').value);

    var elem=document.getElementById('searchschool').value;

    var area="";
    if(document.querySelector('input[name = "radio-group"]:checked')!=undefined){
        var area=document.querySelector('input[name = "radio-group"]:checked').value;
    }

    var neaybydata="";
    if(area=="City"){
        neaybydata=document.getElementById('cityinput').value;
    }else{
        neaybydata="Closest";
    }

    var requst={
        schoolname:elem,
        postal:document.getElementById('postalcode').value,
        nearby:neaybydata,
        address:document.getElementById('cityinput').value,
        childcare_provider:document.getElementById('center_type').value,
        teaching_method:document.getElementById('teaching_method').value,
        programs_by_age:document.getElementById('program_age').value,
        program_capacity:document.getElementById('children_capacity').value,
        service_language:document.getElementById('language').value,
        current_spots:document.getElementById('currentspots').value
    };

    var json = JSON.stringify(requst);
    console.log("query",json);
    angular.element(document.getElementById('searchbtn')).scope().search(json);    
}

function seachsimpledata(){
    var elem=document.getElementById('searchschool').value;

    var requst={
        schoolname:elem,
        singlesearch:true
    };
    var json = JSON.stringify(requst);
    angular.element(document.getElementById('searcsimplehbtn')).scope().searchsingle(json); 
}

function showadvancesearch(){
    document.getElementById("advancebtn").style.display = 'none';
    document.getElementById("searcsimplehbtn").style.display = 'none';
    document.getElementById("advancesearch").style.display = 'block';
    document.getElementById("searchbtn").style.display = 'block';
}

function showCity(){
    document.getElementById("citybox").style.display = 'block';
}

function hideCity(){
    document.getElementById("citybox").style.display = 'none';
}