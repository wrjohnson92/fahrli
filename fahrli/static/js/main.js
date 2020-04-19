document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('#credits').addEventListener('click', BuildGraphCredit);
  document.querySelector('#workunits').addEventListener('click', BuildGraphWorkUnits);
});

window.onload = function () {
	BuildGraphCredit();
}

function BuildGraphCredit() {
	$.getJSON($SCRIPT_ROOT + '/get_data', function(data) {
		let pData = data.map((x) => JSON.parse(x));
		let mapData = BuildMapDataCredit(pData);
		BuildGraph(mapData, "Credits");
	});
}

function BuildGraphWorkUnits() {
	$.getJSON($SCRIPT_ROOT + '/get_data', function(data) {
		let pData = data.map((x) => JSON.parse(x));
		let mapData = BuildMapDataWorkUnits(pData);
		BuildGraph(mapData, "Work Units");
	});
}

function BuildGraph(mapData, axisLabel) {
    let chart = new CanvasJS.Chart("chartContainer", {
		animationEnabled: true,
		title:{
			text: "Folding @ WFH Stats"  
		},
		axisX: {
			lineColor: "black",
			labelFontColor: "black"
		},
		axisY2: {
	      	gridThickness: 1,
			title: axisLabel,
			titleFontColor: "black",
			labelFontColor: "black"
		},
		legend: {
			cursor: "pointer",
			itemmouseover: function(e) {
				e.dataSeries.lineThickness = e.chart.data[e.dataSeriesIndex].lineThickness * 2;
				e.dataSeries.markerSize = e.chart.data[e.dataSeriesIndex].markerSize + 2;
				e.chart.render();
			},
			itemmouseout: function(e) {
				e.dataSeries.lineThickness = e.chart.data[e.dataSeriesIndex].lineThickness / 2;
				e.dataSeries.markerSize = e.chart.data[e.dataSeriesIndex].markerSize - 2;
				e.chart.render();
			},
			itemclick: function (e) {
				if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
					e.dataSeries.visible = false;
				} else {
					e.dataSeries.visible = true;
				}
				e.chart.render();
			}
		},
		toolTip: {
			shared: true
		},
		data: mapData
      });

	chart.render();
}

function BuildMapDataCredit(rawData) {
	let ret = [];

	rawData.forEach((d) => {
		if(ret[d.UserId] == null)
		{
			ret[d.UserId] = { type: "line",
							name: d.UserName,
							markerSize: 5,
							axisYType: "secondary",
							//xValueFormatString: "YYYY",
							//yValueFormatString: "#,##0.0\"%\"",
							showInLegend: true,
							dataPoints: [] }
		}

		let newDate = new Date(d.DateAdded.year + "-" + d.DateAdded.month + "-" + d.DateAdded.day + " " 
							 + d.DateAdded.hour  + ":" + d.DateAdded.minute  + ":" + d.DateAdded.second + " GMT");

		ret[d.UserId].dataPoints.push({x: newDate, y: d.WorkUnits});
	});

	return Object.keys(ret).map((key) => ret[key]);
}

function BuildMapDataWorkUnits(rawData) {
	let ret = [];

	rawData.forEach((d) => {
		if(ret[d.UserId] == null)
		{
			ret[d.UserId] = { type: "spline",
							name: d.UserName,
							markerSize: 5,
							axisYType: "secondary",
							//xValueFormatString: "YYYY",
							//yValueFormatString: "#,##0.0\"%\"",
							showInLegend: true,
							dataPoints: [] }
		}

		let newDate = new Date(d.DateAdded.year + "-" + d.DateAdded.month + "-" + d.DateAdded.day + " " 
							 + d.DateAdded.hour  + ":" + d.DateAdded.minute  + ":" + d.DateAdded.second + " GMT");

		ret[d.UserId].dataPoints.push({x: newDate, y: d.WorkUnits});
	});

	return Object.keys(ret).map((key) => ret[key]);
}