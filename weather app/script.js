const cityInput = document.querySelector('.city_input');
const searchBtn = document.querySelector('.search_btn');

const weatherInfoSection =document.querySelector('.weather_info')

const notFoundSection = document.querySelector('.not_found')
const searchCitySection = document.querySelector('.search_city')

const countryTxt = document.querySelector('.country_text')
const tempTxt = document.querySelector('.temp_txt')
const conditionTxt = document.querySelector('.condition_text')
const humidityValueTxt = document.querySelector('.humidity_value_txt')
const windValueTxt = document.querySelector('.wind_value_txt')
const weatherSummaryImg = document.querySelector('.weather_summary_img')
const currentDateTxt = document.querySelector('.current_date_text')

const forecastItemsContainer = document.querySelector('.forecast_items_container')

const apiKey = '9416813e28bd5f56e44cf7c45a023a8e'

searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() != ''){
        updateWeatherInfo(cityInput.value)
        cityInput.value = '';
        cityInput.blur()
    }
})

cityInput.addEventListener('keydown', (event) => {
    if (event.key == 'Enter' && cityInput.value.trim() != ''){
        updateWeatherInfo(cityInput.value)
        cityInput.value = '';
        cityInput.blur()
    }
})

async function getFetchData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`

    const response = await fetch(apiUrl)

    return response.json()
}

function getWeatherIcon(id) {
    if (id <= 232) return 'thunderstorm.svg'
    if (id <= 321) return 'drizzle.svg'
    if (id <= 531) return 'rain.svg'
    if (id <= 622) return 'snow.svg'
    if (id <= 781) return 'atmosphere.svg'
    if (id <= 800) return 'clear.svg'
    else return 'clouds.svg'
}

function getCurrentDate(){
    const currentDate = new Date()
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }
   
    return currentDate.toLocaleDateString('en-GB', options)
}

async function updateWeatherInfo(city) {
    const weatherData = await getFetchData('weather', city)

    if(weatherData.cod != 200){
        showDisplaySection(notFoundSection)
        return 
    }

    const {
        name: country,
        main: {temp, humidity},
        weather: [{id, main}],
        wind:{speed},
    } = weatherData

    countryTxt.textContent = country
    tempTxt.textContent = Math.round(temp) + '°C'
    conditionTxt.textContent = main 
    humidityValueTxt.textContent = humidity + '%'
    windValueTxt.textContent = speed + 'M/s'


    currentDateTxt.textContent = getCurrentDate()
    weatherSummaryImg.src = `assets/weather/${getWeatherIcon (id)}`


    await updateForecastInfo(city)
    showDisplaySection(weatherInfoSection)
}

async function updateForecastInfo(city ) {
    const forecastData = await getFetchData('forecast', city)

    const timeTaken = '12:00:00'
    const todaysDate = new Date().toISOString().split('T')[0]

    forecastItemsContainer.innerHTML = ''

    forecastData.list.forEach(forecastWeather => {
         if(forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(todaysDate)){
            updateForecastItems(forecastWeather)
         }
    })
}

function updateForecastItems(weatherData){
    console.log(weatherData)
    const {
        dt_txt: date,
        weather: [{ id }],
        main: { temp }
    } = weatherData

    const dateTaken = new Date(date)
    const dateOptions = {
        day:'2-digit',
        month: 'short'
    }

    const dateResult = dateTaken.toLocaleDateString('en-US', dateOptions)

    const forecastItem = `
        <div class="forecast_item">
            <h5 class="forecast_item_date">${dateResult}</h5>
            <img src="assets/weather/${getWeatherIcon(id)}" alt="thunderstorm" class="forecast_item_img">
            <h5 class="forecast_item_temp">${Math.round(temp)} °C</h5>
        </div>
    `

    forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem)
}

function showDisplaySection(section) {
    [weatherInfoSection, searchCitySection, notFoundSection]
        .forEach(section => section.style.display = 'none')

    section.style.display = 'flex'
}