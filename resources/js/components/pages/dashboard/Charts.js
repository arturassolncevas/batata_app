import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";

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
