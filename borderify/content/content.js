console.log("LeetCode content script loaded.");

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "RUN_TRACK_SUBMISSION") {
        window.onload = () => {
            const onSubmissionsPage = window.location.href.includes('/submissions/#/1');
            if (onSubmissionsPage) {
                TrackSubmission();
            }
        }
    }
});

function goestoReqURL() {
     //goes to submission page basically and forward the required url to the next function
    const targetUrl = `${window.location.origin}/submissions/#/1`;

    if (window.location.href !== targetUrl) {
        localStorage.setItem("resumeTracking", "true");
        window.location.href = targetUrl;
        return;
    }

}

function TrackSubmission() {

    let arr =[];

    setTimeout(()=>{
        if(!localStorage.getItem("lastSeenProblem")){
            
            const elementArray = document.getElementById('submission-list-app').children[0].children[0].children[1].children[0].innerText.split('\t');
            const link = document.getElementById('submission-list-app').children[0].children[0].children[1].children[0].querySelectorAll('a');

            arr.push({
                time: elementArray[0],
                question: elementArray[1],
                questionLink : link[0].href,
                submissionLink: link[1].href,
                code : ""
            })

            localStorage.setItem("lastSeenProblem", arr[0].question)

            return;
        }
        else if(localStorage.getItem("lastSeenProblem")){

            let toIterate = 0;
            const totalElements = document.getElementById('submission-list-app').children[0].children[0].children[1].childElementCount;
            
            for (var i = 0; i < totalElements; i++) {
                const elementArray = document.getElementById('submission-list-app').children[0].children[0].children[1].children[i].innerText.split('\t');

                if (elementArray[1] === localStorage.getItem("lastSeenProblem")) {
                    toIterate = i;
                    break;
                }
            }        

            for (var i = 0; i < toIterate; i++) {
                const elementArray = document.getElementById('submission-list-app').children[0].children[0].children[1].children[i].innerText.split('\t');
                const link = document.getElementById('submission-list-app').children[0].children[0].children[1].children[i].querySelectorAll('a');

                if ( elementArray[2] === "Accepted") {
                    arr.push({
                        time : elementArray[0],
                        question : elementArray[1],
                        questionLink : link[0].href,
                        submissionLink : link[1].href,
                        code : ""
                    })
                }
            }

            if (arr.length > 0) {
                localStorage.setItem("lastSeenProblem", arr[0].question);
            }
        }

        copythecode(arr);
    },2000)

    //this stores the name of the last elemet it detected as a string e.g 1.Two Sum from the browser  maybe from local storage
    //and check what all more new strings are added ;
    // it checks if the last entry is accepted if it is so then...
    //then it stores every new thing added in an array [{name:string ,href provided by the question as well, Href provided by this accepted }]

    //then this array is returned to the next functin
}

function copythecode(arr) {
    // ye copy karega to clipboard and then ye also save karega question link
    // aur ye dono data bhej dega background.js ko 

    if (arr.length === 0) {
        console.log('No new accepted submissions to process');
        return;
    }

    let currentIndex = 0;

    function processNextSubmission() {
        if (currentIndex >= arr.length) {
            console.log('All submissions processed');
            return;
        }

        const targetUrl = arr[currentIndex].submissionLink;

        if (window.location.href !== targetUrl) {
            window.location.href = targetUrl;
            return;
        }

        setTimeout(() => {
            const scripts = document.body.querySelectorAll('script');
            let clean = null;

            for (let script of scripts) {
                if (script.innerHTML.includes('submissionCode:')) {
                    try {
                        const raw = script.innerHTML.split("submissionCode:")[1].split('editCodeUrl:')[0].trim().slice(1, -2);
                        clean = raw;
                        break;
                    } catch (error) {
                        console.error('Error parsing submission code:', error);
                        continue;
                    }
                }
            }

            if (clean) {
                try {
                    const finalCode = JSON.parse(`"${clean}"`);
                    arr[currentIndex].code = finalCode;

                    if (typeof browser !== 'undefined' && browser.runtime) {
                        browser.runtime.sendMessage({
                            type: "CODE_SUBMISSION",
                            arrayData: arr[currentIndex]
                        });
                    } 
                    else {
                        console.error('Extension runtime not available');
                    }

                    currentIndex++;
                    
                    setTimeout(() => {
                        processNextSubmission();
                    }, 1000);

                } catch (error) {
                    console.error('Error parsing final code:', error);
                    currentIndex++;
                    processNextSubmission();
                }
            } else {
                console.warn('submissionCode not found in any <script> tag');
                currentIndex++;
                processNextSubmission();
            }
        }, 1500); 
    }

    processNextSubmission();
}

