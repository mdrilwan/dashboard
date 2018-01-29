var errorPercentWs;
var reqErrorWs;
var locErrorWs;

var errorPercentData = 91;
var reqErrorData = [ [ 'x', 'data1', 'data2' ], [ 'count', 300, 400 ] ];
var locErrorData = [ [ 'data1', 30 ], [ 'data2', 50 ] ];

drawerrorPercent();
drawreqError();
drawlocError();

function drawerrorPercent() {
	var chart = c3.generate({
		bindto : '#errorPercent',
		data : {
			columns : [ [ 'data', errorPercentData ] ],
			type : 'gauge'
		},
		color : {
			pattern : [ '#FF0000', '#F97600', '#F6C600', '#60B044' ],
			threshold : {
				values : [ 30, 60, 90, 100 ]
			}
		}
	});

	if (errorPercentWs == undefined
			|| errorPercentWs.readyState == WebSocket.CLOSED) {
		if (location.protocol == "http:")
			errorPercentWs = new WebSocket("ws://" + location.host
					+ "/dashboard/errorStream");
		else if (location.protocol == "https:")
			errorPercentWs = new WebSocket("wss://" + location.host
					+ "/dashboard/errorStream");
	}

	errorPercentWs.onopen = function() {
		errorPercentWs.send("errorPercent");
	};

	errorPercentWs.onmessage = function(msg) {
		errorPercentData = msg.data;

		chart.load({
			columns : [ [ 'data', errorPercentData ] ]
		});
	};
}

function drawreqError() {
	var chart = c3.generate({
		bindto : '#reqError',
		data : {
			x : 'x',
			columns : reqErrorData,
			type : 'bar'
		},
		legend : {
			position : 'right'
		},
		axis : {
			x : {
				type : 'category'
			}
		}
	});

	if (reqErrorWs == undefined || reqErrorWs.readyState == WebSocket.CLOSED) {
		if (location.protocol == "http:")
			reqErrorWs = new WebSocket("ws://" + location.host
					+ "/dashboard/errorStream");
		else if (location.protocol == "https:")
			reqErrorWs = new WebSocket("wss://" + location.host
					+ "/dashboard/errorStream");
	}

	reqErrorWs.onopen = function() {
		reqErrorWs.send("reqError");
	};

	reqErrorWs.onmessage = function(msg) {
		reqErrorData = [ JSON.parse(msg.data).keys, JSON.parse(msg.data).data ];

		reqErrorData[0].unshift('x');
		reqErrorData[1].unshift('count');

		chart.load({
			columns : reqErrorData
		});
	};
}

function drawlocError() {

	for (var i = 0; i < locErrorData.length; i++) {
		while (locErrorData[i].length < 61) {
			locErrorData[i].push(null);
		}
	}

	var chart = c3.generate({
		bindto : '#locationErrorRatio',
		data : {
			columns : locErrorData,
			type : 'bar',
			groups : [['data1', 'data2']]
		},
		legend : {
			position : 'right'
		}
	});

	if (locErrorWs == undefined || locErrorWs.readyState == WebSocket.CLOSED) {
		if (location.protocol == "http:")
			locErrorWs = new WebSocket("ws://" + location.host
					+ "/dashboard/errorStream");
		else if (location.protocol == "https:")
			locErrorWs = new WebSocket("wss://" + location.host
					+ "/dashboard/errorStream");
	}

	locErrorWs.onopen = function() {
		locErrorWs.send("locError");
	};

	locErrorWs.onmessage = function(msg) {
		var receivedData = JSON.parse(msg.data);
		var groups = [];

		for (var i = 0; i < receivedData.length; i++) {
			if (!locErrorData[i])
				locErrorData[i] = [];
			while (locErrorData[i].length < 60) {
				locErrorData[i].push(null);
			}
			for (var j = 1; j < receivedData[i].length; j++) {
				locErrorData[i].push(receivedData[i][j]);
				if (locErrorData[i].length > 61) {
					locErrorData[i].shift();
					locErrorData[i].shift();
				}
			}
			locErrorData[i].unshift(receivedData[i][0]);
			groups.push(receivedData[i][0]);
		}
		chart.load({
			columns : locErrorData
		});
		chart.groups([ groups ]);
	};
}