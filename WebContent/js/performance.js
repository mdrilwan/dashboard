var avgWs;
var donutWs;
var horizontalBarWs;

var barAxisData = [];
var horizontalBarData = [ [ 'x', 'data1', 'data2' ], [ 'count', 300, 400 ] ];
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

		for(var i=0;i<donutData.length;i++) {
			for(var j=0;j<donutData[i].length;j++)
				donutData[i].shift();
		}

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
			columns : horizontalBarData,
			type : 'bar',
			axes : {
				count : 'y2'
			}
		},
		legend : {
			position : 'right'
		},
		axis : {
			rotated : true,
			x : {
				type : 'category'
			},
			y : {
				show : false
			},
			y2 : {
				show : true
			}
		}
	});

	if (horizontalBarWs == undefined
			|| horizontalBarWs.readyState == WebSocket.CLOSED) {
		if (location.protocol == "http:")
			horizontalBarWs = new WebSocket("ws://" + location.host
					+ "/dashboard/performanceStream");
		else if (location.protocol == "https:")
			horizontalBarWs = new WebSocket("wss://" + location.host
					+ "/dashboard/performanceStream");
	}

	horizontalBarWs.onopen = function() {
		horizontalBarWs.send("horizontalbar");
	};

	horizontalBarWs.onmessage = function(msg) {

		horizontalBarData[1] = [];
		horizontalBarData[0] = [];

		for (var i = 1; i <= 10; i++) {

			horizontalBarData[1].push(JSON.parse(msg.data)[i - 1].value);
			horizontalBarData[0].push(JSON.parse(msg.data)[i - 1].x);
		}

		horizontalBarData[1].unshift('count');
		horizontalBarData[0].unshift('x');

		chart.load({
			columns : horizontalBarData
		});
	};

}