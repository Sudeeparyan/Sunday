import changeToFarenheit from "./export.js";
var weather_data;
let currWeather;
/**
 * @desc function to fetch weather data from the json file and store in a
 * global variable.
 */
(function () {
  fetch("data.json")
    .then((data) => data.json())
    .then((result) => {
      weather_data = result;
      dropdown();
      setTimeout(() => setWeathercard("sunny"), 300);
      setInterval(filtercitycards, 1000);
      setInterval(vaildcity, 1000);
      sortByContinent();
      vaildcity();
    });
  /**
   * @desc this function gives the dropdown for city selection
   */
  function dropdown() {
    var city = Object.keys(weather_data);
    var option = ``;
    for (let i = 0; i < city.length; i++) {
      option += `<option>${weather_data[city[i]].cityName}</option>`;
    }
    document.querySelector("#data_dropdown").innerHTML = option;
  }

  //temperature
  let far;
  let selectedCity;
  document
    .querySelector("#inputdata")
    .addEventListener("change", userselectedcity);

  /**
   * @desc function to check whether user has entered vaild input city
   */

  function userselectedcity() {
    selectedCity = document.querySelector("#inputdata").value.toLowerCase();
    let city = Object.keys(weather_data);
    let currentCity = selectedCity;
    let flag = 0;
    for (let i = 0; i < city.length; i++) {
      if (currentCity == city[i]) {
        vaildcity();
        flag = 1;
      }
    }
    if (flag == 0) {
      invalidcity();
    }
  }

  /**
   * @desc this function sets the null value for weather details when
   * invalid city is selected
   */
  function invalidcity() {
    document.querySelector("#top-tempc").innerText = "-";
    document.querySelector("#top-far").innerText = "-";
    document.querySelector("#top-humidity").innerText = "-";
    document.querySelector("#top-precipitation").innerText = "-";
    document.querySelector("#top-date").innerText = "";
    document.querySelector("#top-time").innerText = "Enter a valid City";
    document.querySelector("#inputdata").style.borderColor = "red";
    document.querySelector("#top-time").style.color = "";
    document.querySelector("#top-img").src = "";
    for (let i = 0; i < 6; i++) {
      document.querySelector(`#time-${i + 1}`).innerText = "-";
      document.querySelector(`#icon-${i + 1}`).src = "";
      document.querySelector(`#temperature-${i + 1}`).innerText = "-";
    }
  }
  /**
   * @desc Based on the user selected city the various fields such as
   *  temperature,precipitation,humidity,live time,date and next
   * five hours temperature and climate icons we get updated.
   */
  function vaildcity() {
    var dropdown = document.querySelector("#inputdata").value.toLowerCase();

    var city = Object.keys(weather_data);
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
    //Image
    document.getElementById(
      "top-img"
    ).src = `HTML & CSS/Icons for cities/${dropdown}.svg`;
    //temperature
    var temp = weather_data[dropdown].temperature;
    document.getElementById("top-tempc").innerHTML = temp;

    //humidity
    document.getElementById("top-humidity").innerHTML =
      weather_data[dropdown].humidity;
    //precipitation
    document.getElementById("top-precipitation").innerHTML =
      weather_data[dropdown].precipitation;
    //temperature F
    let cel = parseInt(weather_data[dropdown].temperature);
    far = changeToFarenheit(cel).toFixed(0) + "F";
    document.getElementById("top-far").innerHTML = far;
    //Date and time
    let datetimeArr;
    datetimeArr = weather_data[dropdown].dateAndTime.split(",");
    document.getElementById("top-time").innerHTML = datetimeArr[1].slice(0, -2);
    document.getElementById("top-date").innerHTML = datetimeArr[0];
    //Date
    let dateSplit = datetimeArr[0];

    let dateArr = dateSplit.split("/");

    let dateInWords =
      String(dateArr[1].padStart(2, "0")) +
      "-" +
      monthArr[dateArr[0] - 1] +
      "-" +
      dateArr[2];
    document.getElementById("top-date").innerHTML = dateInWords;
    // Time
    let time;
    time = new Date().toLocaleString("en-US", {
      timeZone: weather_data[selectedCity].timeZone,
      timeStyle: "medium",
      hourCycle: "h12",
    });
    document.getElementById("top-time").innerHTML = time;

    //Temperature Changing Left
    let sixtemp = [
      parseInt(weather_data[`${dropdown}`].temperature.slice(0, -2)),
      parseInt(weather_data[`${dropdown}`].temperature.slice(0, -2)),
    ];
    for (let i = 0; i < 4; i++) {
      sixtemp[i + 2] = parseInt(
        weather_data[`${dropdown}`].nextFiveHrs[i].slice(0, -2)
      );
    }
    for (let i = 0; i < 6; i++) {
      document.querySelector(`#temperature-${i + 1}`).innerHTML = sixtemp[i];
    }
    // Image Changnging wrt to Temperature
    for (let i = 0; i < 6; i++) {
      if (sixtemp[i] < 0) {
        document.querySelector(`#icon-${i + 1}`).src =
          "HTML & CSS/Weather Icons/snowflakeIcon.svg";
      } else if (sixtemp[i] < 18 && sixtemp[i] > 0) {
        document.querySelector(`#icon-${i + 1}`).src =
          "HTML & CSS/Weather Icons/rainyIcon.svg";
      } else if (sixtemp[i] >= 18 && sixtemp[i] <= 22) {
        document.querySelector(`#icon-${i + 1}`).src =
          "HTML & CSS/Weather Icons/windyIcon.svg";
      } else if (sixtemp[i] >= 23 && sixtemp[i] <= 29) {
        document.querySelector(`#icon-${i + 1}`).src =
          "HTML & CSS/Weather Icons/cloudyIcon.svg";
      } else if (sixtemp[i] > 29) {
        document.querySelector(`#icon-${i + 1}`).src =
          "HTML & CSS/Weather Icons/sunnyIcon.svg";
      }
    }
    //Hours changing with wrt to time.
    let hour = parseInt(time.split(":")[0]);
    let noon = time.slice(-2);
    for (let i = 0; i < 6; i++) {
      if (hour > 12) {
        hour = hour - 12;
      }
      if (i == 0) {
        document.querySelector(`#time-${i + 1}`).innerHTML = "NOW";
      } else {
        document.querySelector(`#time-${i + 1}`).innerHTML = hour + " " + noon;
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
  //Task 2
  var sortedSunnyWeatherValues = [];
  var sortedsnowWeatherValues = [];
  var sortedRainyWeatherValues = [];
  document.querySelector("#sunny").addEventListener("click", () => {
    setWeathercard("sunny");
  });
  document.querySelector("#snowflake").addEventListener("click", () => {
    setWeathercard("snowflake");
  });
  document.querySelector("#rainy").addEventListener("click", () => {
    setWeathercard("rainy");
  });
  document
    .querySelector("#displaynum")
    .addEventListener("change", filtercitycards);

  /**
   * @desc function to sort cities based on sunny rainy or cold option choosen by the user
   * @param {@String} arr all values of cities data.
   * @param {*String} constraint type of weather like suuny,cold,rainy
   * @returns returns the sorted city array.
   */
  function sortCities(arr, constraint) {
    if (constraint == "temperature") {
      arr.sort((a, b) => {
        return parseInt(b.temperature) - parseInt(a.temperature);
      });
    } else if (constraint == "precipitation") {
      arr.sort((a, b) => {
        return parseInt(b.precipitation) - parseInt(a.precipitation);
      });
    } else {
      arr.sort((a, b) => {
        return parseInt(b.humidity) - parseInt(a.humidity);
      });
    }
    return arr;
  }
  //Display Middle Cards
  /**
   * @desc function to display cards containing sorted cities  as per user preferences
   * @param {*} arr all cities data in string format.
   */
  function displaycitycards(arr) {
    let card = "";
    for (let i = 0; i < arr.length; i++) {
      let time = new Date().toLocaleString("en-US", {
        timeZone: arr[i].timeZone,
        timeStyle: "medium",
        hourCycle: "h12",
      });
      card += `<div class="mid">
              <div class="mid-item">
                <div>${arr[i].cityName}</div>
                <div class="mid-img">
                  <img src="HTML & CSS/Weather Icons/${currWeather}Icon.svg" alt="sunny" />
                  <span>${arr[i].temperature}</span>
                </div>
              </div>
              <div class="city-card-time">${time}</div>
              <div>
                <img
                  src="HTML & CSS/Weather Icons/humidityIcon.svg"
                  alt="rainy"
                />${arr[i].humidity}
              </div>
              <div>
                <img src="HTML & CSS/Weather Icons/precipitationIcon.svg" 
                />${arr[i].precipitation}
              </div>
            </div>`;
    }
    document.querySelector(".middle-block").innerHTML = card;
    document.querySelectorAll(".mid").forEach((element, i) => {
      element.style.backgroundImage = `url('./HTML & CSS/Icons for cities/${arr[
        i
      ].cityName.toLowerCase()}.svg')`;
    });
  }
  /**
   * @desc function to manage the numberof cities cards displayed based on
   * display top like minimumand maximum numbers.
   */
  function filtercitycards() {
    let limiter = parseInt(document.querySelector("#displaynum").value);
    if (currWeather == "sunny") {
      if (sortedSunnyWeatherValues.length > limiter) {
        if (limiter < 4) {
          document.querySelector("#curser-left").style.display = "none";
          document.querySelector("#curser-right").style.display = "none";
        } else {
          document.querySelector("#curser-left").style.display = "block";
          document.querySelector("#curser-right").style.display = "block";
        }
        displaycitycards(sortedSunnyWeatherValues.slice(0, limiter));
      } else {
        displaycitycards(sortedSunnyWeatherValues);
      }
    } else if (currWeather == "snowflake") {
      if (sortedsnowWeatherValues.length > limiter) {
        if (limiter < 4) {
          document.querySelector("#curser-left").style.display = "none";
          document.querySelector("#curser-right").style.display = "none";
        } else {
          document.querySelector("#curser-left").style.display = "block";
          document.querySelector("#curser-right").style.display = "block";
        }
        displaycitycards(sortedsnowWeatherValues.slice(0, limiter));
      } else {
        displaycitycards(sortedsnowWeatherValues);
      }
    } else {
      if (sortedRainyWeatherValues.length > limiter) {
        if (limiter < 4) {
          document.querySelector("#curser-left").style.display = "none";
          document.querySelector("#curser-right").style.display = "none";
        } else {
          document.querySelector("#curser-left").style.display = "block";
          document.querySelector("#curser-right").style.display = "block";
        }
        displaycitycards(sortedRainyWeatherValues.slice(0, limiter));
      } else {
        displaycitycards(sortedRainyWeatherValues);
      }
    }
  }
  /**
   * function to define the content of the weather cards based on the
   *  weather attributes and display top attributes selected by the user
   * @param {*String} weather holds the value of currently
   * selected weather like sunny,snow, rainny
   */
  function setWeathercard(weather) {
    currWeather = weather;
    var cityValues = Object.values(weather_data);
    let sunnyWeather = [];
    let snowWeather = [];
    let rainyWeather = [];
    document.getElementById("sunny").style.borderBottom = "none";
    document.getElementById("rainy").style.borderBottom = "none";
    document.getElementById("snowflake").style.borderBottom = "none";
    //SUNNY Weather
    if (weather == "sunny") {
      document.getElementById("sunny").style.borderBottom = "2px solid #1E90FF";
      //Get the cities with sunny weather using call function
      Array.prototype.forEach.call(cityValues, function (city) {
        if (
          parseInt(city.temperature) > 29 &&
          parseInt(city.humidity) < 50 &&
          parseInt(city.precipitation) >= 50
        ) {
          sunnyWeather.push(city);
        }
      });
      //Get the cities with sunny weather using bind function
      // var filterCities = function(cityValues, sunnyWeather, city) {
      //   if (parseInt(city.temperature) > 29 && parseInt(city.humidity) < 50 && parseInt(city.precipitation) >= 50) {
      //     sunnyWeather.push(city);
      //   }
      // };
      // var filterSunnyCities = filterCities.bind(null, cityValues, sunnyWeather);
      // Sort the cities in descending order of temperature
      sortedSunnyWeatherValues = sortCities(sunnyWeather, "temperature");
      //Display the city details in cards
      let slicedSortedSunnyWeatherValues = filtercitycards();
    }
    //SNOW Weather
    if (weather == "snowflake") {
      //Get the cities with snow weather
      document.getElementById("snowflake").style.borderBottom =
        "2px solid #1E90FF";
      for (let i = 0; i < cityValues.length; i++) {
        if (
          parseInt(cityValues[i].temperature) >= 20 &&
          parseInt(cityValues[i].temperature) < 28 &&
          parseInt(cityValues[i].humidity) > 50 &&
          parseInt(cityValues[i].precipitation) < 50
        ) {
          snowWeather.push(cityValues[i]);
        }
      }
      // Sort the cities in descending order of temperature
      sortedsnowWeatherValues = sortCities(snowWeather, "temperature");
      let slicedsortedsnowWeatherValues = filtercitycards();
      //Display the city details in cards
    }
    //Rainy weather
    if (weather == "rainy") {
      //Get the cities with rainy weather using filter method.
      const rainyWeather = cityValues.filter((city) => {
        const temperature = parseInt(city.temperature);
        const humidity = parseInt(city.humidity);
        return temperature < 20 && humidity >= 50;
      });
      document.getElementById("rainy").style.borderBottom = "2px solid #1E90FF";
      //Sort cities in descending order of humidity
      sortedRainyWeatherValues = sortCities(rainyWeather, "humidity");
      //Display the city details in cards
      let slicedsortedRainyWeatherValues = filtercitycards();
    }
  }
  //scroll bars
  document.querySelector("#curser-left").addEventListener("click", () => {
    document.querySelector("#middle-block").scrollLeft -= 300;
  });
  document.querySelector("#curser-right").addEventListener("click", () => {
    document.querySelector("#middle-block").scrollLeft += 300;
  });

  //Task 3
  let continentOrder = 0;
  let temperatureOrder = 1;
  // function setCityTimeZones(city) {
  //   return city.timeZone.split("/")[0];
  // }
  /**
   * @desc Display the lower card and based on the user selected continent and temperature.
   */
  function displayContinentCards() {
    let continentCard = ``;
    let cityTimeZones = allCities.map(setCityTimeZones);
    let time;
    for (let i = 0; i < 12; i++) {
      time = new Date().toLocaleString("en-US", {
        timeZone: allCities[i].timeZone,
        timeStyle: "medium",
        hourCycle: "h12",
      });
      let timeNow = time;
      let noonNow = timeNow.slice(-2);
      let hourAndMin = timeNow.split(":");
      continentCard += `<div class="grid-item">
                <div class="grid-text">
                  <p class="country-names">${cityTimeZones[i]}</p>
                  <span class="btm-temp">${allCities[i].temperature}</span>
                </div>
                <p class="grid-text">
                ${allCities[i].cityName}, ${hourAndMin[0]}:${hourAndMin[1]} ${noonNow}<span
                    ><img
                      src="HTML & CSS/Weather Icons/humidityIcon.svg"
                      alt="rainy"
                    />
                    ${allCities[i].humidity}</span
                  >
                </p>
          </div>`;
    }
    document.querySelector(".bottom-grid").innerHTML = continentCard;
  }

  let allCities;
  /**
   * @desc this function Sort the Continent based on asscending or decending orders based on the user preference.
   */
  function sortByContinent() {
    allCities = Object.values(weather_data);
    if (continentOrder == 0) {
      if (temperatureOrder == 0) {
        allCities.sort((a, b) => {
          if (a.timeZone.split("/")[0] === b.timeZone.split("/")[0]) {
            return parseInt(a.temperature) < parseInt(b.temperature) ? -1 : 1;
          } else {
            return a.timeZone.split("/")[0] < b.timeZone.split("/")[0] ? -1 : 1;
          }
        });
      } else {
        allCities.sort((a, b) => {
          if (a.timeZone.split("/")[0] === b.timeZone.split("/")[0]) {
            return parseInt(b.temperature) < parseInt(a.temperature) ? -1 : 1;
          } else {
            return a.timeZone.split("/")[0] < b.timeZone.split("/")[0] ? -1 : 1;
          }
        });
      }
    } else {
      if (temperatureOrder == 0) {
        allCities.sort((a, b) => {
          if (a.timeZone.split("/")[0] === b.timeZone.split("/")[0]) {
            return parseInt(a.temperature) < parseInt(b.temperature) ? -1 : 1;
          } else {
            return b.timeZone.split("/")[0] < a.timeZone.split("/")[0] ? -1 : 1;
          }
        });
      } else {
        allCities.sort((a, b) => {
          if (a.timeZone.split("/")[0] === b.timeZone.split("/")[0]) {
            return parseInt(b.temperature) < parseInt(a.temperature) ? -1 : 1;
          } else {
            return b.timeZone.split("/")[0] < a.timeZone.split("/")[0] ? -1 : 1;
          }
        });
      }
    }
    displayContinentCards();
  }
  
  document.querySelector("#continent").addEventListener("click", function () {
    if (continentOrder == 0) {
      continentOrder = 1;
      document.querySelector("#bottom-continent-arrow").src =
        "HTML & CSS/General Images & Icons/arrowUp.svg";
    } else if (continentOrder == 1) {
      continentOrder = 0;
      document.querySelector("#bottom-continent-arrow").src =
        "HTML & CSS/General Images & Icons/arrowDown.svg";
    }
    sortByContinent();
  });
  document.querySelector("#bottom-temp").addEventListener("click", function () {
    if (temperatureOrder == 0) {
      temperatureOrder = 1;
      document.querySelector("#bottom-temp-arrow").src =
        "HTML & CSS/General Images & Icons/arrowUp.svg";
    } else if (temperatureOrder == 1) {
      temperatureOrder = 0;
      document.querySelector("#bottom-temp-arrow").src =
        "HTML & CSS/General Images & Icons/arrowDown.svg";
    }
    sortByContinent();
  });
})(); //IIFE
