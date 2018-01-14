$(document).ready(function() {
	$('.accordion').accordion();
	$('.ui.sidebar').sidebar('show');
	home();
});

function loadTraffic() {
	$("#breadcrumb").empty();
	$("#breadcrumb")
			.append(
					"<a class=\"section\" onclick=\"home()\">Home</a><span class=\"divider\">/</span><a class=\"active section\" onclick=\"loadTraffic()\">Transactions Based</a>");

	$("#main").empty();
	$("#main").load("traffic.html");
}

function loadPerformance() {
	$("#breadcrumb").empty();
	$("#breadcrumb")
			.append(
					"<a class=\"section\" onclick=\"home()\">Home</a><span class=\"divider\">/</span><a class=\"active section\" onclick=\"loadPerformance()\">Performance Based</a>");

	$("#main").empty();
	$("#main").load("performance.html");
}

function loadError() {
	$("#breadcrumb").empty();
	$("#breadcrumb")
			.append(
					"<a class=\"section\" onclick=\"home()\">Home</a><span class=\"divider\">/</span><a class=\"active section\" onclick=\"loadError()\">Error Based</a>");

	$("#main").empty();
	$("#main").load("error.html");
}

function home() {
	$("#breadcrumb").empty();
	$("#breadcrumb").append(
			"<a class=\"active section\" onclick=\"home()\">Home</a>");
	$("#main").empty();
	$("#main").load("home.html");
}