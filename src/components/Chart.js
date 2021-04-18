export let planetChartData = {
  type: 'line',
  data: {
    labels: [ ],
    datasets: [
      {
        label: 'Currency',
        data: [],
        pointRadius: [7],
        pointBackgroundColor: "rgb(129 195 226)",
        backgroundColor: [],
        borderColor: [
          "rgb(129 195 226)"
        ],
        borderWidth: 3
      },
      {
        label: 'Max',
        data: [],
        backgroundColor: ["rgba(255, 255, 255, 0)"],
        borderColor: [
          "#00FF3380"
        ],
        borderWidth: 1
      },
      {
        label: 'Min',
        data: [],
        backgroundColor: ["rgba(255, 255, 255, 0)"],
        borderColor: [
          "#FF000080"
        ],
        borderWidth: 1
      },
      
    ],
  },
  options: {
    layout: {
      padding: {
          top: 50,
          bottom: 50,
          right: 120
      }
    },
    plugins: {
      datalabels: {
        display: function (context) {
          return (context.dataIndex === context.dataset.data.length - 1); 
        },
        color: function (context) {
            if (context.datasetIndex === 2) return "#FF0000";
            else if (context.datasetIndex === 1) return "#00FF33";
            else return "#FFFFFF";
        },
        borderColor: function (context) {
          if (context.datasetIndex === 2) return "#FF0000";
          else if (context.datasetIndex === 1) return "#00FF33";
          else return "#FFFFFF";
        },
        offset: function (context) {
          if (context.datasetIndex === 2 || context.datasetIndex === 1) return 22;
          else return 110;
        },
        font: {
          size: "18",
          family: "Roboto"
        },
        align: "right",
        backgroundColor: "rgb(0,0,0,1)",
        padding: 10,
        borderRadius: 15,
        borderWidth: 2,
      },
    },
    legend: {
    	display: false
    },
    responsive: true,
    scales: {
      yAxes: [{
        gridLines: {
          color: "rgb(255,255,255, 0.3)"
        },
        position: "right",
        ticks: {
          precision: 0,
          fontColor: "white",
          fontSize: 18,
          beginAtZero: false,
          padding: 25,
          autoSkip: false
        }
      }],
      xAxes: [{
        gridLines: {
          color: "rgb(255,255,255, 0.3)"
        },
        ticks: {
          fontColor: "white",
          fontSize: 18,
          beginAtZero: true,
          padding: 25,
        }
      }]
    }
  }
}

export default planetChartData;