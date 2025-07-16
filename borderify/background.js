//yaha par logic aaega

// settime out function jo har 10 minute pr script se kaam karwaega
//conten.js ka data recieve karega 

// structure karega 
// notify karega jab jab ho jaega   
console.log("✅ background.js loaded");


chrome.runtime.onStartup.addListener(() => {
    chrome.tabs.create({ url: "https://leetcode.com/submissions/#/1", active: false }, (tab) => {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
                chrome.runtime.sendMessage({ type: "RUN_TRACK_SUBMISSION" });
            }
        });
    });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Received message in background.js:", message);
});