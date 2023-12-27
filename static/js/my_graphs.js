const yr_totals_ctx = document.getElementById("yearly-distance");
const month_totals_ctx = document.getElementById("monthly-distance");
const tag_totals_ctx = document.getElementById("tag-totals");
const bubble_dist_ctx = document.getElementById("bubble-distance");

let yr_chart, month_chart;
let tag_chart;
let bubble_chart;

let yr_m_data;
let tag_data;
let q_data;
let bubble_data;

let tag_datasets;
let q_datasets;

let graph_select = true;
let is_data_filtered = false;

Chart.register(ChartjsPluginStacked100.default);
async function fetchTagAndQ() {
    const [tagResponse, qResponse] = await Promise.all([
        fetch("/api/tag_totals"),
        fetch("/api/q_totals"),
    ]);

    const tag_data = await tagResponse.json();
    const q_data = await qResponse.json();

    return [tag_data, q_data];
}

fetch("/api/yr_month_totals")
    .then((response) => response.json())
    .then((data) => {
        yr_m_data = data;
        let yr_distance = yr_sum(yr_m_data);
        let m_distance = m_avg(yr_m_data);

        yr_chart = new Chart(yr_totals_ctx, {
            type: "bar",
            data: {
                labels: yr_distance.map((row) => row.year),
                datasets: [
                    {
                        label: "Distance (km)",
                        data: yr_distance.map((row) => row.distance),
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                plugins: {
                    legend: {
                        display: false,
                    },
                },
                events: ["click", "mousemove"],
                scales: {
                    x: {
                        grid: {
                            display: false,
                        },
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: false,
                        },
                    },
                },
                onClick: YrClickHandler,
                onResize: ResizeHandler,
            },
        });

        month_chart = new Chart(month_totals_ctx, {
            type: "bar",
            data: {
                labels: m_distance.map((row) => row.month),
                datasets: [
                    {
                        label: "Distance (km)",
                        data: m_distance.map((row) => row.distance),
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                //events: ["click", "mousemove"],
                plugins: {
                    legend: {
                        display: false,
                    },
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                        },
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: false,
                        },
                    },
                },
            },
        });
    });

