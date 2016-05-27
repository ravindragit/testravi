var AVAILABLE_LANGUAGES = new Array("en");

/**
 * Find navigator preferred language
 */
var language = "en";
if(navigator.language) {
    try {
        language = navigator.language.split("-")[0];
    } catch(e) {
        language = "en";
    }
}