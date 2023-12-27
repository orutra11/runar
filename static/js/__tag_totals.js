// async function fetch_data() {
//     const response_tag_data = await fetch("/api/tag_totals");
//     const tag_data = response_tag_data.json();
//     return tag_data;
// }
async function fetchTagAndQ() {
    const [tagResponse, qResponse] = await Promise.all([
        fetch("/api/tag_totals"),
        fetch("/api/q_totals"),
    ]);

    const tag_data = await tagResponse.json();
    const q_data = await qResponse.json();

    return [tag_data, q_data];
}

const tag_totals_ctx = document.getElementById("tag-totals");

var tag_chart;
var tag_data;
var q_data;
var tag_datasets;
var q_datasets;

var graph_select = true;

Chart.register(ChartjsPluginStacked100.default);
// const response_tag_data = await fetch("/api/tag_totals");
// const tag_data = response_tag_data.json()
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
        },
        {
            label: "Race",
            data: r_data,
            fill: "-1",
            borderColor: "#008000",
            backgroundColor: "rgba(0, 128, 0, 0.2)",
            order: 1,
        },
        {
            label: "NQ",
            data: nq_data,
            borderColor: "#004e98",
            backgroundColor: "rgba(0, 78, 152, 0.2)",
            fill: "-1",
            order: 2,
        },
        {
            label: "NA",
            data: na_data,
            fill: "-1",
            borderColor: "#5e503f",
            backgroundColor: "rgba(94, 80, 63, 0.2)",
            order: 3,
        },
    ];

    const cfg = {
        type: "line",
        data: {
            labels: tag_data.map((t) => t["date"]),
            datasets: tag_datasets,
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
            plugins: {
                stacked100: {
                    enable: false,
                },
            },
        },
    };
    tag_chart = new Chart(tag_totals_ctx, cfg);
});

function toggleDataset() {
    if (graph_select === true) {
        tag_chart.data.datasets = q_datasets;
        document.getElementById("q-button").innerHTML = "Tag view";
    } else {
        tag_chart.data.datasets = tag_datasets;
        document.getElementById("q-button").innerHTML = "Q/NQ view";
    }
    graph_select = !graph_select;

    tag_chart.update();
}

function toggleStack() {
    if (tag_chart.options.plugins.stacked100.enable === true) {
        tag_chart.options.plugins.stacked100.enable =
            !tag_chart.options.plugins.stacked100.enable;

        tag_chart.options.scales.y.min = 0;
        tag_chart.options.scales.y.suggestedMax = 500;
        document.getElementById("stack-button").innerHTML = "Relative";
    } else {
        tag_chart.options.plugins.stacked100.enable =
            !tag_chart.options.plugins.stacked100.enable;

        tag_chart.options.scales.y.suggestedMax = 100;
        document.getElementById("stack-button").innerHTML = "Absolute";
    }

    tag_chart.update();
}
