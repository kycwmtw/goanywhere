const globeContainer = document.getElementById("globeViz");
const locationName = document.getElementById("locationName");
const locationDescription = document.getElementById("locationDescription");
const locationList = document.getElementById("locationList");

function showLocationInfo(location) {
  locationName.textContent = location.name;
  locationDescription.textContent = location.description;
}

function focusLocation(location) {
  showLocationInfo(location);
  globe.pointOfView(
    { lat: location.lat, lng: location.lng, altitude: 1.8 },
    1200
  );
}

function createLocationButtons(locations) {
  locations.forEach((location) => {
    const button = document.createElement("button");
    button.className = "location-button";
    button.textContent = location.name;
    button.addEventListener("click", () => focusLocation(location));
    locationList.appendChild(button);
  });
}

let globe;

fetch("data/trips.json")
  .then((res) => res.json())
  .then((locations) => {
    globe = new Globe(globeContainer)
      .globeImageUrl("https://unpkg.com/three-globe/example/img/earth-dark.jpg")
      .backgroundColor("#030712")
      .showAtmosphere(true)
      .atmosphereColor("#4ea1ff")
      .atmosphereAltitude(0.14)
      .pointsData(locations)
      .pointLat("lat")
      .pointLng("lng")
      .pointAltitude(0.03)
      .pointRadius(0.35)
      .pointColor(() => "#ff9f43")
      .pointLabel((location) => `
        <div style="padding: 6px 8px;">
          <strong>${location.name}</strong><br>
          <span>${location.description}</span>
        </div>
      `)
      .onPointClick((location) => {
        focusLocation(location);
      });

    globe.pointOfView({ lat: 20, lng: 10, altitude: 2.3 });

    const controls = globe.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;

    createLocationButtons(locations);
    showLocationInfo(locations[0]);

    window.addEventListener("resize", () => {
      globe.width(window.innerWidth).height(window.innerHeight);
    });
  })
  .catch((err) => {
    console.error("Failed to load trip data:", err);
    locationName.textContent = "Error loading data";
    locationDescription.textContent = "Could not load trips.json. Check the console for details.";
  });
