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

const ctx = document.getElementById("first-canvas");
const ctx2 = document.getElementById("second-canvas");

const data = fetch("/api/yr_month_totals")
    .then((response) => response.json())
    .then((data) => {
        let yr_distance = yr_sum(data);
        let m_distance = m_avg(data);

        const chart = new Chart(ctx, {
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
                responsive: true,
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

        const chart2 = new Chart(ctx2, {
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
