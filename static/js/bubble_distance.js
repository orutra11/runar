const bubble_dist_ctx = document.getElementById("bubble-distance");

const speedToPace = (speed) => {
    return 60 / speed;
};

const formatPace = (pace, textappend = false) => {
    const min = Math.floor(pace);
    const rest = pace - min;
    const segFloat = 60 * rest;
    const segInt = Math.floor(segFloat);
    //const restSeg = segFloat - segInt;
    return `${min}:${segInt < 10 ? "0" + segInt : segInt} ${
        textappend ? "min/km" : ""
    }`;
};

fetch("/api/bubble_distance")
    .then((res) => res.json())
    .then((indata) => {
        const chartjs_data = indata.map((row) => {
            return {
                x: new Date(row["date"]),
                y: row["speed"],
                r: row["distance"],
            };
        });

        const data = {
            datasets: [
                {
                    label: "Speed v Distance",
                    data: chartjs_data.filter(
                        (row) => row["x"].getFullYear() >= 2022
                    ),
                    backgroundColor: "rgba(255, 99, 132, 0.5)",
                    borderColor: "rgba(255, 99, 132)",
                },
            ],
        };

        const cfg = {
            type: "bubble",
            data: data,
            options: {
                scales: {
                    x: {
                        type: "time",
                        time: {
                            unit: "month",
                            displayFormats: {
                                quarter: "MMM YYYY",
                            },
                            tooltipFormat: "MMM yy",
                        },
                        grid: {
                            display: false,
                        },
                    },
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (tooltipData) => {
                                const values =
                                    tooltipData.dataset.data[
                                        tooltipData.dataIndex
                                    ];

                                return `${
                                    values.x.toISOString().split("T")[0]
                                }: ${formatPace(
                                    speedToPace(values.y)
                                )} (${values.r.toFixed(2)}km)`;
                            },
                        },
                    },
                },
            },
        };

        new Chart(bubble_dist_ctx, cfg);
    });
