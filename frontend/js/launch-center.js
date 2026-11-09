
const API_URL =
    "https://ll.thespacedevs.com/2.3.0/launches/upcoming/?limit=10&ordering=net&hide_recent_previous=true&format=json";

const launchList = document.getElementById("launchList");

function escapeHTML(value = "") {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}

function formatLaunchDate(date) {
    if (!date) return "Date not announced";

    return new Date(date).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Kolkata"
    }) + " IST";
}

function displayLaunches(launches) {
    if (!launches.length) {
        launchList.innerHTML = `
            <div class="empty-state">
                <h3>No upcoming launches found</h3>
                <p>Try checking again later.</p>
            </div>
        `;
        return;
    }

    launchList.innerHTML = launches.map(launch => {
        const rocket =
            launch.rocket?.configuration?.full_name ||
            launch.rocket?.configuration?.name ||
            "Rocket details unavailable";

        const agency =
            launch.launch_service_provider?.name ||
            "Unknown launch provider";

        const location =
            launch.pad?.location?.name ||
            "Launch location unavailable";

        const mission =
            launch.mission?.description ||
            "Mission description is not available.";

        const image =
            launch.image?.thumbnail_url ||
            launch.image?.image_url ||
            "";

        const imageHTML = image
            ? `<img src="${escapeHTML(image)}" alt="Rocket launch" class="launch-image">`
            : `<div class="launch-image-placeholder">🚀</div>`;

        return `
            <article class="launch-item">

                ${imageHTML}

                <div class="launch-info">
                    <span class="launch-status">
                        ${escapeHTML(launch.status?.name || "Status unknown")}
                    </span>

                    <h3>${escapeHTML(launch.name)}</h3>

                    <p>${escapeHTML(mission)}</p>

                    <div class="launch-details">
                        <span>🚀 ${escapeHTML(rocket)}</span>
                        <span>🏢 ${escapeHTML(agency)}</span>
                        <span>📍 ${escapeHTML(location)}</span>
                        <span>🕒 ${escapeHTML(formatLaunchDate(launch.net))}</span>
                    </div>

                    <a
                        href="${escapeHTML(launch.url)}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="launch-details-link"
                    >
                        VIEW MISSION DETAILS ↗
                    </a>
                </div>

            </article>
        `;
    }).join("");
}

async function loadLaunches() {
    launchList.innerHTML = `
        <div class="empty-state">
            <span>🚀</span>
            <h3>Receiving launch data...</h3>
            <p>Connecting to the global launch database.</p>
        </div>
    `;

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        displayLaunches(data.results || []);

    } catch (error) {
        console.error("Launch feed error:", error);

        launchList.innerHTML = `
            <div class="empty-state">
                <span>⚠️</span>
                <h3>Unable to load launch data</h3>
                <p>Check your internet connection or try again later.</p>
                <button onclick="loadLaunches()">TRY AGAIN</button>
            </div>
        `;
    }
}

loadLaunches();
