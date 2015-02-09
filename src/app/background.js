/**
 * Listens for the app launching then opens a new window/tab.
 *
 * Use https://developer.chrome.com/apps/system_display to get display info, currently does not work.
 */
chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create(
        'app/radar.html', 
        {innerBounds: {width: 960, height: 700}}); 
});
