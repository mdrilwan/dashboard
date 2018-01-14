var avgWs;
var donutWs;
var barWs;

var barAxisData = [];
var barData = [
		[ 'x', 'data1', 'data2' ], [ 'count', 300, 400 ] ];
var donutData = [ [ 'less than 2s', 30 ], [ 'between 2s and 5s', 120 ],
		[ 'more than 5s', 20 ] ];

avg();
drawDonutChart();
drawBarChart();

function avg() {

	if (avgWs == undefined || avgWs.readyState == WebSocket.CLOSED) {
		if (location.protocol == "http:")
			avgWs = new WebSocket("ws://" + location.host
					+ "/dashboard/performanceStream");
		else if (location.protocol == "https:")
			avgWs = new WebSocket("wss://" + location.host
					+ "/dashboard/performanceStream");
	}

	avgWs.onopen = function() {
		avgWs.send("avg");
	};

	avgWs.onmessage = function(msg) {
		$('#avg').text(msg.data);
	};
}

function drawDonutChart() {

	var chart = c3.generate({
		bindto : '#donut',
		data : {
			columns : donutData,
			type : 'donut'
		},
		legend : {
			position : 'right'
		}
	});

	if (donutWs == undefined || donutWs.readyState == WebSocket.CLOSED) {
		if (location.protocol == "http:")
			donutWs = new WebSocket("ws://" + location.host
					+ "/dashboard/performanceStream");
		else if (location.protocol == "https:")
			donutWs = new WebSocket("wss://" + location.host
					+ "/dashboard/performanceStream");
	}

	donutWs.onopen = function() {
		donutWs.send("donut");
	};

	donutWs.onmessage = function(msg) {
		donutData[0].shift();
		donutData[0].shift();
		donutData[1].shift();
		donutData[1].shift();
		donutData[2].shift();
		donutData[2].shift();

		donutData[0].push(JSON.parse(msg.data).less.value);
		donutData[1].push(JSON.parse(msg.data).between.value);
		donutData[2].push(JSON.parse(msg.data).more.value);

		donutData[0].unshift('less than 2s');
		donutData[1].unshift('between 2s and 5s');
		donutData[2].unshift('more than 5s');

		chart.load({
			columns : donutData
		});
	};
}

function drawBarChart() {

	var chart = c3.generate({
		bindto : '#horizontalbar',
		data : {
			x : 'x',
			columns : barData,
			type : 'bar'
		},
		axis : {
			rotated : true,
			x : {
				type : 'category'
			}
		}
	});

	if (barWs == undefined || barWs.readyState == WebSocket.CLOSED) {
		if (location.protocol == "http:")
			barWs = new WebSocket("ws://" + location.host
					+ "/dashboard/performanceStream");
		else if (location.protocol == "https:")
			barWs = new WebSocket("wss://" + location.host
					+ "/dashboard/performanceStream");
	}

	barWs.onopen = function() {
		barWs.send("horizontalbar");
	};

	barWs.onmessage = function(msg) {

		for(var i=0;i<barData[1].length;i++)
			barData[1].shift();

		for(var i=0;i<barData[0].length;i++)
			barData[0].shift();

		for(var i=1;i<=10;i++) {
			var key = "data" + i;
			barData[1].push(JSON.parse(msg.data)[i-1].value);
			barData[0].push(JSON.parse(msg.data)[i-1].x);
		}

		barData[1].unshift('count');
		barData[0].unshift('x');

		chart.load({
			columns : barData
		});
	};

}