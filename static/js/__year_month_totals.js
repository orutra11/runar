const chrt_1_ctx = document.getElementById("yearly-distance");
const chrt_2_ctx = document.getElementById("monthly-distance");

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
