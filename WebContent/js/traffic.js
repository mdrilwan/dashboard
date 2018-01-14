var barWs;
var metricWs;
var gaugeWs;
var lineWs;

var barAxisData = [];
var barData = [ 30, 200, 100, 400, 150, 250 ];
var gaugeData = [ 91.4 ];
var lineData = [ [ 300, 350, 300, 0, 0, 0 ], [ 130, 100, 140, 200, 150, 50 ] ];
var lineAxisData;

total();
drawGaugeChart();
drawBarChart();
drawLineChart();

function total() {

	if (metricWs == undefined || metricWs.readyState == WebSocket.CLOSED) {
		if (location.protocol == "http:")
			metricWs = new WebSocket("ws://" + location.host
					+ "/dashboard/tansactionsStream");
		else if (location.protocol == "https:")
			metricWs = new WebSocket("wss://" + location.host
					+ "/dashboard/tansactionsStream");
	}

	metricWs.onopen = function() {
		metricWs.send("total");
	};

	metricWs.onmessage = function(msg) {
		$('#total').text(msg.data);
	};
}

function drawGaugeChart() {

	gaugeData.unshift('data');

	var chart = c3.generate({
		bindto : '#gauge',
		data : {
			columns : [ gaugeData ],
			type : 'gauge'
		},
		gauge : {
			label : {
				format : function(value, ratio) {
					return value;
				},
				show : false
			},
		}
	});

	if (gaugeWs == undefined || gaugeWs.readyState == WebSocket.CLOSED) {
		if (location.protocol == "http:")
			gaugeWs = new WebSocket("ws://" + location.host
					+ "/dashboard/tansactionsStream");
		else if (location.protocol == "https:")
			gaugeWs = new WebSocket("wss://" + location.host
					+ "/dashboard/tansactionsStream");
	}

	gaugeWs.onopen = function() {
		gaugeWs.send("gauge");
	};

	gaugeWs.onmessage = function(msg) {
		gaugeData.shift();
		gaugeData.shift();
		gaugeData.push(JSON.parse(msg.data).value);
		gaugeData.unshift('data');

		chart.load({
			columns : [ gaugeData ]
		});
	};
}

function drawBarChart() {

	while (barData.length < 60) {
		barData.push(0);
		/* barAxisData.push(new Date().getTime()); */
	}

	// barAxisData.unshift('x');
	barData.unshift('count');

	var chart = c3.generate({
		bindto : '#bar',
		data : {
			columns : [ [ barData ] ],
			type : 'bar'
		}
	});

	chart.load({
		columns : [ barData ]
	});

	if (barWs == undefined || barWs.readyState == WebSocket.CLOSED) {
		if (location.protocol == "http:")
			barWs = new WebSocket("ws://" + location.host
					+ "/dashboard/tansactionsStream");
		else if (location.protocol == "https:")
			barWs = new WebSocket("wss://" + location.host
					+ "/dashboard/tansactionsStream");
	}

	barWs.onopen = function() {
		barWs.send("bar");
	};

	barWs.onmessage = function(msg) {

		barData.push(JSON.parse(msg.data).value);

		if (barData.length > 61) {
			barData.shift();
			barData.shift();
			barData.unshift('count');
			/*
			 * barAxisData.shift(); barAxisData.shift();
			 * barAxisData.unshift('x');
			 */
		}
		chart.load({
			columns : [ barData ]
		});
	};
}

function drawLineChart() {

	while (lineData[0].length < 60) {
		lineData[0].push(0);
		/* lineAxisData[0].push(new Date().getTime()); */
	}
	lineData[0].unshift('success');

	while (lineData[1].length < 60) {
		lineData[1].push(0);
		/* lineAxisData[1].push(new Date().getTime()); */
	}
	lineData[1].unshift('failure');

	var chart = c3.generate({
		bindto: '#line',
	    data: {
	        columns: lineData,
	        types: {
	            success: 'area',
	            failure: 'area'
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