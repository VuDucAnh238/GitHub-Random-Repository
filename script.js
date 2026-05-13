// variables
const dropdownElement = document.getElementById("language");
const stateElement = document.querySelector(".state");
const repositoryElement = document.querySelector(".repository");
const contentElement = document.querySelector(".repository .content");
const retryButton = document.querySelector(".retry");
const refreshButton = document.querySelector(".refresh");
const dropdownDataUrl = "https://languages.ranna.dev/languages.json";
const repositoriesDataUrl = "https://api.github.com/search/repositories?q=";
// event listeners
document.addEventListener("DOMContentLoaded", function () {
    getDropdownData();
});
dropdownElement.addEventListener("change", function () {
    updateState("active", "Loading...");
    getRepositoriesData(this.value);
});
refreshButton.addEventListener("click", function () {
    updateState("active", "Loading...");
    getRepositoriesData(dropdownElement.value);
});
retryButton.addEventListener("click", function () {
    updateState("active", "Retrying...");
    getRepositoriesData(dropdownElement.value);
})
// fetch data
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        updateState("error", "Failed to load data. Please try again.");
    } finally {
        refreshButton.disabled = false;
    }
}

// get dropdown data
async function getDropdownData() {
    const data = await fetchData(dropdownDataUrl);
    Object.keys(data).forEach(language => {
        const option = document.createElement("option");

        option.value = language.toLowerCase();
        option.textContent = language;

        dropdownElement.appendChild(option);
    });
}

// get repositories
async function getRepositoriesData(language) {

    const url = `${repositoriesDataUrl}${language}`;
    const data = await fetchData(url);
    const randomInt = Math.floor(Math.random() * data.items.length);

    if (!data || !data.items || data.items.length === 0) {
        updateState("error", "No repositories found.");
        return;
    }
    updateRepositoryList(data.items[randomInt]);
}

// update repository list
function updateRepositoryList(repositories) {
    contentElement.classList.add("active");
    const header = document.createElement("h1");
    const description = document.createElement("p");
    const iconsContainer = document.createElement("div");
    iconsContainer.classList.add("icons");
    const language = document.createElement("span");
    language.classList.add("language");
    const starIcon = document.createElement("span");
    starIcon.classList.add("star-icon");
    const forkIcon = document.createElement("span");
    forkIcon.classList.add("fork-icon");
    const issuesIcon = document.createElement("span");
    issuesIcon.classList.add("issues-icon");

    contentElement.textContent = "";
    header.textContent = repositories.name;
    description.textContent = repositories.description;
    language.textContent = `Language: ${repositories.language}`;
    starIcon.textContent = `Stars: ${repositories.stargazers_count}`;
    forkIcon.textContent = `Forks: ${repositories.forks_count}`;
    issuesIcon.textContent = `Open Issues: ${repositories.open_issues_count}`;

    contentElement.appendChild(header);
    contentElement.appendChild(description);
    contentElement.appendChild(iconsContainer);
    iconsContainer.appendChild(language);
    iconsContainer.appendChild(starIcon);
    iconsContainer.appendChild(forkIcon);
    iconsContainer.appendChild(issuesIcon);
    updateState("done", "");
}

// update state
function updateState(status, message) {
    const divElement = stateElement.querySelector("div");
    if (status === "done") {
        divElement.classList.remove("error");
        divElement.classList.add("inactive");
        divElement.textContent = "";
    } else if (status === "error") {
        divElement.classList.add("error");
        contentElement.classList.remove("active");
    } else {
        divElement.classList.remove("error");
        divElement.classList.remove("inactive");
        divElement.textContent = message;
    }
}