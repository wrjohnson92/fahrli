document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('#credits').addEventListener('click', BuildGraphCredit);
  document.querySelector('#workunits').addEventListener('click', BuildGraphWorkUnits);  
  document.querySelector('#creditsweekly').addEventListener('click', BuildGraphCreditWeekly);
  document.querySelector('#workunitsweekly').addEventListener('click', BuildGraphWorkUnitsWeekly);
  document.querySelector('#creditsdaily').addEventListener('click', BuildGraphCreditDaily);
  document.querySelector('#workunitsdaily').addEventListener('click', BuildGraphWorkUnitsDaily);  
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

function BuildGraphCreditWeekly() {
	$.getJSON($SCRIPT_ROOT + '/get_data', function(data) {
		let pData = data.map((x) => JSON.parse(x));
		let t = new Date();
  		t.setDate(t.getDate() - t.getDay());
    	t.setHours(0,0,0,0);
    	pData = TrimAndNormalizeData(pData, t);
		let mapData = BuildMapDataCredit(pData);
		BuildGraph(mapData, "Credits");
	});
}

function BuildGraphWorkUnitsWeekly() {
	$.getJSON($SCRIPT_ROOT + '/get_data', function(data) {
		let pData = data.map((x) => JSON.parse(x));
		let t = new Date();
  		t.setDate(t.getDate() - t.getDay());
    	t.setHours(0,0,0,0);
    	pData = TrimAndNormalizeData(pData, t);
		let mapData = BuildMapDataWorkUnits(pData);
		BuildGraph(mapData, "Work Units");
	});
}

function BuildGraphCreditDaily() {
	$.getJSON($SCRIPT_ROOT + '/get_data', function(data) {
		let pData = data.map((x) => JSON.parse(x));
		let t = new Date();
    	t.setHours(0,0,0,0);
    	pData = TrimAndNormalizeData(pData, t);
		let mapData = BuildMapDataCredit(pData);
		BuildGraph(mapData, "Credits");
	});
}

function BuildGraphWorkUnitsDaily() {
	$.getJSON($SCRIPT_ROOT + '/get_data', function(data) {
		let pData = data.map((x) => JSON.parse(x));
		let t = new Date();
    	t.setHours(0,0,0,0);
    	pData = TrimAndNormalizeData(pData, t);
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
							showInLegend: true,
							dataPoints: [] }
		}

		let newDate = new Date(d.DateAdded.year + "-" + d.DateAdded.month + "-" + d.DateAdded.day + " " 
							 + d.DateAdded.hour  + ":" + d.DateAdded.minute  + ":" + d.DateAdded.second + " GMT");

		ret[d.UserId].dataPoints.push({x: newDate, y: d.Credit});
	});

	return Object.keys(ret).map((key) => ret[key]);
}

function BuildMapDataWorkUnits(rawData) {
	let ret = [];

	rawData.forEach((d) => {
		if(ret[d.UserId] == null)
		{
			ret[d.UserId] = { type: "line",
							name: d.UserName,
							markerSize: 5,
							axisYType: "secondary",
							showInLegend: true,
							dataPoints: [] }
		}

		let newDate = new Date(d.DateAdded.year + "-" + d.DateAdded.month + "-" + d.DateAdded.day + " " 
							 + d.DateAdded.hour  + ":" + d.DateAdded.minute  + ":" + d.DateAdded.second + " GMT");

		ret[d.UserId].dataPoints.push({x: newDate, y: d.WorkUnits});
	});

	return Object.keys(ret).map((key) => ret[key]);
}

function TrimAndNormalizeData(data, cutoffDay) {
	var ret = [];
	var lowestEntry = [];
	for(dI in data)
	{
		let d = data[dI];
		let dIDate = new Date(d.DateAdded.year + "-" + d.DateAdded.month + "-" + d.DateAdded.day + " " 
							 + d.DateAdded.hour  + ":" + d.DateAdded.minute  + ":" + d.DateAdded.second + " GMT");
		if(dIDate > cutoffDay)
		{
			ret.push(d);
			if(lowestEntry[d.UserId] == null)
				lowestEntry[d.UserId] = { Credit: d.Credit, WorkUnits: d.WorkUnits }
			else if(lowestEntry[d.UserId].Credit >= d.UserId.Credit && lowestEntry[d.UserId].WorkUnits >= d.UserId.WorkUnits)
				lowestEntry[d.UserId] = { Credit: d.Credit, WorkUnits: d.WorkUnits }
		}
	}

	for(dI in ret)
	{
		ret[dI].Credit -= lowestEntry[ret[dI].UserId].Credit;
		ret[dI].WorkUnits -= lowestEntry[ret[dI].UserId].WorkUnits;
	}

	return ret;
}