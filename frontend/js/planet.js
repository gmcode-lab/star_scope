
const planetData = {
  mercury: {
    name: "Mercury",
    description: "The smallest planet in our Solar System and the closest to the Sun.",
    distance: "57.9 million km",
    diameter: "4,879 km",
    period: "88 Earth days",
    about: "Mercury is a small, rocky planet with a heavily cratered surface. It has extreme temperature changes between day and night.",
    atmosphere: "A very thin exosphere containing oxygen, sodium, hydrogen, helium and potassium.",
    moons: "0 natural moons",
    fact: "A year on Mercury lasts just 88 Earth days.",
    color: "radial-gradient(circle at 35% 30%, #d9d9d9, #777777 60%, #252525)"
  },

  venus: {
    name: "Venus",
    description: "A bright, rocky world with an extremely hot surface and thick atmosphere.",
    distance: "108.2 million km",
    diameter: "12,104 km",
    period: "225 Earth days",
    about: "Venus is covered by thick clouds and has a crushing atmosphere. Its greenhouse effect makes it the hottest planet in our Solar System.",
    atmosphere: "Mostly carbon dioxide, with clouds of sulfuric acid.",
    moons: "0 natural moons",
    fact: "Venus rotates in the opposite direction to most planets.",
    color: "radial-gradient(circle at 35% 30%, #ffe0a0, #bd8740 60%, #51331c)"
  },

  earth: {
    name: "Earth",
    description: "Our home planet — a world of oceans, continents and incredible life.",
    distance: "149.6 million km",
    diameter: "12,742 km",
    period: "365.25 days",
    about: "Earth is the only planet currently known to support life. Its liquid water, protective atmosphere and magnetic field make it unique.",
    atmosphere: "Mostly nitrogen and oxygen.",
    moons: "1 natural moon",
    fact: "About 71% of Earth's surface is covered by water.",
    color: "radial-gradient(circle at 35% 30%, #73d5ff, #1762b8 55%, #07152e)"
  },

  mars: {
    name: "Mars",
    description: "The Red Planet, famous for its rusty surface and enormous volcanoes.",
    distance: "227.9 million km",
    diameter: "6,779 km",
    period: "687 Earth days",
    about: "Mars is a cold desert world. Scientists study it to understand its ancient water history and whether microbial life may once have existed there.",
    atmosphere: "Mostly carbon dioxide, with nitrogen and argon.",
    moons: "2 natural moons: Phobos and Deimos",
    fact: "Mars is home to Olympus Mons, the largest known volcano in the Solar System.",
    color: "radial-gradient(circle at 35% 30%, #ffad7e, #c34c29 60%, #521b12)"
  },

  jupiter: {
    name: "Jupiter",
    description: "The largest planet in our Solar System, famous for its enormous storms.",
    distance: "778.6 million km",
    diameter: "139,820 km",
    period: "11.86 Earth years",
    about: "Jupiter is a gas giant with colorful cloud bands and powerful storms. Its Great Red Spot is a giant storm that has lasted for centuries.",
    atmosphere: "Mostly hydrogen and helium.",
    moons: "Many known moons, including Io, Europa, Ganymede and Callisto.",
    fact: "Jupiter is so massive that more than 1,300 Earths could fit inside it by volume.",
    color: "repeating-linear-gradient(0deg, #b67c51 0px, #e4c49a 18px, #9d6340 35px, #e8d0aa 52px)"
  },

  saturn: {
    name: "Saturn",
    description: "A magnificent gas giant best known for its spectacular ring system.",
    distance: "1.43 billion km",
    diameter: "116,460 km",
    period: "29.45 Earth years",
    about: "Saturn is a gas giant made mostly of hydrogen and helium. Its beautiful rings consist mainly of countless pieces of ice and rocky material.",
    atmosphere: "Mostly hydrogen and helium.",
    moons: "Many known moons, including Titan and Enceladus.",
    fact: "Saturn is less dense than water on average.",
    color: "radial-gradient(circle at 35% 30%, #f8dfaa, #b99a60 60%, #554329)"
  },

  uranus: {
    name: "Uranus",
    description: "An unusual ice giant that rotates almost completely on its side.",
    distance: "2.87 billion km",
    diameter: "50,724 km",
    period: "84 Earth years",
    about: "Uranus has a blue-green appearance due to methane in its atmosphere. Its extreme axial tilt produces unusual seasons.",
    atmosphere: "Hydrogen, helium and methane.",
    moons: "Many known moons, including Titania, Oberon and Miranda.",
    fact: "One Uranian season can last about 21 Earth years.",
    color: "radial-gradient(circle at 35% 30%, #b5ffff, #55bfc9 60%, #164c59)"
  },

  neptune: {
    name: "Neptune",
    description: "A distant blue ice giant with some of the fastest winds in the Solar System.",
    distance: "4.50 billion km",
    diameter: "49,244 km",
    period: "165 Earth years",
    about: "Neptune is a cold, dark and windy world. It is the farthest recognized planet from the Sun.",
    atmosphere: "Mostly hydrogen and helium, with methane.",
    moons: "Many known moons, including Triton.",
    fact: "Neptune takes about 165 Earth years to orbit the Sun.",
    color: "radial-gradient(circle at 35% 30%, #82baff, #2455c5 60%, #101c55)"
  }
};

// Read the selected planet from the page URL
const params = new URLSearchParams(window.location.search);
const planetKey = (params.get("name") || "earth").toLowerCase();

const planet = planetData[planetKey] || planetData.earth;

// Update page content
document.title = `${planet.name} | Star Scope`;

document.getElementById("planetName").textContent = planet.name;
document.getElementById("aboutPlanetName").textContent = planet.name;
document.getElementById("planetDescription").textContent = planet.description;
document.getElementById("planetDistance").textContent = planet.distance;
document.getElementById("planetDiameter").textContent = planet.diameter;
document.getElementById("planetPeriod").textContent = planet.period;
document.getElementById("planetAbout").textContent = planet.about;
document.getElementById("planetAtmosphere").textContent = planet.atmosphere;
document.getElementById("planetMoons").textContent = planet.moons;
document.getElementById("planetFact").textContent = planet.fact;

// Update planet appearance
document.getElementById("planetSphere").style.background = planet.color;
const planetSphere = document.getElementById("planetSphere");

const planetImages = {
  mercury: "https://images-assets.nasa.gov/image/PIA16853/PIA16853~orig.jpg",
  venus: "https://images-assets.nasa.gov/image/PIA00104/PIA00104~orig.jpg",
  earth: "https://images-assets.nasa.gov/image/PIA18033/PIA18033~orig.jpg",
  mars: "https://images-assets.nasa.gov/image/PIA04591/PIA04591~orig.jpg",
  jupiter: "https://images-assets.nasa.gov/image/PIA02873/PIA02873~orig.jpg",
  saturn: "https://images-assets.nasa.gov/image/PIA01364/PIA01364~orig.jpg",
  uranus: "https://images-assets.nasa.gov/image/PIA18182/PIA18182~orig.jpg",
  neptune: "https://images-assets.nasa.gov/image/PIA01492/PIA01492~orig.jpg"
};

planetSphere.style.background = `url("${planetImages[planetKey]}") center / cover no-repeat`;
console.log(`${planet.name} details loaded successfully!`);
