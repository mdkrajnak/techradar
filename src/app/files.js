/**
 * Implements file open/save logic.
 */

$(function(){

    var openFile = document.querySelector('#open-file');
    var saveFile = document.querySelector('#save-file');

    var errorHandler = function(e) {
      console.log('Error: ' + e.code);
    };
    
    var save = function(fileEntry, content) {
        fileEntry.createWriter(function(fileWriter) {
            fileWriter.onwriteend = function(e) {
              fileWriter.onwriteend = null;
              fileWriter.truncate(content.length);
            };
            fileWriter.onerror = function(e) {
              console.log('Write failed: ' + e.toString());
            };
            var blob = new Blob([content], {'type': 'text/plain'});
            fileWriter.write(blob);
          }, errorHandler);
    };
    
    /* Do file open dialog. */
    openFile.addEventListener('click', function() {
        chrome.fileSystem.chooseEntry(
            {type: 'openFile'},
            function(entry, entries) { console.log('open file'); });
    });

    /* hide active menu if close menu button is clicked */
    saveFile.addEventListener('click', function() {
        chrome.fileSystem.chooseEntry(
            {type: 'saveFile'},
            function(entry) {
                save(entry, JSON.stringify(radar.data.get()));
            });
    });

});