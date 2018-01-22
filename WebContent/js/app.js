$(document).ready(function() {
	home();
});

function loadTraffic() {
	$("#breadcrumb").empty();
	$("#breadcrumb")
			.append(
					"<a class=\"section\" onclick=\"home()\">Home</a><span class=\"divider\">/</span><a class=\"active section\" onclick=\"loadTraffic()\">Transactions Based</a>");

	$("#main").empty();
	$("#main").load("traffic.html");
	$('body').css('background-color', '#f2f2f2');
	$('#buttonElement').show();
}

function loadPerformance() {
	$("#breadcrumb").empty();
	$("#breadcrumb")
			.append(
					"<a class=\"section\" onclick=\"home()\">Home</a><span class=\"divider\">/</span><a class=\"active section\" onclick=\"loadPerformance()\">Performance Based</a>");

	$("#main").empty();
	$("#main").load("performance.html");
	$('body').css('background-color', '#f2f2f2');
	$('#buttonElement').show();
}

function loadError() {
	$("#breadcrumb").empty();
	$("#breadcrumb")
			.append(
					"<a class=\"section\" onclick=\"home()\">Home</a><span class=\"divider\">/</span><a class=\"active section\" onclick=\"loadError()\">Error Based</a>");

	$("#main").empty();
	$("#main").load("error.html");
	$('body').css('background-color', '#f2f2f2');
	$('#buttonElement').show();
}

function home() {
	$("#breadcrumb").empty();
	$("#breadcrumb").append(
			"<a class=\"active section\" onclick=\"home()\">Home</a>");
	$("#main").empty();
	$("#main").load("home.html");
	$('body').css('background-color', '#ffffff');
	$('#buttonElement').hide();
}