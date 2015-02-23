/**
 * Application top level logic.
 */

/*global $, app, console, radar */

var app = function() {
    'use strict';

    var completeInit = function(data) {
//        if (data === undefined) {
//            data = radar.data.getDefault();
//        }
//        else {
//            data = JSON.parse(data);
//        }
        console.log('completeInit() called');
        
        radar.data.setIds(data.sectors);
        radar.data.set(data);

        console.log('data is set');
        
        // Complete when the document is ready.
        $(function() {
            radar.init();
            app.files.init();
        });
    };

    // Try to load the last saved file entry from local storage.
    // If not found use default data.
    var init = function() {
//        chrome.storage.local.get('lastSavedRadarEntry', function(data) {
//            if ((data != undefined) && (data.lastSavedRadarEntry != undefined)) {
//                chrome.fileSystem.restoreEntry(data.lastSavedRadarEntry, function(entry) {
//                    if (entry) {
//                        app.files.readFileEntry(entry, completeInit);
//                    }
//                    else {
//                        completeInit(radar.data.getDefault());
//                    }
//                });
//            }
//            else {
//                completeInit(radar.data.getDefault());
//            }
//        });
        completeInit(radar.data.getDefault());
    };
            
    return { init: init };
}();