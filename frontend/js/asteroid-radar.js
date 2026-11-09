
const API_URL = "https://api.nasa.gov/neo/rest/v1/feed?";
let allAsteroids = [];
const asteroidList = document.getElementById("asteroidList");
const totalAsteroids = document.getElementById("totalAsteroids");
const hazardousAsteroids = document.getElementById("hazardousAsteroids");
const closestAsteroid = document.getElementById("closestAsteroid");
const feedStatus = document.getElementById("feedStatus");

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}

function formatNumber(value) {
    return Number(value).toLocaleString("en-US", {
        maximumFractionDigits: 2
    });
}

function displayAsteroids(asteroids) {
  const sortedAsteroids = asteroids;
    
       

    totalAsteroids.textContent = asteroids.length;

    hazardousAsteroids.textContent = asteroids.filter(
        asteroid => asteroid.is_potentially_hazardous_asteroid
    ).length;

    const closest = sortedAsteroids[0];

    closestAsteroid.textContent = closest
        ? formatNumber(closest.close_approach_data[0].miss_distance.kilometers) + " km"
        : "--";

    asteroidList.innerHTML = sortedAsteroids.slice(0, 12).map(asteroid => {
        const approach = asteroid.close_approach_data[0];
        const diameter = asteroid.estimated_diameter.meters;

        const isHazardous = asteroid.is_potentially_hazardous_asteroid;

        return `
            <article class="asteroid-card">

                <span class="asteroid-badge ${isHazardous ? "hazardous" : "safe"}">
                    ${isHazardous ? "⚠ POTENTIALLY HAZARDOUS" : "✓ NOT CLASSIFIED AS HAZARDOUS"}
                </span>

                <h3>☄️ ${escapeHTML(asteroid.name)}</h3>

                <p><strong>Closest Approach:</strong>
                    ${escapeHTML(approach.close_approach_date_full || approach.close_approach_date)}
                </p>

                <p><strong>Estimated Diameter:</strong>
                    ${formatNumber(diameter.estimated_diameter_min)} –
                    ${formatNumber(diameter.estimated_diameter_max)} metres
                </p>

                <p><strong>Distance from Earth:</strong>
                    ${formatNumber(approach.miss_distance.kilometers)} km
                </p>

                <p><strong>Relative Velocity:</strong>
                    ${formatNumber(approach.relative_velocity.kilometers_per_hour)} km/h
                </p>

                <p><strong>NASA Reference:</strong>
                    ${escapeHTML(asteroid.nasa_jpl_url ? "Available" : "Not available")}
                </p>

                <a class="launch-details-link"
                   href="${asteroid.nasa_jpl_url}"
                   target="_blank"
                   rel="noopener noreferrer">
                   VIEW NASA DETAILS ↗
                </a>

<details class="learn-asteroid">
    <summary>🧠 Understand this asteroid data</summary>

    <div class="learning-content">

        <div class="learning-item">
            <h4>📏 How big is this asteroid?</h4>
            <p>
                Its estimated diameter is between
                ${formatNumber(diameter.estimated_diameter_min)}
                and
                ${formatNumber(diameter.estimated_diameter_max)}
                metres.

                ${
                    diameter.estimated_diameter_max < 50
                    ? "This is relatively small compared with many tracked asteroids."
                    : diameter.estimated_diameter_max < 500
                    ? "This is a medium-sized asteroid in this size range."
                    : "This is a relatively large asteroid. Its size makes it especially interesting to monitor."
                }
            </p>
        </div>

        <div class="learning-item">
            <h4>🌍 How far is it from Earth?</h4>
            <p>
                It will pass approximately
                ${formatNumber(approach.miss_distance.kilometers)}
                kilometres from Earth.

                ${
                    Number(approach.miss_distance.lunar) < 1
                    ? "That is closer than the average distance between Earth and the Moon."
                    : `That is about ${formatNumber(approach.miss_distance.lunar)} times the average Earth-Moon distance.`
                }
            </p>
        </div>

        <div class="learning-item">
            <h4>🚀 How fast is it moving?</h4>
            <p>
                Its relative speed is
                ${formatNumber(approach.relative_velocity.kilometers_per_hour)}
                km/h.

                ${
                    Number(approach.relative_velocity.kilometers_per_hour) > 50000
                    ? "That is an extremely high speed compared with everyday vehicles."
                    : "This is its speed relative to Earth during the predicted approach."
                }
            </p>
        </div>

        <div class="learning-item">
            <h4>⚠️ What does its hazard status mean?</h4>
            <p>
                ${
                    isHazardous
                    ? "NASA classifies this asteroid as potentially hazardous based on its size and orbit. This does NOT mean it is predicted to hit Earth."
                    : "NASA does not currently classify this asteroid as potentially hazardous. It is still tracked to understand its orbit and future approaches."
                }
            </p>
        </div>

        <div class="learning-item">
            <h4>📅 When will it approach Earth?</h4>
            <p>
                Its predicted closest approach is
                ${escapeHTML(approach.close_approach_date_full || approach.close_approach_date)}.
                This is the predicted time of its closest pass, not an impact date.
            </p>
        </div>

    </div>
</details>


            </article>
        `;
    }).join("");
}

