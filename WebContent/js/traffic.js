var requestCountWs;
var successFailureWs;
var lineWs;

var successFailureData = [ 30, 200, 100, 400, 150, 250 ];
var requestCountData = [ [ 'data1', 30 ], [ 'data2', 120 ] ];
var lineData = [ [ ], [ ] ];
var lineAxisData;

drawrequestCountChart();
drawsuccessFailureChart();
drawLineChart();

function drawrequestCountChart() {

	var chart = c3.generate({
		bindto : '#requestCount',
		data : {
			columns : requestCountData,
			type : 'pie'
		},
		legend : {
			position : 'right'
		}
	});

	if (requestCountWs == undefined
			|| requestCountWs.readyState == WebSocket.CLOSED) {
		if (location.protocol == "http:")
			requestCountWs = new WebSocket("ws://" + location.host
					+ "/dashboard/tansactionsStream");
		else if (location.protocol == "https:")
			requestCountWs = new WebSocket("wss://" + location.host
					+ "/dashboard/tansactionsStream");
	}

	requestCountWs.onopen = function() {
		requestCountWs.send("requestCount");
	};

	requestCountWs.onmessage = function(msg) {

		requestCountData = JSON.parse(msg.data);

		chart.load({
			columns : requestCountData
		});
	};
}

function drawsuccessFailureChart() {

	var chart = c3.generate({
		bindto : '#sucessFailure',
		data : {
			columns : successFailureData,
			type : 'pie'
		},
		legend : {
			position : 'right'
		}
	});

	if (successFailureWs == undefined
			|| successFailureWs.readyState == WebSocket.CLOSED) {
		if (location.protocol == "http:")
			successFailureWs = new WebSocket("ws://" + location.host
					+ "/dashboard/tansactionsStream");
		else if (location.protocol == "https:")
			successFailureWs = new WebSocket("wss://" + location.host
					+ "/dashboard/tansactionsStream");
	}

	successFailureWs.onopen = function() {
		successFailureWs.send("successFailure");
	};

	successFailureWs.onmessage = function(msg) {

		successFailureData = JSON.parse(msg.data);

		chart.load({
			columns : successFailureData
		});
	};
}

function drawLineChart() {

	while (lineData[0].length < 60) {
		lineData[0].push(null);
		/* lineAxisData[0].push(new Date().getTime()); */
	}
	lineData[0].unshift('success');

	while (lineData[1].length < 60) {
		lineData[1].push(null);
		/* lineAxisData[1].push(new Date().getTime()); */
	}
	lineData[1].unshift('failure');

	var chart = c3.generate({
		bindto : '#line',
		data : {
			columns : lineData,
			types : {
				success : 'area',
				failure : 'area'
			}
		}
	});

	if (lineWs == undefined || lineWs.readyState == WebSocket.CLOSED) {
		if (location.protocol == "http:")
			lineWs = new WebSocket("ws://" + location.host
					+ "/dashboard/tansactionsStream");
		else if (location.protocol == "https:")
			lineWs = new WebSocket("wss://" + location.host
					+ "/dashboard/tansactionsStream");
	}

	lineWs.onopen = function() {
		lineWs.send("line");
	};

	lineWs.onmessage = function(msg) {

		lineData[0].push(JSON.parse(msg.data).success.y);
		lineData[1].push(JSON.parse(msg.data).failure.y);

		if (lineData[0].length > 61) {
			lineData[0].shift();
			lineData[0].shift();
			lineData[0].unshift('success');
			/*
			 * lineAxisData[0].shift(); lineAxisData[0].shift();
			 * lineAxisData[0].unshift('x');
			 */
		}
		if (lineData[1].length > 61) {
			lineData[1].shift();
			lineData[1].shift();
			lineData[1].unshift('failure');
			/*
			 * lineAxisData[1].shift(); lineAxisData[1].shift();
			 * lineAxisData[1].unshift('x');
			 */
		}
		chart.load({
			columns : lineData
		});
	};
}