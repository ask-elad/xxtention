//create a function that authenticate and push to github 
//somehow store the pattoken and figure out how to push it on github


async function addFile() {

    // const myHeaders = new Headers();
    // myHeaders.append("Content-Type", "application/json");


    const url = "https://github.com/ask-elad/DSA_leetcode";

    try {
        const response = await fetch(url,{
            method:"POST",
            headers:"//",
            body: "" //add the required data 
        });
        
        
    }catch (e) {
        console.error(e.message);
    }
}
