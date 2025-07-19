// utils/github.js

/**
 * Retrieves the stored GitHub Personal Access Token (PAT).
 * @param {function(string=):void} callback
 */
function getPersonalAccessToken(callback) {
  chrome.storage.sync.get("githubPAT", ({ githubPAT }) => {
    callback(githubPAT);
  });
}

/**
 * Pushes a LeetCode solution file to your GitHub repository.
 * @param {{question: string, code: string}} submission
 * @param {function(Error=, Object=):void} callback
 */
function pushSolution(submission, callback) {
  getPersonalAccessToken(token => {
    if (!token) {
      return callback(new Error("GitHub PAT not set. Please configure it."));
    }

    const fileName = submission.question
      .replace(/[^\w\- ]/g, "")
      .replace(/\s+/g, "_") + ".js";
    const filePath = `leetcode_solutions/${fileName}`;
    const url = `https://api.github.com/repos/ask-elad/DSA_leetcode/contents/${filePath}`;

    // Base64-encode the code
    const base64Content = btoa(unescape(encodeURIComponent(submission.code)));

    fetch(url, {
      method: "PUT",
      headers: {
        "Authorization": "token " + token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: `Add solution for ${submission.question}`,
        content: base64Content
      })
    })
      .then(resp => {
        if (!resp.ok) {
          return resp.json().then(errJson => {
            throw new Error(errJson.message || resp.statusText);
          });
        }
        return resp.json();
      })
      .then(json => callback(null, json))
      .catch(err => callback(err));
  });
}

// Expose to background.js
window.pushSolution = pushSolution;
