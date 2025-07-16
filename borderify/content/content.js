console.log("LeetCode content script loaded.");

let arr =[];

function goestoReqURL() {
     //goes to submission page basically and forward the required url to the next function
    const targetUrl = `${window.location.origin}/submissions/#/1`;

    if (window.location.href !== targetUrl) {
        window.location.href = targetUrl;
    } else {
        TrackSubmission(targetUrl);
    }
}

function TrackSubmission(url) {

    if(!localStorage.getItem("lastSeenProblem")){
        
        const elementArray = document.getElementById('submission-list-app').children[0].children[0].children[1].children[0].innerText.split('\t');
        const link = document.getElementById('submission-list-app').children[0].children[0].children[1].children[0].querySelectorAll('a');

        arr.push({
            time: elementArray[0],
            question: elementArray[1],
            questionLink : link[0].href,
            submissionLink: link[1].href
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
                })
            }
        }

        if (arr.length > 0) {
            localStorage.setItem("lastSeenProblem", arr[0].question);
        }
    }


    //this stores the name of the last elemet it detected as a string e.g 1.Two Sum from the browser  maybe from local storage
    //and check what all more new strings are added ;
    // it checks if the last entry is accepted if it is so then...
    //then it stores every new thing added in an array [{name:string ,href provided by the question as well, Href provided by this accepted }]

    //then this array is returned to the next functin
}

function copythecode() {
    // ye copy karega to clipboard and then ye also save karega question link
    // aur ye dono data bhej dega background.js ko 

    const targetUrl = `${window.location.origin}/submissions/#/1`;

    if (window.location.href !== targetUrl) {
        window.location.href = targetUrl;
        return;
    }

    const scripts = document.body.querySelectorAll('script');
    let clean = null;

    // Loop to find the one with "submissionCode:"
    for (let script of scripts) {
        if (script.innerHTML.includes('submissionCode:')) {

            const raw = script.innerHTML.split("submissionCode:")[1].split('editCodeUrl:')[0].trim().slice(1, -2);

            clean = raw;
            break;
        }
    }

    if (clean) {
        const finalCode = JSON.parse(`"${clean}"`);

        browser.runtime.sendMessage({
        type: "CODE_SUBMISSION",
        code : finalCode
        })

    } else {
        console.warn('submissionCode not found in any <script> tag');
    }
}




