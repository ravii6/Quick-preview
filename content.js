let userSettings = {
  delay: 2000,
  width: 80,
  infinity: false
};
 
let hoverTimer;
let previewBox;
let closeTimer;

// Load user settings from Chrome storage
chrome.storage.sync.get(null, (data) => {
  userSettings = {
    delay: (data.delay || 2) * 1000,    // Delay in milliseconds
    width: data.width || 80,            // Width of the preview box
    infinity: data.infinity || false    // Infinite preview setting
  };
  setupLinkHover();
});

// Setup hover event to show preview
function setupLinkHover() {
  document.addEventListener('mouseover', (event) => {
    const link = event.target.closest('a');
    if (!link || !link.href || link.href.startsWith('javascript:')) return;

    clearTimeout(hoverTimer);

    link.addEventListener('mouseleave', handleMouseLeave, { once: true });

    hoverTimer = setTimeout(() => {
      showLivePreview(link.href);
    }, userSettings.delay);
  });
}

// When mouse leaves the link before delay, close preview if not in infinity mode
function handleMouseLeave() {
  clearTimeout(hoverTimer);

  if (previewBox && !userSettings.infinity) {
    closeTimer = setTimeout(() => {
      if (previewBox && !previewBox.matches(':hover')) {
        removePreview();
      }
    }, 500); // 0.5s delay before closing
  }
}

// Show the preview of the link in the floating box
function showLivePreview(url) {
  removePreview(); // Remove any previous preview

  previewBox = document.createElement('iframe');
  previewBox.src = url;

  // Styling the preview box
  previewBox.style.position = 'fixed';
  previewBox.style.top = '0';
  previewBox.style.left = `${(100 - userSettings.width) / 2}%`; // Center the box
  previewBox.style.width = `${userSettings.width}vw`;
  previewBox.style.height = '100vh'; // Full screen height
  previewBox.style.border = 'none';
  previewBox.style.zIndex = '9999';
  previewBox.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.3)';
  previewBox.style.transition = 'opacity 0.3s ease';
  previewBox.style.opacity = '0';
  previewBox.style.background = '#fff';
  previewBox.style.pointerEvents = 'auto';

  // Append and fade in the preview
  document.body.appendChild(previewBox);
  requestAnimationFrame(() => {
    previewBox.style.opacity = '1';
  });

  // Handle mouse leave behavior
  previewBox.addEventListener('mouseleave', () => {
    if (!userSettings.infinity) {
      closeTimer = setTimeout(() => {
        if (!previewBox.matches(':hover')) {
          removePreview();
        }
      }, 500);
    }
  });

  // Cancel close if the mouse enters the preview
  previewBox.addEventListener('mouseenter', () => {
    clearTimeout(closeTimer);
  });
}

// Remove the preview box
function removePreview() {
  if (previewBox) {
    previewBox.remove();
    previewBox = null;
  }
}
