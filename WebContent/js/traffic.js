var lineWs;

var lineAxisData = [];
var lineData = [];

drawLineChart();
drawPieChart();

function drawLineChart() {

	while (lineData.length < 60) {
		lineData.push(0);
		lineAxisData.push(new Date().getTime());
	}

	lineAxisData.unshift('x');
	lineData.unshift('count');

	var chart = c3.generate({
		size : {
			height : 240,
			width : 1000
		},
		x : 'x',
		bindto : '#line',
		data : {
			columns : [ lineData ],
			types : {
				count : 'area'
			}
		}
	});

	chart.load({
		columns : [ lineData ]
	});

	if (lineWs == undefined || lineWs.readyState == WebSocket.CLOSED) {
		if (location.protocol == "http:")
			lineWs = new WebSocket("ws://" + location.host
					+ "/dashboard/stream");
		else if (location.protocol == "https:")
			lineWs = new WebSocket("wss://" + location.host
					+ "/dashboard/stream");
	}

	lineWs.onopen = function() {
		lineWs.send("line");
	};

	lineWs.onmessage = function(msg) {

		lineData.push(JSON.parse(msg.data).y);
		lineAxisData.push(JSON.parse(msg.data).x);

		if (lineData.length > 61) {
			lineData.shift();
			lineData.shift();
			lineData.unshift('count');
			lineAxisData.shift();
			lineAxisData.shift();
			lineAxisData.unshift('x');
		}
		chart.load({
			columns : [ lineData ]
		});
	};

}

function drawPieChart() {
	var chart = c3.generate({
		bindto : '#pie',
		data : {
			columns : [ [ 'success', 30 ], [ 'failure', 120 ], ],
			type : 'pie'
		}
	});
}