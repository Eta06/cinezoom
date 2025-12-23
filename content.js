let currentZoom = 1;

// Improved CSS: Targets #movie_player to prevent video from disappearing
const style = document.createElement('style');
style.innerHTML = `
  #movie_player { 
    overflow: hidden !important; 
  }
  video.html5-main-video { 
    transition: transform 0.2s ease-out; 
    transform-origin: center center !important;
    /* Forces display block to prevent YouTube from hiding it via inline styles */
    display: block !important;
  }
  
  /* Cinematic Zoom Button Styles */
  .ytp-cinematic-zoom-button {
    position: relative;
  }
  
  .ytp-cinematic-zoom-button svg {
    transition: all 0.2s ease;
  }
  
  .ytp-cinematic-zoom-button:hover svg {
    transform: scale(1.1);
  }
  
  .ytp-cinematic-zoom-button.active svg path {
    fill: #ff4757 !important;
  }
  
  .ytp-cinematic-zoom-button .zoom-indicator {
    position: absolute;
    top: 2px;
    right: 2px;
    width: 8px;
    height: 8px;
    background: #ff4757;
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  
  .ytp-cinematic-zoom-button.active .zoom-indicator {
    opacity: 1;
    animation: pulse-indicator 2s ease-in-out infinite;
  }
  
  @keyframes pulse-indicator {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.2); opacity: 0.7; }
  }
`;
document.head.appendChild(style);

// Create the cinematic zoom button
const createZoomButton = () => {
    // Check if button already exists
    if (document.querySelector('.ytp-cinematic-zoom-button')) {
        return;
    }

    const rightControls = document.querySelector('.ytp-right-controls');
    if (!rightControls) {
        return;
    }

    // Find a good insertion point (before the fullscreen button)
    const fullscreenBtn = rightControls.querySelector('.ytp-fullscreen-button');
    const sizeBtn = rightControls.querySelector('.ytp-size-button');
    const insertBefore = sizeBtn || fullscreenBtn;

    // Create the button
    const zoomButton = document.createElement('button');
    zoomButton.className = 'ytp-cinematic-zoom-button ytp-button';
    zoomButton.setAttribute('data-priority', '7');
    zoomButton.setAttribute('aria-label', 'Cinematic Zoom (Alt+Z)');
    zoomButton.setAttribute('title', '');
    zoomButton.setAttribute('data-tooltip-title', 'Cinematic Zoom (Alt+Z)');

    // SVG icon - ultrawide/cinematic screen icon
    zoomButton.innerHTML = `
        <span class="zoom-indicator"></span>
        <svg height="24" viewBox="0 0 24 24" width="24" fill="none">
            <path d="M21 3H3C1.9 3 1 3.9 1 5V17C1 18.1 1.9 19 3 19H8V21H16V19H21C22.1 19 23 18.1 23 17V5C23 3.9 22.1 3 21 3ZM21 17H3V5H21V17Z" fill="white"/>
            <path d="M6 8H18V14H6V8Z" fill="white" fill-opacity="0.4"/>
            <path d="M4 9H6V13H4V9Z" fill="white" fill-opacity="0.6"/>
            <path d="M18 9H20V13H18V9Z" fill="white" fill-opacity="0.6"/>
        </svg>
    `;

    // Insert the button
    if (insertBefore) {
        insertBefore.parentNode.insertBefore(zoomButton, insertBefore);
    } else {
        rightControls.appendChild(zoomButton);
    }

    // Update button state based on current zoom
    updateButtonState(zoomButton);

    // Button click handler
    zoomButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Get the saved custom zoom level (default to 1.334 if not set)
        chrome.storage.local.get(['ytCustomZoom'], (res) => {
            const customZoom = res.ytCustomZoom || 1.334;

            // Toggle between 100% and custom zoom level
            const target = currentZoom >= 1.05 ? 1 : customZoom;
            currentZoom = target;

            // Apply zoom
            const video = document.querySelector('video');
            if (video) {
                video.style.setProperty('transform', `scale(${currentZoom})`, 'important');
            }

            // Save state
            chrome.storage.local.set({ ytZoomLevel: currentZoom });

            // Update button appearance
            updateButtonState(zoomButton);
        });

        // Update button appearance
        updateButtonState(zoomButton);
    });

    console.log('[Cinematic Zoom] Button added to YouTube controls');
};

// Update button visual state
const updateButtonState = (button) => {
    if (!button) {
        button = document.querySelector('.ytp-cinematic-zoom-button');
    }
    if (!button) return;

    if (currentZoom >= 1.3) {
        button.classList.add('active');
        button.setAttribute('data-tooltip-title', 'Disable Cinematic Zoom (Alt+Z)');
    } else {
        button.classList.remove('active');
        button.setAttribute('data-tooltip-title', 'Cinematic Zoom (Alt+Z)');
    }
};

const applyStoredZoom = () => {
    chrome.storage.local.get(['ytZoomLevel'], (res) => {
        const val = res.ytZoomLevel || 1;
        currentZoom = val;
        const video = document.querySelector('video');
        if (video) {
            // use setProperty with 'important' to override YouTube's inline styles
            video.style.setProperty('transform', `scale(${val})`, 'important');
        }
        updateButtonState();
    });
};

// Handle YouTube's "Soft" page navigation (AJAX)
document.addEventListener('yt-navigate-finish', () => {
    applyStoredZoom();
    // Try to add button after navigation
    setTimeout(createZoomButton, 500);
    setTimeout(createZoomButton, 1500);
});

// Watch for changes (fullscreen, quality change) to re-apply zoom if YT removes it
const observer = new MutationObserver((mutations) => {
    const video = document.querySelector('video');
    if (video) {
        const targetScale = `scale(${currentZoom})`;
        if (video.style.transform !== targetScale) {
            video.style.setProperty('transform', targetScale, 'important');
        }
    }

    // Also try to add button if it doesn't exist
    if (!document.querySelector('.ytp-cinematic-zoom-button')) {
        createZoomButton();
    }
});

// Start observing the player specifically
const setupObserver = () => {
    const player = document.querySelector('#movie_player');
    if (player) {
        observer.observe(player, { attributes: true, subtree: true, childList: true, attributeFilter: ['style'] });
        createZoomButton();
    } else {
        // Retry if player isn't loaded yet
        setTimeout(setupObserver, 1000);
    }
};

// Initial setup
applyStoredZoom();
setupObserver();

// Also try to add button on initial load with delays
setTimeout(createZoomButton, 1000);
setTimeout(createZoomButton, 2000);
setTimeout(createZoomButton, 3000);

// Listen for messages from background (shortcut) or popup (slider)
chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "SET_ZOOM") {
        currentZoom = msg.value;
        const video = document.querySelector('video');
        if (video) {
            video.style.setProperty('transform', `scale(${currentZoom})`, 'important');
        }
        updateButtonState();
    }
});

// Listen for storage changes (from popup or keyboard shortcut)
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.ytZoomLevel) {
        currentZoom = changes.ytZoomLevel.newValue;
        const video = document.querySelector('video');
        if (video) {
            video.style.setProperty('transform', `scale(${currentZoom})`, 'important');
        }
        updateButtonState();
    }
});