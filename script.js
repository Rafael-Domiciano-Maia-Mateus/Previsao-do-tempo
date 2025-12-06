const API_KEY = "c21f04dfe7a5de47d16c655b66b36ed3";
const searchInput = document.getElementById("searchInp");
const searchContainer = document.getElementById("search");
const climateText = document.getElementById("climateText");
const climateIcon = document.getElementById("climateIcon");
const thermometerText = document.getElementById("thermometerText");
const windSpeed = document.getElementById("windSpeed");
const imageClimate = document.getElementById("imageClimate");

async function fetchWeatherByCity(city) {
    if (!city) return;

    const encodedCity = encodeURIComponent(city);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity},BR&appid=${API_KEY}&units=metric&lang=pt_br`;

    try {
        const data = await fetchJSON(url);
        updateWeatherUI(data);
    } catch (error) {
        handleWeatherError(error);
    }
}

async function fetchWeatherByCoordinates(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pt_br`;

    try {
        const data = await fetchJSON(url);
        updateWeatherUI(data);
        searchInput.value = data.name;
    } catch (error) {
        handleWeatherError(error);
    }
}

async function fetchJSON(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Unable to fetch weather data.");
    }

    return response.json();
}

function updateWeatherUI(data) {
    const weather = data.weather[0];
    const mainWeather = weather.main.toLowerCase();
    const iconCode = weather.icon;

    climateText.textContent = weather.description;
    thermometerText.textContent = `${data.main.temp} °C`;
    windSpeed.textContent = `${data.wind.speed} km/h`;

    updateWeatherIcon(iconCode, weather.description);
    updateWeatherImage(mainWeather);
    updateBackgroundByTime(iconCode);
}

function updateWeatherIcon(iconCode, description) {
    climateIcon.src = `https://openweathermap.org/img/wn/${iconCode}.png`;
    climateIcon.alt = description;
}

function updateWeatherImage(mainWeather) {
    const weatherImages = {
        rain: { src: "img/chuvoso.png", alt: "Chuvoso" },
        cloud: { src: "img/nublado.png", alt: "Nublado" },
        clear: { src: "img/ensolarado.png", alt: "Ensolarado" },
        snow: { src: "img/neve.png", alt: "Nevando" },
        default: { src: "img/ensolarado.png", alt: "Clima" },
    };

    if (mainWeather.includes("rain")) return setWeatherImage(weatherImages.rain);
    if (mainWeather.includes("cloud")) return setWeatherImage(weatherImages.cloud);
    if (mainWeather.includes("clear")) return setWeatherImage(weatherImages.clear);
    if (mainWeather.includes("snow")) return setWeatherImage(weatherImages.snow);

    setWeatherImage(weatherImages.default);
}

function setWeatherImage({ src, alt }) {
    imageClimate.src = src;
    imageClimate.alt = alt;
}

function updateBackgroundByTime(iconCode) {
    const isNight = iconCode.endsWith("n");

    document.body.style.background = isNight ? "#1a1a2e" : "#87cefa";
    document.body.style.color = isNight ? "#fff" : "#333";
}

function handleWeatherError(error) {
    climateText.textContent = error.message || "Error fetching weather.";
    thermometerText.textContent = "";
    windSpeed.textContent = "";
    climateIcon.src = "icons/sunny.svg";

    setWeatherImage({ src: "img/ensolarado.png", alt: "Clima" });

    document.body.style.background = "#87cefa";
    document.body.style.color = "#333";
}

function getUserLocation() {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeatherByCoordinates(latitude, longitude);
        },
        () => {
            handleWeatherError(new Error("Location access denied."));
        }
    );
}

searchContainer.addEventListener("click", (e) => {
    if (e.target.tagName === "IMG") {
        fetchWeatherByCity(searchInput.value.trim());
    }
});

searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        fetchWeatherByCity(searchInput.value.trim());
    }
});

window.addEventListener("load", getUserLocation);