fetchTagAndQ().then(([data1, data2]) => {
    tag_data = data1;
    q_data = data2;

    tag_data.map((r) => (r["date"] = new Date(r.year, r.month - 1, 1)));
    q_data.map((r) => (r["date"] = new Date(r.year, r.month - 1, 1)));

    const e_data = tag_data.map((r) => {
        return { x: r["date"], y: r["E"] };
    });
    const c_data = tag_data.map((r) => {
        return { x: r["date"], y: r["C"] };
    });
    const i_data = tag_data.map((r) => {
        return { x: r["date"], y: r["I"] };
    });
    const f_data = tag_data.map((r) => {
        return { x: r["date"], y: r["F"] };
    });
    const l_data = tag_data.map((r) => {
        return { x: r["date"], y: r["L"] };
    });
    const t_data = tag_data.map((r) => {
        return { x: r["date"], y: r["T"] };
    });
    const h_data = tag_data.map((r) => {
        return { x: r["date"], y: r["H"] };
    });
    const p_data = tag_data.map((r) => {
        return { x: r["date"], y: r["P"] };
    });

    const qq_data = q_data.map((r) => {
        return { x: r["date"], y: r["Q"] };
    });
    const nq_data = q_data.map((r) => {
        return { x: r["date"], y: r["NQ"] };
    });
    const na_data = q_data.map((r) => {
        return { x: r["date"], y: r["NA"] };
    });
    const r_data = q_data.map((r) => {
        return { x: r["date"], y: r["R"] };
    });

    tag_datasets = [
        {
            label: "Easy",
            data: e_data,
            borderColor: "#004e98",
            backgroundColor: "rgba(0, 78, 152, 0.2)",
            fill: "origin",
            order: 0,
            pointStyle: false,
        },
        {
            label: "Warmup/Cooldown",
            data: c_data,
            fill: "-1",
            borderColor: "#c0c0c0",
            backgroundColor: "rgba(192, 192, 192 ,0.2)",
            order: 1,
            pointStyle: false,
        },
        {
            label: "Interval",
            data: i_data,
            fill: "-1",
            borderColor: "#c81d25",
            backgroundColor: "rgba(200, 29, 37, 0.2)",
            order: 3,
            pointStyle: false,
        },
        {
            label: "Fartlek",
            data: f_data,
            fill: "-1",
            borderColor: "#f3722c",
            backgroundColor: "rgba(243, 144, 44, 0.2)",
            order: 5,
            pointStyle: false,
        },
        {
            label: "Long Run",
            data: l_data,
            fill: "-1",
            borderColor: "#012a4a",
            backgroundColor: "rgba(1, 42, 74, 0.2)",
            order: 2,
            pointStyle: false,
        },
        {
            label: "Tempo",
            data: t_data,
            fill: "-1",
            borderColor: "#f1ba4f",
            backgroundColor: "rgba(241, 186, 79, 0.2)",
            order: 6,
            pointStyle: false,
        },
        {
            label: "Hills",
            data: h_data,
            fill: "-1",
            borderColor: "#ff4d6d",
            backgroundColor: "rgba(255, 79, 109, 0.2)",
            order: 4,
            pointStyle: false,
        },
        {
            label: "Race",
            data: r_data,
            fill: "-1",
            borderColor: "#008000",
            backgroundColor: "rgba(0, 128, 0, 0.2)",
            order: 9,
            pointStyle: false,
        },
        {
            label: "Progressive Run",
            data: p_data,
            fill: "-1",
            borderColor: "#7b2cbf",
            backgroundColor: "rgba(123, 44, 191, 0.2)",
            order: 7,
            pointStyle: false,
        },
        {
            label: "NA",
            data: na_data,
            fill: "-1",
            borderColor: "#5e503f",
            backgroundColor: "rgba(94, 80, 63, 0.2)",
            order: 8,
            pointStyle: false,
        },
    ];

    q_datasets = [
        {
            label: "Q",
            data: qq_data,
            fill: "origin",
            borderColor: "#c81d25",
            backgroundColor: "rgba(200, 29, 37, 0.2)",
            order: 0,
            pointStyle: false,
        },
        {
            label: "Race",
            data: r_data,
            fill: "-1",
            borderColor: "#008000",
            backgroundColor: "rgba(0, 128, 0, 0.2)",
            order: 1,
            pointStyle: false,
        },
        {
            label: "NQ",
            data: nq_data,
            borderColor: "#004e98",
            backgroundColor: "rgba(0, 78, 152, 0.2)",
            fill: "-1",
            order: 2,
            pointStyle: false,
        },
        {
            label: "NA",
            data: na_data,
            fill: "-1",
            borderColor: "#5e503f",
            backgroundColor: "rgba(94, 80, 63, 0.2)",
            order: 3,
            pointStyle: false,
        },
    ];

    const cfg = {
        type: "line",
        data: {
            labels: tag_data.map((t) => t["date"]),
            datasets: tag_datasets,
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
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
                    grid: {
                        display: false,
                    },
                },
            },
            plugins: {
                legend: {
                    position: "left",
                    labels: {
                        boxWidth: 25,
                        font: {
                            size: 11,
                        },
                    },
                },
                stacked100: {
                    enable: false,
                },
                tooltip: {
                    intersect: false,
                },
            },
        },
    };
    tag_chart = new Chart(tag_totals_ctx, cfg);
});

fetch("/api/bubble_distance")
    .then((res) => res.json())
    .then((indata) => {
        bubble_data = indata.map((row) => {
            return {
                x: new Date(row["date"]),
                y: row["speed"],
                r: row["distance"],
            };
        });

        const data = {
            datasets: [
                {
                    label: "Pace-Distance",
                    data: bubble_data,
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
                    y: {
                        grid: {
                            display: false,
                        },
                    },
                },
                plugins: {
                    legend: {
                        display: false,
                    },
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

        bubble_chart = new Chart(bubble_dist_ctx, cfg);
    });
