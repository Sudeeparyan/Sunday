import { changeToFarenheit } from "./fahrenheit.js";

/**
 * @desc this function fetches json data and creates a new instance of weatherApp constructor function
 */

fetch("https://soliton.glitch.me/all-timezone-cities")
  .then((data) => data.json())
  .then((result) => {  
    let allCities={};
    for(let i=0; i<result.length;i++){
      allCities[result[i]['cityName']]=result[i];
    }
    console.log(allCities);
    let initialize = new weatherApp(allCities);
    initialize.weatherNow = "sunny";
    initialize.createDropdown();
    initialize.initialCity();
    initialize.callChange();
    initialize.setWeatherCard("sunny");
    initialize.sortByContinent();
    setInterval(initialize.callChange.bind(initialize), 1000);
    //setInterval(initialize.setWeatherCard.bind(initialize,initialize.weatherNow), 1000);
    setInterval(initialize.sortByContinent.bind(initialize), 60000);
  });

/**
 * @desc this constructor function initializes a new object
 * @param {*} weatherData json data of all cities
 */

class weatherApp {
  constructor(weatherData) {
    this.weatherData = weatherData;
    this.weather = Object.keys(this.weatherData);
    this.parameters = Object.values(this.weatherData);
    this.cityArr = [];
    this.weatherNow;
    this.continentOrder = 0;
    this.temperatureOrder = 0;

    document
      .querySelector("#datalist")
      .addEventListener("input", this.callChange.bind(this));

    document
      .querySelector("#sunny-selector")
      .addEventListener("click", this.setWeatherCard.bind(this, "sunny"));

    document
      .querySelector("#snowy-selector")
      .addEventListener("click", this.setWeatherCard.bind(this, "snowflake"));

    document
      .querySelector("#rainy-selector")
      .addEventListener("click", this.setWeatherCard.bind(this, "rainy"));

    document
      .querySelector("#filter-number")
      .addEventListener("change", this.setMinMax.bind(this));

    document.querySelector("#next").addEventListener("click", () => {
      document.querySelector("#carosel").scrollLeft += 300;
    });

    document.querySelector("#prev").addEventListener("click", () => {
      document.querySelector("#carosel").scrollLeft -= 300;
    });

    document
      .querySelector("#sortby-continent")
      .addEventListener("click", () => {
        if (this.continentOrder == 0) {
          this.continentOrder = 1;
          document.querySelector("#continent-sort-arrow").src =
            "../assets/General-images/arrowUp.svg";
        } else if (this.continentOrder == 1) {
          this.continentOrder = 0;
          document.querySelector("#continent-sort-arrow").src =
            "../assets/General-images/arrowDown.svg";
        }

        this.sortByContinent();
      });

    document
      .querySelector("#sortby-temperature")
      .addEventListener("click", () => {
        if (this.temperatureOrder == 0) {
          this.temperatureOrder = 1;
          document.querySelector("#temperature-sort-arrow").src =
            "../assets/General-images/arrowUp.svg";
        } else if (this.temperatureOrder == 1) {
          this.temperatureOrder = 0;
          document.querySelector("#temperature-sort-arrow").src =
            "../assets/General-images/arrowDown.svg";
        }

        this.sortByContinent();
      });
  }
  /**
   * @desc this prototype function creates a dropdown with all cities
   */
  createDropdown() {
    let option = "";
    for (let i = 0; i < this.weather.length; i++) {
      option += `<option>${this.weather[i]}</option>`;
    }

    document.querySelector("#datalist_dropdown").innerHTML = option;
  }
  /**
   * @desc this prototype function initializes the default city to the first one in data
   */
  initialCity() {
    document.querySelector("#datalist").value = this.weather[0];
  }
  /**
   * @desc this prototype function checks for valid city and calls corresponding functions
   */
  callChange() {
    let currentCity = document.querySelector("#datalist").value;
    let flag = 0;

    for (let i = 0; i < this.weather.length; i++) {
      if (currentCity == this.weather[i]) {
        flag = 1;
        this.changeParams();
      }
    }

    if (flag == 0) {
      this.SetNullParams();
    }
  }

