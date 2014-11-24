// when the page finishes the loading, run the following functions.
window.onload = function(){
	navigator.geolocation.getCurrentPosition(getLocationFromBrowser);
	getIpAddress();
};

// get the location using the browser information.

function getLocationFromBrowser(position) {
	
	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;

	var browserLatitude = document.getElementById("browserLatitude");
	var browserLongitude = document.getElementById("browserLongitude");

	browserLatitude.textContent = latitude;
	browserLongitude.textContent = longitude;
	
	getWeatherInformation(latitude, longitude, "browser"); // get weather information.
}

// get the IP address of the client.

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

// get the location of this ip.

function getLocationByIp(ip){
	
	var xmlhttp;

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
			
			getWeatherInformation(data.latitude, data.longitude, "ip");
			
		}
	};
	
	xmlhttp.send();
	
}

// get the weather information base on location.

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
