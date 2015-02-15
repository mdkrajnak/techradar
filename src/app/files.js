/**
 * Implements file open/save logic.
 */

$(function(){

    var openFile = document.querySelector('#open-file');
    var saveFile = document.querySelector('#save-file');
    var helpFile = document.querySelector('#open-help');

    helpFile.addEventListener('click', function() {
        chrome.app.window.create(
            'radar/help.html',
            {innerBounds: {width: 430, height: 700}});
    })

    var errorHandler = function(e) {
      console.log('Error: ' + e.code);
    };

    var readAsText = function(fileEntry, callback) {
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
        readAsText(chosenEntry, function(result) {
            var data = JSON.parse(result)
            radar.data.setIds(data.sectors);
            radar.data.set(data);
            radar.legend.update();
            radar.view.redraw();
        });
      });
    };

    /* Do file open dialog. */
    openFile.addEventListener('click', function() {
        chrome.fileSystem.chooseEntry(
            {type: 'openFile'},
            loadFileEntry);
    });

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



    /* hide active menu if close menu button is clicked */
    saveFile.addEventListener('click', function() {
        chrome.fileSystem.chooseEntry(
            {type: 'saveFile'},
            function(entry) {
                save(entry, JSON.stringify(radar.data.get()));
            });
    });

});
