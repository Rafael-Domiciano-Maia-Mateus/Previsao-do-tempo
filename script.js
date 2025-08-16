const apiKey = 'c21f04dfe7a5de47d16c655b66b36ed3';

const searchInput = document.getElementById('searchInp');
const searchContainer = document.getElementById('search');
const climateText = document.getElementById('climateText');
const climateIcon = document.getElementById('climateIcon');
const thermometerText = document.getElementById('thermometerText');
const windSpeed = document.getElementById('windSpeed');
const imageClimate = document.getElementById('imageClimate');

function buscarClima(cidade) {
    if (!cidade) return;

    const cidadeEncoded = encodeURIComponent(cidade);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidadeEncoded},BR&appid=${apiKey}&units=metric&lang=pt_br`;

    fetch(url)
        .then((response) => {
            if (!response.ok) throw new Error('Cidade não encontrada!');
            return response.json();
        })
        .then((data) => {
            atualizarDOM(data);
        })
        .catch((error) => {
            tratarErro(error);
        });
}

function atualizarDOM(dados) {
    climateText.textContent = dados.weather[0].description;
    thermometerText.textContent = `${dados.main.temp} °C`;
    windSpeed.textContent = `${dados.wind.speed} km/h`;

    const iconCode = dados.weather[0].icon;
    climateIcon.src = `https://openweathermap.org/img/wn/${iconCode}.png`;
    climateIcon.alt = dados.weather[0].description;

    mudarImagem(dados.weather[0].main.toLowerCase());
}

function mudarImagem(climaPrincipal) {
    if (climaPrincipal.includes('rain') || climaPrincipal.includes('chuva')) {
        imageClimate.src = 'img/chuvoso.png';
        imageClimate.alt = 'Chuvoso';
    } else if (climaPrincipal.includes('cloud') || climaPrincipal.includes('nuvens')) {
        imageClimate.src = 'img/nublado.png';
        imageClimate.alt = 'Nublado';
    } else if (climaPrincipal.includes('clear') || climaPrincipal.includes('céu limpo')) {
        imageClimate.src = 'img/ensolarado.png';
        imageClimate.alt = 'Ensolarado';
    } else if (climaPrincipal.includes('snow') || climaPrincipal.includes('neve')) {
        imageClimate.src = 'img/neve.png';
        imageClimate.alt = 'Nevando';
    } else {
        imageClimate.src = 'img/ensolarado.png';
        imageClimate.alt = 'Clima';
    }
}

function tratarErro(erro) {
    climateText.textContent = erro.message;
    thermometerText.textContent = '';
    windSpeed.textContent = '';
    climateIcon.src = 'icons/sunny.svg';
    imageClimate.src = 'img/ensolarado.png';
    imageClimate.alt = 'Clima';
}

searchContainer.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') buscarClima(searchInput.value.trim());
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') buscarClima(searchInput.value.trim());
});

function pegarLocalizacao() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (posicao) => {
                const lat = posicao.coords.latitude;
                const lon = posicao.coords.longitude;
                buscarClimaPorCoords(lat, lon);
            },
            (erro) => {
                console.log('Não foi possível pegar localização. O usuário pode digitar a cidade.');
            }
        );
    }
}

async function buscarClimaPorCoords(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Não foi possível obter o clima da sua localização.');
        const data = await response.json();
        atualizarDOM(data);
        searchInput.value = data.name;
    } catch (error) {
        tratarErro(error);
    }
}

window.addEventListener('load', pegarLocalizacao);