  /**
   * @desc this prototype function displays hourly temperatures along with their icons
   * @param {*} currTemp temperature of the currently selected city
   * @param {*} tempArr object containing temperature of next five hours
   */
  setNextFiveHoursTemp(currTemp, tempArr) {
    let nextSixTemp = [parseInt(currTemp)];
    for (let i = 0; i < 5; i++) {
      nextSixTemp[i + 1] = parseInt(tempArr["temperature"][i]);
    }
    console.log(nextSixTemp);
    for (let i = 0; i < 6; i++) {
      let currTemperature = parseInt(tempArr["temperature"][i - 1]);

      document.querySelector(`#temperature-${i + 1}`).innerHTML =
        nextSixTemp[i];
      if (nextSixTemp[i] < 0) {
        document.querySelector(`#icon-weather-${i + 1}`).src =
          "../assets/weather-icons/snowflakeIcon.svg";
      } else if (nextSixTemp[i] < 18 && nextSixTemp[i] > 0) {
        document.querySelector(`#icon-weather-${i + 1}`).src =
          "../assets/weather-icons/rainyIcon.svg";
      } else if (nextSixTemp[i] >= 18 && nextSixTemp[i] <= 22) {
        document.querySelector(`#icon-weather-${i + 1}`).src =
          "../assets/weather-icons/windyIcon.svg";
      } else if (nextSixTemp[i] >= 18 && nextSixTemp[i] <= 22) {
        document.querySelector(`#icon-weather-${i + 1}`).src =
          "../assets/weather-icons/windyIcon.svg";
      } else if (nextSixTemp[i] >= 23 && nextSixTemp[i]) {
        document.querySelector(`#icon-weather-${i + 1}`).src =
          "../assets/weather-icons/cloudyIcon.svg";
      } else if (nextSixTemp[i] > 29) {
        document.querySelector(`#icon-weather-${i + 1}`).src =
          "../assets/weather-icons/sunnyIcon.svg";
      }
    }
  }

  /**
   * @desc this prototype function updates the weather data for the selected city
   */

