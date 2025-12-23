chrome.commands.onCommand.addListener((command) => {
    if (command === "toggle-zoom") {
        chrome.storage.local.get(['ytZoomLevel', 'ytCustomZoom'], (res) => {
            const current = res.ytZoomLevel || 1;
            const customZoom = res.ytCustomZoom || 1.334; // Default to 133.4%

            // Toggle between 100% and saved custom zoom level
            const next = current >= 1.05 ? 1 : customZoom;

            // Save new state
            chrome.storage.local.set({ ytZoomLevel: next });

            // Send to active tab
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0]) {
                    chrome.tabs.sendMessage(tabs[0].id, { type: "SET_ZOOM", value: next });
                }
            });
        });
    }
});