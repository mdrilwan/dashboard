var barWs;
var metricWs;
var gaugeWs;

var barAxisData = [];
var barData = [ 30, 200, 100, 400, 150, 250 ];
var gaugeData = [ 91.4 ];

total();
drawGaugeChart();
drawBarChart();

function total() {
	$('#total').text('434');

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