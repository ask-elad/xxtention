// option.js

const input = document.getElementById('patInput');
const saveButton = document.getElementById('save');

// On load, populate the field from storage
chrome.storage.sync.get('githubPAT', ({ githubPAT }) => {
  if (githubPAT) input.value = githubPAT;
});

// Save button stores the PAT
saveButton.addEventListener('click', () => {
  const token = input.value.trim();
  chrome.storage.sync.set({ githubPAT: token }, () => {
    // You can replace alert with a nicer in-page notification if you like
    alert('GitHub token saved!');
  });
});
