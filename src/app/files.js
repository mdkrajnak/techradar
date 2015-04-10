/**
 * Implements file open/save logic.
 */

/*global app, console, radar */

app.files = function() {
    'use strict';

    /** Generic handler for IO operations. */
    var errorHandler = function(e) {
        console.log('Error: ' + e.code);
    };
    
    /**
     * Given the data file contents as a string, load the data into memory.
     */
    var loadFileData = function(result) {
        try {
            var data = JSON.parse(result);
            
            radar.data.setIds(data.sectors);
            radar.data.set(data);
            radar.legend.update();
            radar.view.redraw();
            radar.menu.closeMenu();
        }
        catch (err) {
            radar.menu.setMsg('Unable to parse file.');
        }
    };

    /** 
     * Read an entry from the file system.
     * return entry as text
     */
    var readFileEntry = function(fileEntry, callback) {
        if (fileEntry === undefined) return;
        
        chrome.storage.local.set(
            {lastSavedRadarEntry: chrome.fileSystem.retainEntry(fileEntry)});
        
        fileEntry.file(function(file) {
            var reader = new FileReader();

            reader.onerror = errorHandler;
            reader.onload = function(e) {
                callback(e.target.result);
            };

            reader.readAsText(file);
      });
    };

    /**
     * Show the open dialog.
     * lastError.message will be user cancelled if cancelled.
     */
    var openFileDialog = function(fname) {
        chrome.fileSystem.chooseEntry(
            {type: 'openFile', suggestedName: fname},
            function(entry) {
                if ((chrome.runtime.lastError == undefined) && (entry != undefined)) {
                    entry.file(function(file) {
                        readFileEntry(entry, loadFileData);
                    });
                }
            });
    };

    var openFileHandler = function() {
        chrome.storage.local.get('lastSavedRadarEntry', function(data) {
            if ((chrome.runtime.lastError == undefined) && (data.lastSavedRadarEntry != undefined)) {
                chrome.fileSystem.restoreEntry(data.lastSavedRadarEntry, function(entry) {
                    if ((chrome.runtime.lastError == undefined) && (entry != undefined)) {
                        chrome.fileSystem.getDisplayPath(entry, function(path) {
                            if (chrome.runtime.lastError == undefined) {
                                openFileDialog(path);
                            }
                            else {
                                console.log("Unable to retrieve file path, open using default file name.");
                                openFileDialog('radar.json');
                            }
                        });
                    }
                    else {
                        console.log("Unable to retrieve last saved entry, open using default file name.");
                        openFileDialog('radar.json');
                    }
                });
            }
            else {
                console.log("Unable to retrieve file entry from storage, open using default file name.");
                openFileDialog('radar.json');
            }
        });
    };

    var saveFileEntry = function(fileEntry, content) {
        fileEntry.createWriter(function(fileWriter) {
            if (chrome.runtime.lastError == undefined) {
                fileWriter.onwriteend = function(e) {
                    fileWriter.onwriteend = null;
                    fileWriter.truncate(content.length);
                    radar.menu.closeMenu();

                    chrome.storage.local.set(
                        {lastSavedRadarEntry: chrome.fileSystem.retainEntry(fileEntry)});
                };
                fileWriter.onerror = function(e) {
                  console.log('Write failed: ' + e.toString());
                };
                var blob = new Blob([content], {'type': 'text/plain'});
                fileWriter.write(blob);
            }
          }, errorHandler);
    };

    /** 
     * Show the save dialog.
     * lastError.message will be user cancelled if cancelled.
     */
    var saveFileDialog = function(fname) {
        chrome.fileSystem.chooseEntry(
            {type: 'saveFile', suggestedName: fname},
            function(entry) {
                if (chrome.runtime.lastError == undefined) {
                    saveFileEntry(entry, JSON.stringify(radar.data.get()));
                }
            });
    };
    
    /* Handle clicks on the save menu. */
    var saveFileHandler = function() {
        chrome.storage.local.get('lastSavedRadarEntry', function(data) {
            if ((chrome.runtime.lastError == undefined) && (data.lastSavedRadarEntry != undefined)) {
                chrome.fileSystem.restoreEntry(data.lastSavedRadarEntry, function(entry) {
                    chrome.fileSystem.getDisplayPath(entry, function(path) {
                        if (chrome.runtime.lastError == undefined) {
                            saveFileDialog(path);
                        }
                        else {
                            console.log("Unable to retrieve file path, open using default file name.");
                            saveFileDialog('radar.json');
                        }
                    });
                });
            }
            else {
                console.log("Unable to retrieve last saved entry, open using default file name.");
                saveFileDialog('radar.json');
            }
        });
    };
    
    /** Attach event handlers to the menu items in the menu. */
    var init = function () {
        
        var openFile = document.querySelector('#open-file');
        var saveFile = document.querySelector('#save-file');
        var printWin = document.querySelector('#print-win');
        var helpFile = document.querySelector('#open-help');
        
        printWin.addEventListener('click', function() {
            radar.menu.closeMenu();
            chrome.app.window.current().contentWindow.print();
        });

        helpFile.addEventListener('click', function() {
            chrome.app.window.create(
                'radar/help.html',
                {innerBounds: {width: 645, height: 700}});
            radar.menu.closeMenu();
        });

        /* Do file open dialog. */
        openFile.addEventListener('click', function() {
            radar.menu.clearMsg();
            openFileHandler();
        });
        
        /* hide active menu if close menu button is clicked */
        saveFile.addEventListener('click', function() {
            radar.menu.clearMsg();
            saveFileHandler();
        });
    };
    
    return { init: init, readFileEntry: readFileEntry };
}();
