//when the page finishes the loading, run the following functions.
window.onload = function(){

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(getLocationFromBrowser);
	} else {
		console.log("Geolocation is not supported by this browser.");
	}

	getIpAddress();
};


//get the location using the browser information.

function getLocationFromBrowser(position) {

	var latitude = parseFloat(position.coords.latitude).toFixed(7);
	var longitude = parseFloat(position.coords.longitude).toFixed(7);

	var browserLatitude = document.getElementById("browserLatitude");
	var browserLongitude = document.getElementById("browserLongitude");

	browserLatitude.textContent = latitude;
	browserLongitude.textContent = longitude;

	getBusStops(latitude, longitude, "browser"); // get bus stop information
	
	haversine();

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
			var latitude = parseFloat(data.latitude).toFixed(7);
			var longitude = parseFloat(data.longitude).toFixed(7);

			var ipLatitude = document.getElementById("ipLatitude");
			var ipLongitude = document.getElementById("ipLongitude");

			ipLatitude.textContent = latitude;
			ipLongitude.textContent = longitude;

			getBusStops(latitude, longitude, "ip");  // get bus stop information
			
			haversine();

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



//get nearby busstops for using the IP and browser information

function getBusStops(latitude, longitude, method) {

	// to avoid the Cross-Origin Request Blocked

	$.ajax({
		type: 'GET',
		url: "http://api.smsmybus.com/v1/getnearbystops?key=uwcompsci&lat=" + latitude + "&lon=" + longitude + "&radius=300",
		//url: "http://api.smsmybus.com/v1/getnearbystops?key=uwcompsci&lat=43.043947&lon=-89.3562395&radius=300",
		dataType: 'jsonp',
		success: function(data) {		

			if(data.stop.length != 0) { //  bus stop found

				if(method == "ip") {

					var divBus = document.getElementById("ipBusStops");
					var waiting = document.getElementById("ipWaitingBusStops");
					divBus.removeChild(waiting);
					

					for(var i = 0; i < data.stop.length; i++) {

						var stopId = document.createElement('P');
						var stopIntersection = document.createElement('P');
						var stopLatitude = document.createElement('P');
						var stopLongitude = document.createElement('P');
						

						stopId.textContent = "ID: " + data.stop[i].stopID;
						stopIntersection.textContent = "Intersection: " +  data.stop[i].intersection;
						stopLatitude.textContent = "Latidtude: " + data.stop[i].latitude;
						stopLongitude.textContent = "Longitude: " +data.stop[i].longitude;

						divBus.appendChild(stopId);
						divBus.appendChild(stopIntersection);
						divBus.appendChild(stopLatitude);
						divBus.appendChild(stopLongitude);
						divBus.appendChild(document.createElement('BR'));

					}

				}else if (method == "browser") {

					var divBus = document.getElementById("browserBusStops");
					var waiting = document.getElementById("browserWaitingBusStops");
					divBus.removeChild(waiting);
					
					for(var i = 0; i < data.stop.length; i++) {

						var stopId = document.createElement('P');
						var stopIntersection = document.createElement('P');
						var stopLatitude = document.createElement('P');
						var stopLongitude = document.createElement('P');


						stopId.textContent = "ID: " + data.stop[i].stopID;
						stopIntersection.textContent = "Intersection: " +  data.stop[i].intersection;
						stopLatitude.textContent = "Latidtude: " + data.stop[i].latitude;
						stopLongitude.textContent = "Longitude: " +data.stop[i].longitude;
						
						divBus.appendChild(stopId);
						divBus.appendChild(stopIntersection);
						divBus.appendChild(stopLatitude);
						divBus.appendChild(stopLongitude);
						divBus.appendChild(document.createElement('BR'));

					}
				}
			}else {

				var errorMessage = document.createElement('P');
				errorMessage.textContent = "No bus stop found in the radius of 300 ft.";

				if(method == "ip"){

					var divBus = document.getElementById("ipBusStops");
					divBus.appendChild(errorMessage);


				} else if (method == "browser") {
					var divBus = document.getElementById("browserBusStops");
					divBus.appendChild(errorMessage);

				}


			}
		}

	});

}

// snipet

/** Converts numeric degrees to radians */
if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  };
}

// calculate the distance between the two locations found by the application

function haversine(){
	
	
	var latitude1 = parseFloat(document.getElementById("ipLatitude").textContent);
	var longitude1 = parseFloat(document.getElementById("ipLongitude").textContent);
	var latitude2 = parseFloat(document.getElementById("browserLatitude").textContent);
	var longitude2 = parseFloat(document.getElementById("browserLongitude").textContent);
	
	console.log(latitude1);
	console.log(longitude1);
	console.log(latitude2);
	console.log(longitude2);
	
	
	if(isNaN(latitude1) || isNaN(longitude1) || isNaN(latitude2) || isNaN(longitude2)){ // do nothing
		
		console.log("Same value if invalid.");
	
	} else {
	
		var R = 6371; // km
		
		var fi1 = latitude1.toRad();
		var fi2 = latitude2.toRad();
		var dfi = (latitude2-latitude1).toRad();
		var dlamb = (longitude2-longitude1).toRad();
	
		var a = Math.sin(dfi/2) * Math.sin(dfi/2) + Math.cos(fi1) * Math.cos(fi2) * Math.sin(dlamb/2) * Math.sin(dlamb/2);
		
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	
		var d = R * c; // d = distance between the two points
		
		var resultDistance = document.getElementById("resultDistance");
		
		console.log(d);
		
		resultDistance.textContent = "" + (d/1.6).toFixed(3) + " miles";
	}
}
