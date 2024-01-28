const test_graph_ctx = document.getElementById("test-canvas");
let cum_distance_chart;

// const totalDuration = 5000;
const delayBetweenPoints = 10;
const previousY = (ctx) =>
    ctx.index === 0
        ? ctx.chart.scales.y.getPixelForValue(0)
        : ctx.chart
              .getDatasetMeta(ctx.datasetIndex)
              .data[ctx.index - 1].getProps(["y"], true).y;

const prog_animation = {
    x: {
        type: "number",
        easing: "linear",
        duration: delayBetweenPoints,
        from: NaN, // the point is initially skipped
        delay(ctx) {
            if (ctx.type !== "data" || ctx.xStarted) {
                return 0;
            }
            ctx.xStarted = true;
            return ctx.index * delayBetweenPoints;
        },
    },
    y: {
        type: "number",
        easing: "linear",
        duration: delayBetweenPoints,
        from: previousY,
        delay(ctx) {
            if (ctx.type !== "data" || ctx.yStarted) {
                return 0;
            }
            ctx.yStarted = true;
            return ctx.index * delayBetweenPoints;
        },
    },
};

let cum_datasets = [];

fetch("/api/yr_evolution")
    .then((res) => res.json())
    .then((data) => {
        const ty_raw_data = data.filter((r) => r["ds"] === "TY");
        const ly_raw_data = data.filter((r) => r["ds"] === "LY");
        const av_raw_data = data.filter((r) => r["ds"] === "AV");

        const ty_data = ty_raw_data.map((r) => {
            return { x: r["doy"], y: r["distance"] };
        });
        const ly_data = ly_raw_data.map((r) => {
            return { x: r["doy"], y: r["distance"] };
        });
        const av_data = av_raw_data.map((r) => {
            return { x: r["doy"], y: r["distance"] };
        });

        const this_year = ty_raw_data[0]["year"];

        const ty_max_doy = Math.max(...ty_raw_data.map((r) => r["doy"]));

        const ty_max_distance = ty_raw_data.filter(
            (r) => r["doy"] === ty_max_doy
        )[0]["distance"];
        const ly_distance = ly_raw_data.filter(
            (r) => r["doy"] === ty_max_doy
        )[0]["distance"];
        const av_distance = av_raw_data.filter(
            (r) => r["doy"] === ty_max_doy
        )[0]["distance"];

        document.getElementById("ty-label").innerHTML = this_year;
        document.getElementById("ty-distance-value").innerHTML =
            ty_max_distance.toFixed(1);
        document.getElementById("ly-label").innerHTML = this_year - 1;
        document.getElementById("ly-distance-value").innerHTML =
            ly_distance.toFixed(1);
        document.getElementById("av-label").innerHTML = "Avg";
        document.getElementById("av-distance-value").innerHTML =
            av_distance.toFixed(1);

        cum_datasets = [
            {
                label: this_year,
                borderColor: "#01497c",
                borderWidth: 3,
                radius: 0,
                data: ty_data,
            },
            {
                label: this_year - 1,
                borderColor: "#2c7da0",
                borderWidth: 1,
                // radius: 0,
                data: ly_data,
            },
            {
                label: "2017-2023",
                borderColor: "#89c2d9",
                borderWidth: 1,
                // radius: 0,
                data: av_data,
            },
        ];

        const config = {
            type: "line",
            data: {
                datasets: cum_datasets,
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: prog_animation,
                interaction: {
                    mode: "index",
                    intersect: false,
                },
                plugins: {
                    legend: false,
                },
                scales: {
                    x: {
                        type: "linear",
                        min: 0,
                        max: 366,
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
                elements: {
                    point: {
                        radius: (ctx) =>
                            ctx.chart.data.datasets[ctx.datasetIndex].data
                                .length -
                                1 ===
                            ctx.index
                                ? 3
                                : 0,
                    },
                },
            },
        };

        cum_distance_chart = new Chart(test_graph_ctx, config);
    });
