/**
 * Application top level logic.
 */

/*jslint browser: true, white: true, vars: true */
/*global $, chrome, console, radar */

var app = (function() {
    'use strict';

    var completeInit = function(data) {
        if (!data) {
            data = radar.data.getDefault();
        }
        
        radar.data.setIds(data.sectors);
        radar.data.set(data);

        // Complete when the document is ready.
        $(function() {
            radar.init();
            app.files.init();
        });
    };

    var completeRead = function(result) {
        if (result) { completeInit(JSON.parse(result)); }
        else { completeInit(radar.data.getDefault()); }
    };
    
    // Try to load the last saved file entry from local storage.
    // If not found use default data.
    var init = function() {
        try {
            chrome.storage.local.get('lastSavedRadarEntry', function(data) {
                if ((data !== undefined) && (data.lastSavedRadarEntry !== undefined)) {
                    chrome.fileSystem.restoreEntry(data.lastSavedRadarEntry, function(entry) {
                        if (entry) {
                            app.files.readFileEntry(entry, completeRead);
                        }
                        else {
                            completeInit(radar.data.getDefault());
                        }
                    });
                }
                else {
                    completeInit(radar.data.getDefault());
                }
            });
        }
        catch (err) {
            console.log(err);
            completeInit(radar.data.getDefault());
        }
    };
            
    return { init: init };
}());