  changeParams() {
    document.querySelector("#datalist").style.borderColor = "";
    let monthArr = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    let currentCity = document.querySelector("#datalist").value;
    console.log(currentCity);
    let imageSrc = document.querySelector("#logo");
    imageSrc.src = `../assets/city-icons/${currentCity}.svg`;

    let temperature = document.querySelector("#temp-c-bottom");
    let farenheit = document.querySelector("#farenheit");
    let humidity = document.querySelector("#humidity");
    let precipitation = document.querySelector("#precipitation");
    let date = document.querySelector("#date");
    let time = document.querySelector("#time");

    temperature.innerHTML = this.weatherData[`${currentCity}`].temperature;
    farenheit.innerHTML = changeToFarenheit(
      this.weatherData[`${currentCity}`].temperature
    );

    humidity.innerHTML = this.weatherData[`${currentCity}`].humidity;
    precipitation.innerHTML = this.weatherData[`${currentCity}`].precipitation;

    //let sixHoursTemp=[];

    //console.log(sixHoursTemp);
    let dateAndTime = this.weatherData[`${currentCity}`].dateAndTime;
    let dateAndTimeArr = dateAndTime.split(",");
    let dateInMonth = dateAndTimeArr[0].split("/");
    let dateInMonths =
      String(dateInMonth[1].padStart(2, "0")) +
      "-" +
      monthArr[dateInMonth[0] - 1] +
      "-" +
      dateInMonth[2];

    date.innerHTML = dateInMonths;
    time.innerHTML = dateAndTimeArr[1];

    let timeZone = this.weatherData[`${currentCity}`].timeZone;
    let currTime = this.setTime(timeZone);

    time.innerHTML = currTime;
    time.style.color = "#ffe5b4";

    fetch(`https://soliton.glitch.me?city=${currentCity}`)
      .then((data) => data.json())
      .then((result) => {
        fetch("https://soliton.glitch.me/hourly-forecast", {
          method: "POST",
          body: JSON.stringify({
            ...result,
            hours: "5",
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        })
          .then((data) => data.json())
          .then((result) => {
            for (let i = 0; i < 5; i++) {
              this.setNextFiveHoursTemp(
                this.weatherData[`${currentCity}`].temperature,
                result
              );
            }
          });
      });

    let hour = parseInt(currTime.split(":")[0]);
    let noon = currTime.split(" ")[1];

    for (let i = 0; i < 6; i++) {
      if (hour > 12) {
        hour = hour - 12;
      }

      if (i == 0) {
        document.querySelector(`#hourly-time-${i + 1}`).innerHTML = "NOW";
      } else {
        document.querySelector(`#hourly-time-${i + 1}`).innerHTML =
          hour + " " + noon;
      }

      if (hour == 11 && noon == "PM") {
        noon = "AM";
        hour = 12;
      } else if (hour == 11 && noon == "AM") {
        hour = 12;
        noon = "PM";
      } else {
        hour++;
      }
    }
  }
  /**
   * @desc this prototype function sets all weather data to null for invalid city
   */

  SetNullParams() {
    document.querySelector("#temp-c-bottom").innerHTML = "-";
    document.querySelector("#farenheit").innerHTML = "-";
    document.querySelector("#humidity").innerHTML = "-";
    document.querySelector("#precipitation").innerHTML = "-";
    document.querySelector("#date").innerHTML = "";
    document.querySelector("#time").innerHTML = "Enter a valid City";
    document.querySelector("#datalist").style.borderColor = "red";
    document.querySelector("#time").style.color = "red";
    document.querySelector("#logo").src =
      "../../assets/city-icons/weather-app.png";

    for (let i = 0; i < 6; i++) {
      document.querySelector(`#hourly-time-${i + 1}`).innerHTML = "-";
      document.querySelector(`#icon-weather-${i + 1}`).src =
        "../assets/weather-icons/sad.png";
      document.querySelector(`#temperature-${i + 1}`).innerHTML = "-";
    }
  }
  /**
   * @desc this prototype function sets the current time for the specified timezone
   * @param {*} timeZone timeZone of the currently selected city
   * @returns current time
   */
  setTime(timeZone) {
    return new Date().toLocaleString("en-US", {
      timeZone: timeZone,
      timeStyle: "medium",
      hourCycle: "h12",
    });
  }
  /**
   * @desc this prototype function categorizes cities as sunny, snowy or rainy based on user input
   * @param {*} currWeather holds the currently selected weather type
   */
  setWeatherCard(currWeather) {
    this.cityArr = [];
    this.weatherNow = currWeather;
    if (this.weatherNow == "sunny") {
      document.querySelector("#sunny-selector").style.borderBottom =
        "2px solid #1E90FF";
      document.querySelector("#sunny-selector").style.paddingBottom = "8px";
      document.querySelector("#snowy-selector").style.borderBottom = "";
      document.querySelector("#rainy-selector").style.borderBottom = "";

      for (let i = 0; i < this.parameters.length; i++) {
        let currCityTemp = parseInt(this.parameters[i]["temperature"]);
        let currCityHumidity = parseInt(this.parameters[i]["humidity"]);
        let currCityPrecipitation = parseInt(
          this.parameters[i]["precipitation"]
        );
        if (
          currCityTemp > 29 &&
          currCityHumidity < 50 &&
          currCityPrecipitation >= 50
        ) {
          this.cityArr.push(this.parameters[i]);
        }
      }
    } else if (this.weatherNow == "snowflake") {
      document.querySelector("#snowy-selector").style.borderBottom =
        "2px solid #1E90FF";
      document.querySelector("#snowy-selector").style.paddingBottom = "8px";
      document.querySelector("#sunny-selector").style.borderBottom = "";
      document.querySelector("#rainy-selector").style.borderBottom = "";

      for (let i = 0; i < this.parameters.length; i++) {
        let currCityTemp = parseInt(this.parameters[i]["temperature"]);
        let currCityHumidity = parseInt(this.parameters[i]["humidity"]);
        let currCityPrecipitation = parseInt(
          this.parameters[i]["precipitation"]
        );
        if (
          currCityTemp >= 20 &&
          currCityTemp <= 28 &&
          currCityHumidity > 50 &&
          currCityPrecipitation < 50
        ) {
          this.cityArr.push(this.parameters[i]);
        }
      }
    } else {
      document.querySelector("#rainy-selector").style.borderBottom =
        "2px solid #1E90FF";
      document.querySelector("#rainy-selector").style.paddingBottom = "8px";
      document.querySelector("#snowy-selector").style.borderBottom = "";
      document.querySelector("#sunny-selector").style.borderBottom = "";

      for (let i = 0; i < this.parameters.length; i++) {
        let currCityTemp = parseInt(this.parameters[i]["temperature"]);
        let currCityHumidity = parseInt(this.parameters[i]["humidity"]);
        if (currCityTemp < 20 && currCityHumidity >= 50) {
          this.cityArr.push(this.parameters[i]);
        }
      }
    }
    console.log(this.cityArr);
    this.sortCityParams();
  }
  /**
   * @desc this prototype function sorts the cities based on weather type
   */
  sortCityParams() {
    if (this.weatherNow == "sunny") {
      this.cityArr.sort((a, b) => {
        return parseInt(b.temperature) - parseInt(a.temperature);
      });
    } else if (this.weatherNow == "snowflake") {
      this.cityArr.sort((a, b) => {
        return parseInt(b.precipitation) - parseInt(a.precipitation);
      });
    } else {
      this.cityArr.sort((a, b) => {
        return parseInt(b.humidity) - parseInt(a.humidity);
      });
    }

    this.setMinMax();
  }
  /**
   * @desc this prototype function filters the number of city cards to be displayed based on user selection
   */
  setMinMax() {
    let limit = document.querySelector("#filter-number").value;
    let slicedCityArr = [];
    if (this.cityArr.length > limit) {
      slicedCityArr = this.cityArr.slice(0, limit);
    } else {
      slicedCityArr = this.cityArr;
    }
    if (slicedCityArr.length <= 4) {
      document.querySelector("#prev").style.visibility = "hidden";
      document.querySelector("#next").style.visibility = "hidden";
    } else {
      document.querySelector("#prev").style.visibility = "";
      document.querySelector("#next").style.visibility = "";
    }

    this.displayCards(slicedCityArr);
  }
  /**
   * @desc this prototype function displays the filtered number of city cards
   * @param {*} slicedCityArr holds the filtered number of city parameters
   */
  displayCards(slicedCityArr) {
    let weatherCard = "";

    for (let i = 0; i < slicedCityArr.length; i++) {
      weatherCard += `<div class="carosel-item" id="carosel-item-${i}">
      <div class="carosel-content">
        <div class="carosel-content-child">
          <div class="place" id="carosel-place">
            ${slicedCityArr[i]["cityName"]}
          </div>
          <div class="place-weather">
            <img src="../assets/weather-icons/${
              this.weatherNow
            }Icon.svg" alt="rainyIcon" />
            ${slicedCityArr[i]["temperature"]}
            
          </div>
        </div>
        <div class="carosel-content" id="carosel-time">
          ${this.setTime(slicedCityArr[i]["timeZone"])}
        </div>
        <div class="carosel-content" id="carosel-date">
          ${slicedCityArr[i]["dateAndTime"].split(",")[0]}
        </div>
        <div class="carosel-content">
          <div class="carosel-content-child2">
            <div class="humid-icon">
              <img
                id="carosel-humidity-icon"
                src="../assets/weather-icons/humidityIcon.svg"
                alt="humidityIcon"
              />
            </div>
            <div class="humid-value" id="">
              ${slicedCityArr[i]["humidity"]}
            </div>
          </div>
        </div>
        <div class="carosel-content">
          <div class="carosel-content-child2">
            <div class="prec-icon">
              <img
                src="../assets/weather-icons/precipitationIcon.svg"
                alt="precipitationIcon"
              />
            </div>
            <div class="prec-value">${slicedCityArr[i]["precipitation"]}</div>
          </div>
        </div>
      </div>
    </div>`;
    }

    document.querySelector("#carosel").innerHTML = weatherCard;

    for (let i = 0; i < slicedCityArr.length; i++) {
      document.querySelector(
        `#carosel-item-${i}`
      ).style.backgroundImage = `url(../assets/city-icons/${slicedCityArr[i]["cityName"]}.svg)`;
    }
  }
  /**
   * @desc this prototype function sorts the cards either ascending or descending w.r.t continent and temperature
   */
  sortByContinent() {
    if (this.continentOrder == 0) {
      if (this.temperatureOrder == 0) {
        this.parameters.sort((a, b) => {
          console.log(a.timeZone.split("/")[0]);
          if (a.timeZone.split("/")[0] === b.timeZone.split("/")[0]) {
            return parseInt(a.temperature) < parseInt(b.temperature) ? -1 : 1;
          } else {
            return a.timeZone.split("/")[0] < b.timeZone.split("/")[0] ? -1 : 1;
          }
        });
      } else {
        this.parameters.sort((a, b) => {
          if (a.timeZone.split("/")[0] === b.timeZone.split("/")[0]) {
            return parseInt(b.temperature) < parseInt(a.temperature) ? -1 : 1;
          } else {
            return a.timeZone.split("/")[0] < b.timeZone.split("/")[0] ? -1 : 1;
          }
        });
      }
    } else {
      if (this.temperatureOrder == 0) {
        this.parameters.sort((a, b) => {
          if (a.timeZone.split("/")[0] === b.timeZone.split("/")[0]) {
            return parseInt(a.temperature) < parseInt(b.temperature) ? -1 : 1;
          } else {
            return b.timeZone.split("/")[0] < a.timeZone.split("/")[0] ? -1 : 1;
          }
        });
      } else {
        this.parameters.sort((a, b) => {
          if (a.timeZone.split("/")[0] === b.timeZone.split("/")[0]) {
            return parseInt(b.temperature) < parseInt(a.temperature) ? -1 : 1;
          } else {
            return b.timeZone.split("/")[0] < a.timeZone.split("/")[0] ? -1 : 1;
          }
        });
      }
    }

    this.displayContinentCards();
  }
  /**
   * @desc this prototype function displays the top 12 city cards
   */
  displayContinentCards() {
    let continentCard = "";
    let cityTimeZones = this.parameters.map(this.setCityTimeZones);

    for (let i = 0; i < 12; i++) {
      let timeNow = this.setTime(this.parameters[i]["timeZone"]);
      let noonNow = timeNow.split(" ")[1];
      let hourAndMin = timeNow.split(":");

      continentCard += `<div class="bottom-child">
          <div class="bottom-child-content-cont">${cityTimeZones[i]}</div>
          <div class="bottom-child-content-temp">${this.parameters[i]["temperature"]}</div>
          <div class="bottom-child-content-state">${this.parameters[i]["cityName"]}, ${hourAndMin[0]}:${hourAndMin[1]} ${noonNow}</div>
          <div class="bottom-child-content-icon">
            <span><img src="../assets/weather-icons/humidityIcon.svg" alt="humidityIcon"/>${this.parameters[i]["humidity"]}</span>
          </div>
        </div> `;
    }

    document.querySelector("#continent-wise-weather").innerHTML = continentCard;
  }
  /**
   * @desc this prototype function filters only the continent name of the city
   * @param {*} city array of cities and their parameters
   * @returns continent names of the cities
   */
  setCityTimeZones(city) {
    return city.timeZone.split("/")[0];
  }
}
















