//api key
let APIkey = '7d66972ca06ab091eb1e5cd735e65fa9'


for (i=1; i < 6; i++) {
    var getKey = $('#button'+i).attr('id');
    $('#button'+i).text(localStorage.getItem(getKey));

    if (localStorage.getItem(getKey) == null || localStorage.getItem(getKey) == '') {
        $('#button'+i).attr('style', 'visibility: hidden;');   
    } 
};

findCity($('#button1').text());

//city finder beginning
function findCity(event){
    event.preventDefault();     
};

//store city
function buttonSet(city) {
    for (i=5; i > 0; i--) {
        var key = $('#button'+i).attr('id');
        $('#button'+i).text($('#button'+(i-1)).text());
        localStorage.setItem(key, $('#button'+i).text());
    }
    
    $('#button1').text(city);
    localStorage.setItem($('#button1').attr('id'), $('#button1').text());

    for (i=1; i < 6; i++) {
        if ($('#button'+i).text() != '') {
            $('#button'+i).attr('style', 'visibility: visible;');
        };
    }
    findCity(city);
    }

//history
function history() {
    findCity(this.textContent);
};

//find city continued
function findCity(city){

    var geoCoder = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${APIkey}`;
    fetch(geoCoder)
    .then(function(response) {
        return response.json()
    })
    .then(function(data){
        var long = data[0].lon;
        var latt = data[0].lat;

        var todaysWeather = `https://api.openweathermap.org/data/2.5/onecall?lat=${latt}&lon=${long}&units=imperial&appid=${APIkey}`;
        fetch(todaysWeather)
            .then(function(response) {
                return response.json();
            })
            .then(function(output){

                $('#cityName').text(city);
                $('#date').text(Date.now().toLocaleString());
                $('#temp').text(`Temp: ${output.current.temp}ºF`);
                $('#windSp').text(`Wind: ${output.current.wind_speed} MPH`);
                $('#humid').text(`Humidity: ${output.current.humidity}%`);
                $('#uvIndex').text(`UV Index: `).append(`<span class="uvColors">${output.current.uvi}</span>`);

                if (output.current.uvi <= 2) {
                    $('.uvColors').attr('style', 'background-color: green; border-radius: 5px; padding: 3px 5px;')
                } else if (output.current.uvi >= 6) {
                    $('.uvColors').attr('style', 'background-color: red; border-radius: 5px; padding: 3px 5px; font-weight: bold; color: black')
                } else {
                    $('.uvColors').attr('style', 'background-color: yellow; border-radius: 5px; padding: 3px 5px; font-weight: bold; color: black')
                }

                //Generates 5 day weather forecast for target city
                $('#fiverForecast').text('5 Day Forecast')
                for (i=1; i < 6; i++) {
                    $('#dateFore'+i).text(`Date: ${Date.now().plus({days:i}).toLocaleString()}`);
                    $('#tempFore'+i).text(`Temp: ${output.daily[i].temp.day}ºF`);
                    $('#windFore'+i).text(`Wind: ${output.daily[i].wind_speed} MPH`);
                    $('#humidFore'+i).text(`Humidity: ${output.daily[i].humidity}%`);
                }
        
            })
    });
};

//Search Button event listener
$('#searchBtn').on('click', findCity);

//Search History Buttons event listener
$('.btn').on('click', history);