import React, { useState } from "react";
import { Doughnut, Line } from "react-chartjs-2";

export const ProductChart = ({ data = [] }) => {
    const [chartData] = useState({
        labels: ["units sold", "units in transit", "units available"],
        datasets: [
            {
                label: "product summary",
                data,
                backgroundColor: ["#82CBF4", "#F4D167", "#84E296"],
                hoverBorderWidth: 1,
                hoverBorderColor: "#333",
                borderWidth: 0
            }
        ]
    });

    return (
        <div className="chart">
            <Doughnut
                data={chartData}
                options={{
                    cutoutPercentage: 80,
                    legend: {
                        display: true,
                        position: "right",
                        fullWidth: true,
                        labels: {
                            boxWidth: 20,
                            fontSize: 12,
                            usePointStyle: true,
                            padding: 25,
                            fontFamily: "Montserrat, sans-serif"
                        }
                    }
                }}
            />
        </div>
    );
};

export const LineChart = ({ data = [] }) => {
    const chartData = canvas => {
        const ctx = canvas.getContext("2d");
        const gradient = ctx.createLinearGradient(0, 400, 0, 300);
        gradient.addColorStop(1, "rgba(218, 232, 245, 0.6)");
        gradient.addColorStop(0, "rgba(255, 255, 255, 0.1)");

        return {
            labels: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec"
            ],
            datasets: [
                {
                    label: "sales chart",
                    data,
                    fill: true,
                    backgroundColor: gradient,
                    borderColor: "#001427",
                    borderWidth: 2
                }
            ]
        };
    };

    return (
        <div className="chart">
            <Line
                data={chartData}
                options={{
                    legend: {
                        display: false
                    },
                    tooltips: {
                        callbacks: {
                            label: (tooltipItem, data) => {
                                let value = data.datasets[
                                    tooltipItem.datasetIndex
                                ].data[tooltipItem.index].toLocaleString();

                                return `${value} DKK`;
                            }
                        }
                    },
                    scales: {
                        yAxes: [
                            {
                                ticks: {
                                    fontColor: "#828282",
                                    fontStyle: "bold",
                                    beginAtZero: true,
                                    padding: 10,
                                    stepSize: 10000,
                                    callback: function(value, index, values) {
                                        return `${value} DKK`;
                                    }
                                }
                            }
                        ],
                        xAxes: [
                            {
                                gridLines: {
                                    drawTicks: true,
                                    display: false,
                                    zeroLineColor: "transparent"
                                },
                                ticks: {
                                    padding: 10,
                                    fontColor: "#828282",
                                    fontStyle: "bold"
                                }
                            }
                        ]
                    }
                }}
            />
        </div>
    );
};
