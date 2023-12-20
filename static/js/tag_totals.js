const tag_totals_ctx = document.getElementById("tag-totals");

fetch("/api/tag_totals")
    .then((response) => response.json())
    .then((data) => {
        data.map((r) => (r["date"] = new Date(r.year, r.month - 1, 1)));

        const cfg = {
            type: "line",
            data: {
                datasets: [
                    {
                        label: "Easy",
                        data: data,
                        parsing: {
                            xAxisKey: "date",
                            yAxisKey: "E",
                        },
                        borderColor: "#004e98",
                        backgroundColor: "rgba(0, 78, 152, 0.2)",
                        fill: "origin",
                        order: 0,
                        pointStyle: false,
                    },
                    {
                        label: "Warmup/Cooldown",
                        data: data,
                        parsing: {
                            xAxisKey: "date",
                            yAxisKey: "C",
                        },
                        fill: "-1",
                        borderColor: "#c0c0c0",
                        backgroundColor: "rgba(192, 192, 192 ,0.2)",
                        order: 1,
                        pointStyle: false,
                    },
                    {
                        label: "Interval",
                        data: data,
                        parsing: {
                            xAxisKey: "date",
                            yAxisKey: "I",
                        },
                        borderColor: "#c81d25",
                        backgroundColor: "rgba(200, 29, 37, 0.2)",
                        order: 3,
                        pointStyle: false,
                    },
                    {
                        label: "Fartlek",
                        data: data,
                        parsing: {
                            xAxisKey: "date",
                            yAxisKey: "F",
                        },
                        borderColor: "#f3722c",
                        backgroundColor: "rgba(243, 144, 44, 0.2)",
                        order: 5,
                        pointStyle: false,
                    },
                    {
                        label: "Long Run",
                        data: data,
                        parsing: {
                            xAxisKey: "date",
                            yAxisKey: "L",
                        },
                        borderColor: "#012a4a",
                        backgroundColor: "rgba(1, 42, 74, 0.2)",
                        order: 2,
                        pointStyle: false,
                    },
                    {
                        label: "Tempo",
                        data: data,
                        parsing: {
                            xAxisKey: "date",
                            yAxisKey: "T",
                        },
                        borderColor: "#f1ba4f",
                        backgroundColor: "rgba(241, 186, 79, 0.2)",
                        order: 6,
                        pointStyle: false,
                    },
                    {
                        label: "Hills",
                        data: data,
                        parsing: {
                            xAxisKey: "date",
                            yAxisKey: "H",
                        },
                        borderColor: "#ff4d6d",
                        backgroundColor: "rgba(255, 79, 109, 0.2)",
                        order: 4,
                        pointStyle: false,
                    },
                    {
                        label: "Race",
                        data: data,
                        parsing: {
                            xAxisKey: "date",
                            yAxisKey: "R",
                        },
                        borderColor: "#008000",
                        backgroundColor: "rgba(0, 128, 0, 0.2)",
                        order: 9,
                        pointStyle: false,
                    },
                    {
                        label: "Progressive Run",
                        data: data,
                        parsing: {
                            xAxisKey: "date",
                            yAxisKey: "P",
                        },
                        borderColor: "#7b2cbf",
                        backgroundColor: "rgba(123, 44, 191, 0.2)",
                        order: 7,
                        pointStyle: false,
                    },
                    {
                        label: "NA",
                        data: data,
                        parsing: {
                            xAxisKey: "date",
                            yAxisKey: "NA",
                        },
                        borderColor: "#5e503f",
                        backgroundColor: "rgba(94, 80, 63, 0.2)",
                        order: 8,
                        pointStyle: false,
                    },
                ],
            },
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
                    y: {
                        stacked: true,
                    },
                },
            },
        };

        new Chart(tag_totals_ctx, cfg);
    });
