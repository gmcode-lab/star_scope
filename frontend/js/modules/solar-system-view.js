
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { planets } from "../data/solar-system.js";

const container = document.getElementById("solarSystem");

if (!container) {
  console.error("Solar System container not found!");
} else {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050816);

  const camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );

  camera.position.set(0, 55, 75);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 2));

  const light = new THREE.PointLight(0xffffff, 4);
  scene.add(light);

  // Sun
  const sun = new THREE.Mesh(
    new THREE.SphereGeometry(3.5, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xffa500 })
  );
  scene.add(sun);

  // Stars
  const starGeometry = new THREE.BufferGeometry();
  const starPositions = [];

  for (let i = 0; i < 1500; i++) {
    starPositions.push(
      (Math.random() - 0.5) * 250,
      (Math.random() - 0.5) * 250,
      (Math.random() - 0.5) * 250
    );
  }

  starGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(starPositions, 3)
  );

  const stars = new THREE.Points(
    starGeometry,
    new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 })
  );
  scene.add(stars);

  // Orbit paths
  function createOrbit(radius) {
    const geometry = new THREE.RingGeometry(
      radius - 0.04,
      radius + 0.04,
      128
    );

    const material = new THREE.MeshBasicMaterial({
      color: 0x526080,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7
    });

    const orbit = new THREE.Mesh(geometry, material);
    orbit.rotation.x = -Math.PI / 2;
    scene.add(orbit);
  }

  // Planet information
  const planetInfo = {
    Mercury: {
      description: "The smallest planet and the closest planet to the Sun.",
      distance: "57.9 million km",
      diameter: "4,879 km",
      period: "88 Earth days"
    },
    Venus: {
      description: "A hot world with a thick atmosphere and extreme surface temperatures.",
      distance: "108.2 million km",
      diameter: "12,104 km",
      period: "225 Earth days"
    },
    Earth: {
      description: "Our home planet, the only world currently known to support life.",
      distance: "149.6 million km",
      diameter: "12,742 km",
      period: "365.25 days"
    },
    Mars: {
      description: "The Red Planet, known for its dusty surface and giant volcanoes.",
      distance: "227.9 million km",
      diameter: "6,779 km",
      period: "687 Earth days"
    },
    Jupiter: {
      description: "The largest planet in our Solar System, famous for its Great Red Spot.",
      distance: "778.6 million km",
      diameter: "139,820 km",
      period: "11.86 Earth years"
    },
    Saturn: {
      description: "A gas giant famous for its spectacular rings made mostly of ice and rock.",
      distance: "1.43 billion km",
      diameter: "116,460 km",
      period: "29.45 Earth years"
    },
    Uranus: {
      description: "An ice giant that rotates on its side, giving it unusual seasons.",
      distance: "2.87 billion km",
      diameter: "50,724 km",
      period: "84 Earth years"
    },
    Neptune: {
      description: "A distant ice giant known for its powerful winds and deep blue appearance.",
      distance: "4.50 billion km",
      diameter: "49,244 km",
      period: "165 Earth years"
    }
  };

  // Create planets
  const planetObjects = [];

  planets.forEach((planet) => {
    createOrbit(planet.orbit);

    const geometry = new THREE.SphereGeometry(
      planet.size,
      32,
      32
    );

    const material = new THREE.MeshStandardMaterial({
      color: planet.color
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Create a larger invisible click area
const hitArea = new THREE.Mesh(
  new THREE.SphereGeometry(planet.size * 2.5, 16, 16),
  new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0
  })
);

hitArea.userData.planetName = planet.name;
mesh.add(hitArea);

    // Saturn rings
    if (planet.name === "Saturn") {
      const ringGeometry = new THREE.RingGeometry(
        planet.size * 1.4,
        planet.size * 2.3,
        64
      );

      const ringMaterial = new THREE.MeshStandardMaterial({
        color: 0xd9c18c,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });

      const saturnRings = new THREE.Mesh(
        ringGeometry,
        ringMaterial
      );

      saturnRings.rotation.x = Math.PI / 2.5;
      mesh.add(saturnRings);
    }

    planetObjects.push({
      mesh,
      name: planet.name,
      orbit: planet.orbit,
      speed: planet.speed,
      angle: Math.random() * Math.PI * 2
    });
  });


  // Planet selection - open dedicated details page
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  renderer.domElement.addEventListener("click", (event) => {
    const rect = renderer.domElement.getBoundingClientRect();

    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);

    // Check planets AND their invisible click areas
    const clickablePlanets = planetObjects.map(
      (planet) => planet.mesh
    );

    const intersections = raycaster.intersectObjects(
      clickablePlanets,
      true
    );

    if (intersections.length > 0) {
      const clickedObject = intersections[0].object;

      // Get the planet name from the clicked object
      let planetName = clickedObject.userData.planetName;

      // If the main planet sphere was clicked
      if (!planetName) {
        const selectedPlanet = planetObjects.find(
          (planet) =>
            planet.mesh === clickedObject ||
            planet.mesh === clickedObject.parent
        );

        if (selectedPlanet) {
          planetName = selectedPlanet.name;
        }
      }

      if (planetName) {
        window.location.href =
  `./planets.html?name=${encodeURIComponent(planetName.toLowerCase())}`;

      }
    }
  });

  renderer.domElement.style.cursor = "pointer";



 /* 
  // Planet selection - open dedicated details page
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  renderer.domElement.addEventListener("click", (event) => {
    const rect = renderer.domElement.getBoundingClientRect();

    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);

    const clickablePlanets = planetObjects.map(
      (planet) => planet.mesh
    );

    const intersections = raycaster.intersectObjects(
      clickablePlanets,
      false
    );

    if (intersections.length > 0) {
      const selectedMesh = intersections[0].object;

      const selectedPlanet = planetObjects.find(
        (planet) => planet.mesh === selectedMesh
      );

      if (selectedPlanet) {
        window.location.href =
          `planet.html?name=${encodeURIComponent(selectedPlanet.name.toLowerCase())}`;
      }
    }
  });

  renderer.domElement.style.cursor = "pointer";*/


  /*// Animation
  function animate() {
  // Pause / Resume Controls
  let isPaused = false;

  const pauseButton = document.getElementById("pauseSolarSystem");

  if (pauseButton) {
    pauseButton.addEventListener("click", () => {
      isPaused = !isPaused;

      pauseButton.textContent = isPaused
        ? "▶ Resume Solar System"
        : "⏸ Pause Solar System";
    });
  }
  // Pause / Resume Controls
    requestAnimationFrame(animate);

    if (!isPaused) {
      planetObjects.forEach((planet) => {
        planet.angle += planet.speed * 0.5;

        planet.mesh.position.x =
          Math.cos(planet.angle) * planet.orbit;

        planet.mesh.position.z =
          Math.sin(planet.angle) * planet.orbit;

        planet.mesh.rotation.y += 0.03;
      });
    }

    renderer.render(scene, camera);
  }

  animate();*/



  
  // Pause / Resume Controls
  let isPaused = false;

  const pauseButton = document.getElementById("pauseSolarSystem");

  if (pauseButton) {
    pauseButton.addEventListener("click", () => {
      isPaused = !isPaused;

      pauseButton.textContent = isPaused
        ? "▶ Resume Solar System"
        : "⏸ Pause Solar System";
    });
  }

  // Animation
  function animate() {
    requestAnimationFrame(animate);

    if (!isPaused) {
      planetObjects.forEach((planet) => {
        planet.angle += planet.speed * 0.5;

        planet.mesh.position.x =
          Math.cos(planet.angle) * planet.orbit;

        planet.mesh.position.z =
          Math.sin(planet.angle) * planet.orbit;

        planet.mesh.rotation.y += 0.03;
      });
    }

    renderer.render(scene, camera);
  }

  animate();


  // Resize
  window.addEventListener("resize", () => {
    const width = container.clientWidth;
    const height = container.clientHeight;

    if (width === 0 || height === 0) return;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });

  console.log("Star Scope Solar System initialized!");
}
