var totalWs;
var metricWs;
var clientWs;

var totalData = [ [] ];
var clientData = [ [ 'data1', 30 ], [ 'data2', 120 ] ];
var totalAxisData;

overviewChart();
total();
drawclientChart();

function total() {

	if (metricWs == undefined || metricWs.readyState == WebSocket.CLOSED) {
		if (location.protocol == "http:")
			metricWs = new WebSocket("ws://" + location.host
					+ "/dashboard/dashboard");
		else if (location.protocol == "https:")
			metricWs = new WebSocket("wss://" + location.host
					+ "/dashboard/dashboard");
	}

	metricWs.onopen = function() {
		metricWs.send("total");
	};

	metricWs.onmessage = function(msg) {
		$('#total').text(msg.data);
	};
}

function drawclientChart() {

	var chart = c3.generate({
		bindto : '#client',
		data : {
			columns : clientData,
			type : 'donut'
		},
		legend : {
			position : 'right'
		}
	});

	if (clientWs == undefined
			|| clientWs.readyState == WebSocket.CLOSED) {
		if (location.protocol == "http:")
			clientWs = new WebSocket("ws://" + location.host
					+ "/dashboard/dashboard");
		else if (location.protocol == "https:")
			clientWs = new WebSocket("wss://" + location.host
					+ "/dashboard/dashboard");
	}

	clientWs.onopen = function() {
		clientWs.send("client");
	};

	clientWs.onmessage = function(msg) {

		clientData = JSON.parse(msg.data);

		chart.load({
			columns : clientData
		});
	};
}

function overviewChart() {
	while (totalData[0].length < 60) {
		totalData[0].push(null);
		/* totalAxisData[0].push(new Date().getTime()); */
	}
	totalData[0].unshift('count');

	var chart = c3.generate({
		bindto : '#totalOverview',
		data : {
			columns : totalData,
			types : {
				count : 'bar',
			}
		}
	});

	if (totalWs == undefined || totalWs.readyState == WebSocket.CLOSED) {
		if (location.protocol == "http:")
			totalWs = new WebSocket("ws://" + location.host
					+ "/dashboard/dashboard");
		else if (location.protocol == "https:")
			totalWs = new WebSocket("wss://" + location.host
					+ "/dashboard/dashboard");
	}

	totalWs.onopen = function() {
		totalWs.send("histogram");
	};

	totalWs.onmessage = function(msg) {

		totalData[0].push(JSON.parse(msg.data).count.y);

		if (totalData[0].length > 61) {
			totalData[0].shift();
			totalData[0].shift();
			totalData[0].unshift('count');
			/*
			 * totalAxisData[0].shift(); totalAxisData[0].shift();
			 * totalAxisData[0].unshift('x');
			 */
		}
		chart.load({
			columns : totalData
		});
	};
}