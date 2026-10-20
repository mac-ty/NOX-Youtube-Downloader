import './style.css'

const mainContainer = document.getElementById("main-container");


function createInputField() {
    const inputDiv = document.createElement("div");
    const inputField = document.createElement("input");
    const searchBtn = document.createElement("button");
    
    inputDiv.classList.add("flex", "justify-center", "items-center", "gap-0", "w-10/12");
    inputDiv.id = "input-div"
    
    inputField.setAttribute("type", "text");
    inputField.setAttribute("placeholder", "Enter a video link");
    inputField.classList.add("bg-input", "px-4", "py-3", "w-9/12", "rounded-l-lg", "text-white", "focus:outline-hidden", "text-lg")
    inputField.id = "search-input";

    searchBtn.classList.add("bg-input", "p-4", "rounded-r-lg", "cursor-pointer", "border-l", "border-l-gold");
    searchBtn.id = "search-btn";
    searchBtn.innerHTML = `
        <svg class="text-gold h-5 w-5" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><title>magnifier-outline</title><path fill="currentColor" fill-rule="evenodd" d="M11.5 2.75C6.66751 2.75 2.75 6.66751 2.75 11.5C2.75 16.3325 6.66751 20.25 11.5 20.25C16.3325 20.25 20.25 16.3325 20.25 11.5C20.25 6.66751 16.3325 2.75 11.5 2.75ZM1.25 11.5C1.25 5.83908 5.83908 1.25 11.5 1.25C17.1609 1.25 21.75 5.83908 21.75 11.5C21.75 14.0605 20.8111 16.4017 19.2589 18.1982L22.5303 21.4697C22.8232 21.7626 22.8232 22.2374 22.5303 22.5303C22.2374 22.8232 21.7626 22.8232 21.4697 22.5303L18.1982 19.2589C16.4017 20.8111 14.0605 21.75 11.5 21.75C5.83908 21.75 1.25 17.1609 1.25 11.5Z" clip-rule="evenodd"/></svg>
    `;

    inputDiv.appendChild(inputField);
    inputDiv.appendChild(searchBtn);
    return inputDiv;
}


function createVideo(title, channelName, views, duration, thumbnail, channelPhoto) {
    const videoDiv = document.createElement("div");

    videoDiv.innerHTML = `
        <div class="h-fit relative after:content-['${duration}'] after:absolute after:bottom-1.5 after:right-2 after:bg-black after:text-white after:px-1.5 after:py-1 after:rounded-lg after:flex after:items-center after:justify-center">
            <img class="rounded-xl" src="${thumbnail}">
        </div>

        <div class="grid grid-cols-[auto_1fr] grid-rows-[auto_auto] gap-x-2.5 gap-y-2 mb-1">
            <div class="row-span-full">
                <img class="rounded-full h-12" src="${channelPhoto}">
            </div>
            <p class="text-white font-bold text-lg h-fit">${title}</p>
            <p class="text-gray-300 h-fit">${channelName} ${formatViews(views)} views</p>
        </div>
    `;

    videoDiv.classList.add("grid", "grid-rows-[1fr_auto]", "w-11/12", "max-w-lg", "gap-2", "border-2", "border-gold", "rounded-2xl", "p-2");

    return videoDiv;
}


function appendVideo(title, channelName, views, duration, thumbnail, channelPhoto) {
    mainContainer.appendChild(createVideo(title, channelName, views, duration, thumbnail, channelPhoto));
}

function appendInputField() {
    mainContainer.appendChild(createInputField());
}

function removeElement(element) {
    mainContainer.removeChild(element);
}


function formatViews(views) {
    if (views >= 1000000) {
        return (views / 1000000).toFixed(1) + "M";
    } else if (views >= 1000) {
        return (views / 1000).toFixed(1) + "K";
    } else {
        return views.toString();
    }
}


appendInputField();
const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");

searchBtn.addEventListener("click", async () => {
    const videoUrl = searchInput.value.trim();
    if (!videoUrl) {
        alert("Please enter a video link.");
        return;
    }

    try {
        const response = await fetch(`http://127.0.0.1:5000/api/searchVideo?videoUrl=${videoUrl}`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        const videoData = {
            title: data.title,
            channelName: data.channelName,
            views: data.views,
            duration: data.duration,
            thumbnail: data.thumbnail,
            channelPhoto: "./channels4_profile.jpg"  
        }


        removeElement(document.getElementById("input-div"));
        appendVideo(videoData.title, videoData.channelName, videoData.views, videoData.duration, videoData.thumbnail, videoData.channelPhoto);
    }
    catch (error) {
        alert(`Something went wrong ${error}`);
    }
});