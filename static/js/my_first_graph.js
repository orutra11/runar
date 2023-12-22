const yr_sum = (yr_m_obj) => {
    let yr_distance = [];
    yr_m_obj.reduce((res, item) => {
        if (!res[item.year]) {
            res[item.year] = { year: item.year, distance: 0 };
            yr_distance.push(res[item.year]);
        }
        res[item.year].distance += item.distance;
        return res;
    }, {});
    yr_distance.sort((a, b) => a.year - b.year);
    return yr_distance;
};

const m_avg = (yr_m_obj) => {
    let m_distance = [];
    yr_m_obj.reduce((res, item) => {
        if (!res[item.month]) {
            res[item.month] = {
                month: item.month,
                distance: 0,
                n_months: 0,
            };
            m_distance.push(res[item.month]);
        }
        res[item.month].distance += item.distance;
        res[item.month].n_months += 1;
        return res;
    }, {});
    m_distance.map((m) => {
        m.distance /= m.n_months | 0;
    });

    m_distance.sort((a, b) => a.month - b.month);

    // Fill the gaps
    m_distance = Array.from(
        Array(12).keys(),
        (month) =>
            m_distance.find((row) => +row.month === month + 1) || {
                month: month + 1,
                distance: 0,
                n_months: 0,
            }
    );

    return m_distance;
};

const chrt_1_ctx = document.getElementById("first-canvas");
const chrt_2_ctx = document.getElementById("second-canvas");

const data = fetch("/api/yr_month_totals")
    .then((response) => response.json())
    .then((data) => {
        let yr_distance = yr_sum(data);
        let m_distance = m_avg(data);

        const chart = new Chart(chrt_1_ctx, {
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
                    },
                },
                onClick: clickHandler,
            },
        });

        const chart2 = new Chart(chrt_2_ctx, {
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
                    },
                },
            },
        });

        function clickHandler(e) {
            const points = chart.getElementsAtEventForMode(
                e,
                "nearest",
                { intersect: true },
                true
            );

            if (points.length) {
                // Change styly from origin chart
                const n_data_points =
                    chart.data.datasets[points[0].datasetIndex].data.length;

                const original_background_color = "rgba(54, 162, 235, 0.5)";
                const original_border_color = "rgba(54, 162, 235, 1)";

                const repeat = (arr, n) => [].concat(...Array(n).fill(arr));
                const newBackgroundColor = repeat(
                    original_background_color,
                    n_data_points
                );
                const newBorderColor = repeat(
                    original_border_color,
                    n_data_points
                );

                newBackgroundColor[points[0].index] = "rgba(150, 206, 0, 0.5)";
                newBorderColor[points[0].index] = "rgba(150, 206, 0, 1)";
                chart.data.datasets[points[0].datasetIndex].backgroundColor =
                    newBackgroundColor;
                chart.data.datasets[points[0].datasetIndex].borderColor =
                    newBorderColor;
                chart.update();

                // Filter monthly chart
                const yr_click = chart.data.labels[points[0].index];
                const filtered_data = data.filter(
                    (row) => row.year === yr_click
                );
                let m_distance = m_avg(filtered_data);
                let m_values = m_distance.map((row) => row.distance);
                let m_labels = m_distance.map((row) => row.month);
                chart2.data.datasets[0].data = m_values;
                chart2.data.labels = m_labels;
                chart2.update();
            }
        }
    });
