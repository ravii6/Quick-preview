const delayInput = document.getElementById('delay');
const widthInput = document.getElementById('width');
const infinityPreviewCheckbox = document.getElementById('infinityPreview');

// Load user settings from Chrome storage
chrome.storage.sync.get(null, (data) => {
  delayInput.value = data.delay || 2;
  widthInput.value = data.width || 80;
  infinityPreviewCheckbox.checked = data.infinity || false; // Set checkbox based on saved settings
});

// Save the settings when "Save" button is clicked
document.getElementById('save').addEventListener('click', () => {
  chrome.storage.sync.set({
    delay: parseFloat(delayInput.value),    // Save delay value
    width: parseInt(widthInput.value),      // Save width value
    infinity: infinityPreviewCheckbox.checked // Save infinity preview setting
  });
});

// Reset the settings to default values when "Reset" button is clicked
document.getElementById('reset').addEventListener('click', () => {
  delayInput.value = 2;
  widthInput.value = 80;
  infinityPreviewCheckbox.checked = false;
  chrome.storage.sync.set({
    delay: 2,
    width: 80,
    infinity: false
  });
});