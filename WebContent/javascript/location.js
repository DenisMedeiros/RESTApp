//when the page finishes the loading, run the following functions.
window.onload = function(){

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(getLocationFromBrowser);
	} else {
		console.log("Geolocation is not supported by this browser.");
	}

	getIpAddress();
};

//get nearby busstops for using the IP and browser information

function getBusStops(latitude, longitude) {

	// to avoid the Cross-Origin Request Blocked
	
	$.ajax({
		type: 'GET',
		url: "http://api.smsmybus.com/v1/getnearbystops?key=uwcompsci&lat=" + latitude + "&lon=" + longitude,
		dataType: 'jsonp',
		success: function(data) {
			
			console.log("http://api.smsmybus.com/v1/getnearbystops?key=uwcompsci&lat=" + latitude + "&lon=" + longitude);
			console.log(data);
			
			// TODO add the data about the bus' stops
			
		}
	});
	
	
}

//get the location using the browser information.

function getLocationFromBrowser(position) {

	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;

	var browserLatitude = document.getElementById("browserLatitude");
	var browserLongitude = document.getElementById("browserLongitude");
	browserLatitude.textContent = latitude.toFixed(4);
	browserLongitude.textContent = longitude.toFixed(4);

	getBusStops(latitude, longitude); // get bus stop information

	getWeatherInformation(latitude, longitude, "browser"); // get weather information.
}

//get the IP address of the client.

function getIpAddress(){

	var xmlhttp = null;

	if (window.XMLHttpRequest) {
		xmlhttp=new XMLHttpRequest(); // code for all modern browsers
	}
	else{
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP"); // code for IE6, IE5
	}

	xmlhttp.open("GET","http://www.telize.com/jsonip",true);

	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) { // if the response is ready.
			var data = JSON.parse(xmlhttp.responseText);
			var ipAddress = document.getElementById("ipAddress");
			ipAddress.textContent = data.ip;

			getLocationByIp(data.ip); // get the location of this ip.

		}
	};

	xmlhttp.send();


}

//get the location of this ip.

function getLocationByIp(ip){

	var xmlhttp = null;

	if (window.XMLHttpRequest) {
		xmlhttp=new XMLHttpRequest(); // code for all modern browsers
	}
	else{
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP"); // code for IE6, IE5
	}

	xmlhttp.open("GET","http://www.telize.com/geoip/" + ip, true); // get a set of information about this ip

	xmlhttp.onreadystatechange=function() {

		if (xmlhttp.readyState==4 && xmlhttp.status==200) { // if the response is ready
			var data = JSON.parse(xmlhttp.responseText);


			var ipLatitude = document.getElementById("ipLatitude");
			var ipLongitude = document.getElementById("ipLongitude");

			ipLatitude.textContent = data.latitude;
			ipLongitude.textContent = data.longitude;

			getBusStops(data.latitude, data.longitude);  // get bus stop information

			getWeatherInformation(data.latitude, data.longitude, "ip");

		}
	};

	xmlhttp.send();

}

//get the weather information base on location.

function getWeatherInformation(latitude, longitude, method) {

	var xmlhttp;

	if (window.XMLHttpRequest) {
		xmlhttp=new XMLHttpRequest(); // code for all modern browsers
	}
	else{
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP"); // code for IE6, IE5
	}

	xmlhttp.open("GET","http://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude, true);

	xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) { // if the response is ready.

			var data = JSON.parse(xmlhttp.responseText);

			var	temperature = null;
			var windSpeed = null;

			if(method == "ip") {

				temperature = document.getElementById("ipTemperature");
				windSpeed = document.getElementById("ipWindSpeed");


			} else if (method == "browser") {

				temperature = document.getElementById("browserTemperature");
				windSpeed = document.getElementById("browserWindSpeed");	

			}

			temperature.textContent = ((parseFloat(data.main.temp) - 273.15) * 1.8000 + 32).toFixed(2);
			windSpeed.textContent = (parseFloat(data.wind.speed) * 2.24).toFixed(2);

		}
	};

	xmlhttp.send();

}
