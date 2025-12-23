const slider = document.getElementById('zoomSlider');
const valLabel = document.getElementById('val');
const toggleBtn = document.getElementById('toggleBtn');
const btnText = document.getElementById('btnText');
const statusIndicator = document.getElementById('statusIndicator');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const presetBtns = document.querySelectorAll('.preset-btn');

// UI State Management
const updateUI = (zoomValue) => {
    const isZoomed = zoomValue > 1.05;

    // Update status indicator
    if (isZoomed) {
        statusIndicator.classList.remove('inactive');
        statusIndicator.classList.add('active');
        statusDot.classList.remove('inactive');
        statusDot.classList.add('active');
        statusText.textContent = 'Ultrawide';
        toggleBtn.classList.add('active');
        btnText.textContent = 'Disable Ultrawide';
    } else {
        statusIndicator.classList.remove('active');
        statusIndicator.classList.add('inactive');
        statusDot.classList.remove('active');
        statusDot.classList.add('inactive');
        statusText.textContent = 'Standard';
        toggleBtn.classList.remove('active');
        btnText.textContent = 'Enable 21:9 Ultrawide';
    }

    // Update slider and value display
    slider.value = Math.round(zoomValue * 100);
    valLabel.textContent = Math.round(zoomValue * 100);

    // Update slider track gradient
    const percent = ((zoomValue * 100 - 100) / 100) * 100;
    slider.style.background = `linear-gradient(90deg, 
        rgba(255, 71, 87, 0.8) 0%, 
        rgba(255, 0, 0, 0.6) ${percent}%, 
        rgba(255,255,255,0.1) ${percent}%, 
        rgba(255,255,255,0.1) 100%)`;

    // Update preset buttons
    const zoomPercent = Math.round(zoomValue * 100);
    presetBtns.forEach(btn => {
        const presetValue = parseInt(btn.dataset.zoom);
        if (Math.abs(zoomPercent - presetValue) < 5) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
};

// Load saved value on open
chrome.storage.local.get(['ytZoomLevel', 'ytCustomZoom'], (res) => {
    const val = res.ytZoomLevel || 1;
    updateUI(val);
});

// Helper to save and send message
const saveAndMsg = (val, isCustomZoom = false) => {
    // Save current zoom level
    chrome.storage.local.set({ ytZoomLevel: val });

    // If this is a custom zoom (> 100%), also save it as the preferred custom level
    // This is what the toggle button will use
    if (isCustomZoom && val > 1.05) {
        chrome.storage.local.set({ ytCustomZoom: val });
    }

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) chrome.tabs.sendMessage(tabs[0].id, { type: "SET_ZOOM", value: val });
    });
};

// Slider Event - saves as custom zoom when > 100%
slider.addEventListener('input', (e) => {
    const level = e.target.value / 100;
    updateUI(level);
    saveAndMsg(level, true); // Mark as custom zoom
});

// Button Event - Toggle between 100% and saved custom zoom
toggleBtn.addEventListener('click', () => {
    chrome.storage.local.get(['ytZoomLevel', 'ytCustomZoom'], (res) => {
        const current = res.ytZoomLevel || 1;
        const customZoom = res.ytCustomZoom || 1.334; // Default to 133.4% if no custom set

        // Toggle: if currently zoomed, go to 100%. Otherwise, go to custom zoom.
        const target = current >= 1.05 ? 1 : customZoom;
        updateUI(target);
        saveAndMsg(target, false); // Don't overwrite custom zoom when toggling
    });
});

// Preset Buttons - save as custom zoom
presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const zoomPercent = parseInt(btn.dataset.zoom);
        const zoomValue = zoomPercent / 100;
        updateUI(zoomValue);
        saveAndMsg(zoomValue, true); // Mark as custom zoom
    });
});

// Listen for external zoom changes (from keyboard shortcut or player button)
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.ytZoomLevel) {
        updateUI(changes.ytZoomLevel.newValue);
    }
});