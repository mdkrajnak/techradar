/**
 * Implements file open/save logic.
 */

/*global app, console, radar */

app.files = function() {
    'use strict';

    var errorHandler = function(e) {
        console.log('Error: ' + e.code);
    };
    
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

    var readFileEntry = function(fileEntry, callback) {
        if (fileEntry === undefined) return;
        chrome.storage.local.set({lastSavedRadarEntry: chrome.fileSystem.retainEntry(fileEntry)});
        
        fileEntry.file(function(file) {
            var reader = new FileReader();

            reader.onerror = errorHandler;
            reader.onload = function(e) {
                callback(e.target.result);
            };

            reader.readAsText(file);
      });
    };

    var loadFileEntry = function(chosenEntry) {
        chosenEntry.file(function(file) {
            readFileEntry(chosenEntry, loadFileData);
        });
    };

    var save = function(fileEntry, content) {
        fileEntry.createWriter(function(fileWriter) {
            fileWriter.onwriteend = function(e) {
                fileWriter.onwriteend = null;
                fileWriter.truncate(content.length);
                radar.menu.closeMenu();
                
                chrome.storage.local.set({lastSavedRadarEntry: chrome.fileSystem.retainEntry(fileEntry)});
            };
            fileWriter.onerror = function(e) {
              console.log('Write failed: ' + e.toString());
            };
            var blob = new Blob([content], {'type': 'text/plain'});
            fileWriter.write(blob);
          }, errorHandler);
    };

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
            chrome.fileSystem.chooseEntry(
                {type: 'openFile'},
                loadFileEntry);
        });
        
        /* hide active menu if close menu button is clicked */
        saveFile.addEventListener('click', function() {
            radar.menu.clearMsg();
            chrome.fileSystem.chooseEntry(
                {type: 'saveFile'},
                function(entry) {
                    save(entry, JSON.stringify(radar.data.get()));
                });
        });
    };
    
    return { init: init, readFileEntry: readFileEntry };
}();
