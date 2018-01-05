var pieWs;
var barWs;
var lineWs;

var pieData = [ {
	"assetInstName" : "CustomerOrderFeasibility_1.0",
	"count" : "1"
}, {
	"assetInstName" : "CustomerOrderFeasibility_V2_2.0",
	"count" : "15"
} ];

var myData = [ {
	"key" : "Tweets",
	"values" : [ {} ],
	area : true
} ];

var data = [ {
	"key" : "Horizontal Bar",
	"values" : []
} ];

var values = [ {
	"label" : "Group A",
	"value" : 1.8746444827653
}, {
	"label" : "Group B",
	"value" : 8.0961543492239
}, {
	"label" : "Group C",
	"value" : 0.57072943117674
}, {
	"label" : "Group D",
	"value" : 2.4174010336624
}, {
	"label" : "Group E",
	"value" : 0.72009071426284
} ];

/*
 * values.sort(function(a, b) { return b.value - a.value; });
 */

data[0].values = values;

drawLineChart();
drawPieChart();
drawBarChart();

/*
 * function closeAllSocket() { if (!(pieWs == undefined || pieWs.readyState ==
 * WebSocket.CLOSED)) { pieWs.close(); } if (!(barWs == undefined ||
 * barWs.readyState == WebSocket.CLOSED)) { barWs.close(); } if (!(lineWs ==
 * undefined || lineWs.readyState == WebSocket.CLOSED)) { lineWs.close(); } }
 */

function drawPieChart() {

	nv
			.addGraph(function() {

				var chart = nv.models.pieChart().x(function(d) {
					return d.assetInstName
				}).y(function(d) {
					return d.count
				})
				// .legendPosition("right")
				.showLegend(false).showLabels(false);

				d3.select("#pie").datum(pieData).transition().duration(350)
						.call(chart);

				if (pieWs == undefined || pieWs.readyState == WebSocket.CLOSED) {
					if (location.protocol == "http:")
						pieWs = new WebSocket("ws://" + location.host
								+ "/dashboard/stream");
					else if (location.protocol == "https:")
						pieWs = new WebSocket("wss://" + location.host
								+ "/dashboard/stream");
				}

				pieWs.onopen = function() {
					pieWs.send("pie");
				};

				pieWs.onmessage = function(msg) {

					var data = JSON.parse(msg.data);

					var noOfShifts = pieData.length;
					for (var i = 0; i < noOfShifts; i++) {
						pieData.shift();
					}
					for (var i = 0; i < data.length; i++) {
						pieData.push(data[i]);
					}

					chart.update();
				};

				pieWs.onclose = function(error) {

				};

				return chart;
			});
}

function drawLineChart() {

	nv.addGraph(function() {
		var chart = nv.models.lineChart().margin({
			left : 100
		}) // Adjust chart margins to give the x-axis some breathing room.
		.useInteractiveGuideline(true) // We want nice looking tooltips and a
		// guideline!
		.showLegend(true) // Show the legend, allowing users to turn on/off
		// line series.
		.showYAxis(true) // Show the y-axis
		.showXAxis(true);

		chart.xAxis // Chart x-axis settings
		.axisLabel('Time (ms)').rotateLabels(-45).tickFormat(function(d) {
			return d3.time.format("%H:%M:%S")(new Date(d));
		});

		chart.yAxis // Chart y-axis settings
		.axisLabel('Count').tickFormat(d3.format('.f'));

		d3.select('#line') // Select the <svg> element you want to
		// render the chart in.
		.datum(myData) // Populate the <svg> element with chart data...
		.call(chart); // Finally, render the chart!

		var flag = true;

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

			if (flag) {

				var startTime = JSON.parse(msg.data).x - 60000;

				for (var i = 0; i < 60; i++) {
					myData[0].values.push(JSON.parse("{\"x\":" + startTime
							+ " }"));
					startTime += 1000;
				}

				myData[0].values.shift();
				flag = false;
			}

			myData[0].values.push(JSON.parse(msg.data));

			if (myData[0].values.length > 60)
				myData[0].values.shift();

			chart.update();
		};

		lineWs.onclose = function(error) {

		};

		// Update the chart when window resizes.
		nv.utils.windowResize(function() {
			chart.update();
		});
		return chart;
	});
}

function drawBarChart() {

	nv.addGraph(function() {
		var chart = nv.models.multiBarHorizontalChart().x(function(d) {
			return d.label
		}).y(function(d) {
			return d.value
		}).margin({
			top : 30,
			right : 20,
			bottom : 50,
			left : 175
		}).showValues(true) // Show bar value next to each bar.
		.tooltips(true); // Show tooltips on hover.

		chart.multibar.stacked(true);
		chart.showControls(false);

		d3.select('#bar').datum(data).call(chart);

		if (barWs == undefined || barWs.readyState == WebSocket.CLOSED) {
			if (location.protocol == "http:")
				barWs = new WebSocket("ws://" + location.host
						+ "/dashboard/stream");
			else if (location.protocol == "https:")
				barWs = new WebSocket("wss://" + location.host
						+ "/dashboard/stream");
		}

		barWs.onopen = function() {
			barWs.send("bar");
		};

		barWs.onmessage = function(msg) {

			var barData = JSON.parse(msg.data);

			var noOfShifts = data[0].values.length;
			for (var i = 0; i < noOfShifts; i++) {
				data[0].values.shift();
			}

			/*
			 * barData.sort(function(a, b) { return b.value - a.value; });
			 */

			for (var i = 0; i < barData.length; i++) {
				data[0].values.push(barData[i]);
			}

			chart.update();
		};

		barWs.onclose = function(error) {

		};

		nv.utils.windowResize(chart.update);

		return chart;
	});
}