function loadjscssfile(filename, filetype){
    if (filetype=="js"){ //if filename is a external JavaScript file
        var fileref=document.createElement('script')
        fileref.setAttribute("type","text/javascript")
        fileref.setAttribute("async","false")
        fileref.setAttribute("src", filename)
    }
    else if (filetype=="css"){ //if filename is an external CSS file
        var fileref=document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", filename)
    }
    if (typeof fileref!="undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)
}

// h5 libraries
loadjscssfile("js/libraries/h5_lib.js", "js");

// load izoomer plugin
loadjscssfile("js/controllers/izoomer.js", "js");
loadjscssfile("css/izoomer.css", "css");

// load ga plugin
loadjscssfile("js/controllers/ga.js", "js");

// load loginredirect plugin
loadjscssfile("js/controllers/loginredirect.js", "js");
loadjscssfile("js/factory/loginredirect.js", "js");

// load places plugin
loadjscssfile("js/directives/hfive-maps.js", "js");
loadjscssfile("js/services/hfive-google-maps.js", "js");
loadjscssfile("js/controllers/hfiveplaces.js", "js");
loadjscssfile("js/factory/hfiveplaces.repository.js", "js");