const top_perf_ctx = document.getElementById("top-performances");

var top_chart;

const req_cfg = {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
};

req_cfg.body = JSON.stringify({
    interval: 400,
});

fetch("/api/i-400", req_cfg)
    .then((res) => res.json())
    .then((indata) => {
        const years = indata.map((row) => row.year);
        const u_years = years.filter(uniqueFilter).sort((a, b) => a - b);

        const datasets = u_years.map((y) => {
            const y_data = indata.filter((r) => r.year === y);
            return {
                label: y,
                data: y_data,
                parsing: {
                    xAxisKey: "rank",
                    yAxisKey: "seconds",
                },
            };
        });

        const cfg = {
            type: "scatter",
            data: {
                datasets: datasets,
            },
            options: {
                plugins: {
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            // labelColor: ,
                            // beforeLabel: function (ctx) {
                            //     return ctx.raw.year;
                            // },
                            label: function (ctx) {
                                let label = [
                                    `[# ${ctx.raw.rank}] ${ctx.raw.act_name} (${ctx.raw.year})`,
                                    formatSplitDuration(ctx.raw.seconds),
                                ];
                                return label;
                            },
                        },
                    },
                },
            },
        };

        top_chart = new Chart(top_perf_ctx, cfg);
    });

function selectInterval(selectObj) {
    // get the index of the selected option
    var idx = selectObj.selectedIndex;
    // get the value of the selected option
    var which = selectObj.options[idx].value;

    req_cfg.body = JSON.stringify({
        interval: which,
    });

    fetch(`/api/i-${which}`, req_cfg)
        .then((res) => res.json())
        .then((indata) => {
            const years = indata.map((row) => row.year);
            const u_years = years.filter(uniqueFilter).sort((a, b) => a - b);

            const datasets = u_years.map((y) => {
                const y_data = indata.filter((r) => r.year === y);
                return {
                    label: y,
                    data: y_data,
                    parsing: {
                        xAxisKey: "rank",
                        yAxisKey: "seconds",
                    },
                };
            });

            top_chart.data.datasets = datasets;
            top_chart.update();
        });
}
