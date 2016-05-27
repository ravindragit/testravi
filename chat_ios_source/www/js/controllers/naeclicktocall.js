

App.run(function($rootScope,$http,Url) {

	$http({
                method: 'GET',
                url: Url.get("naeclicktocall/mobile_view/findall", {}),
                cache: false,
                responseType:'json'
            }).success(function(data) {
            	if(data.tel!=''){
            	$rootScope.naeTel = data.tel;
            	$("#nae_clicktocall").parent().attr("href","tel:"+data.tel);
            	if($rootScope.currentPage=="home")
            		$("#nae_clicktocall").parent().show();

           	 }

                //alert(data.tel);

                // Contact.coordinates.latitude = 12.8399389;
                // Contact.coordinates.longitude = 77.67700309999998;
               
                
            });

    $rootScope.$on('$stateChangeStart', function(event, current, previous) { 
    		
    		if($("#nae_clicktocall").length>0 && current.name=="home" && $rootScope.naeTel!='')
            	    $("#nae_clicktocall").parent().show();
           	
    		if( ( $("#nae_clicktocall").length>0 && current.name!="home") || $rootScope.naeTel=='' || $rootScope.naeTel=== undefined)
           			$("#nae_clicktocall").parent().hide();



    		if($("#nae_clicktocall").length==0){
    			$rootScope.currentPage = current.name;
	    		var clicktocalldiv = document.createElement('div');
	            clicktocalldiv.innerHTML = '<a href="tel:'+$rootScope.naeTel+'" style="display:none;"><img id="nae_clicktocall" src="'+BASE_URL+'/../images/library/naeclicktocall/phone.png"  style="position: absolute;right: 5%;top: 5%;z-index: 9999999;cursor: pointer;width:55px;"></a>';
	            document.body.appendChild(clicktocalldiv);
        	}

             
    });





    

});