async function loadAsteroids() {
    try {
        feedStatus.textContent = "● CONNECTING...";

        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + 6);

        const formatDate = date => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        };

        const url = `${API_URL}start_date=${formatDate(startDate)}&end_date=${formatDate(endDate)}&api_key=DEMO_KEY`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("NASA API request failed: " + response.status);
        }

        const data = await response.json();

        const asteroids = Object.values(data.near_earth_objects || {})
            .flat()
            .filter(asteroid => asteroid.close_approach_data?.length);

        if (!asteroids.length) {
            throw new Error("No asteroid data available.");
        }

        displayAsteroids(asteroids);
        feedStatus.textContent = "● NASA DATA CONNECTED";

    } catch (error) {
        console.error("Asteroid Radar Error:", error);

        feedStatus.textContent = "● FEED ERROR";

        asteroidList.innerHTML = `
            <div class="error-state">
                <h3>Unable to load asteroid data</h3>
                <p>${escapeHTML(error.message)}</p>
                <p>Please check your internet connection or try again later.</p>
                <button onclick="loadAsteroids()">Try Again</button>
            </div>
        `;
    }
}

function applyAsteroidFilters() {
    const search = document.getElementById("asteroidSearch");
    const hazard = document.getElementById("hazardFilter");
    const sort = document.getElementById("sortAsteroids");

    const searchValue = search.value.toLowerCase();
    const hazardValue = hazard.value;
    const sortValue = sort.value;

    let filtered = allAsteroids.filter(asteroid => {
        const matchesName = asteroid.name.toLowerCase().includes(searchValue);

        const matchesHazard =
            hazardValue === "all" ||
            (hazardValue === "hazardous" &&
                asteroid.is_potentially_hazardous_asteroid) ||
            (hazardValue === "safe" &&
                !asteroid.is_potentially_hazardous_asteroid);

        return matchesName && matchesHazard;
    });

    filtered.sort((a, b) => {
        if (sortValue === "size") {
            return b.estimated_diameter.meters.estimated_diameter_max -
                a.estimated_diameter.meters.estimated_diameter_max;
        }

        if (sortValue === "speed") {
            return Number(b.close_approach_data[0].relative_velocity.kilometers_per_hour) -
                Number(a.close_approach_data[0].relative_velocity.kilometers_per_hour);
        }

        return Number(a.close_approach_data[0].miss_distance.kilometers) -
            Number(b.close_approach_data[0].miss_distance.kilometers);
    });

    if (filtered.length) {
        displayAsteroids(filtered);
    } else {
        asteroidList.innerHTML = `
            <div class="error-state">
                <h3>No matching asteroids found</h3>
                <p>Try changing your search or filters.</p>
            </div>
        `;
    }
}

document.getElementById("asteroidSearch")
    .addEventListener("input", applyAsteroidFilters);

document.getElementById("hazardFilter")
    .addEventListener("change", applyAsteroidFilters);

document.getElementById("sortAsteroids")
    .addEventListener("change", applyAsteroidFilters);

loadAsteroids();
allAsteroids = asteroids;
displayAsteroids(asteroids);