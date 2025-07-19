chrome.browserAction.onClicked.addListener(tab => {
  chrome.tabs.sendMessage(tab.id, { type: "RUN_TRACK_SUBMISSION" });
});

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === "CODE_SUBMISSION") {
    const submission = msg.arrayData;

    window.pushSolution(submission, (err, result) => {
      if (err) {
        console.error("GitHub upload failed:", err);
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icons/icon-128.png",
          title: "BeatCode Error",
          message: `Failed to upload ${submission.question}: ${err.message}`
        });
      } else {
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icons/icon-128.png",
          title: "BeatCode",
          message: `Uploaded ${submission.question}!`
        });
      }
    });
  }
});
