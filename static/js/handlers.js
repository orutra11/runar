const YrClickHandler = (e) => {
    const points = yr_chart.getElementsAtEventForMode(
        e,
        "nearest",
        { intersect: true },
        true
    );

    if (points.length) {
        // Change styly from origin chart
        const n_data_points =
            yr_chart.data.datasets[points[0].datasetIndex].data.length;

        const original_background_color = "rgba(54, 162, 235, 0.5)";
        const original_border_color = "rgba(54, 162, 235, 1)";

        const repeat = (arr, n) => [].concat(...Array(n).fill(arr));
        const newBackgroundColor = repeat(
            original_background_color,
            n_data_points
        );
        const newBorderColor = repeat(original_border_color, n_data_points);

        newBackgroundColor[points[0].index] = "rgba(150, 206, 0, 0.5)";
        newBorderColor[points[0].index] = "rgba(150, 206, 0, 1)";
        yr_chart.data.datasets[points[0].datasetIndex].backgroundColor =
            newBackgroundColor;
        yr_chart.data.datasets[points[0].datasetIndex].borderColor =
            newBorderColor;
        yr_chart.update();

        // Filter monthly chart
        const yr_click = yr_chart.data.labels[points[0].index];
        const filtered_data = yr_m_data.filter((row) => row.year === yr_click);
        let m_distance = m_avg(filtered_data);
        let m_values = m_distance.map((row) => row.distance);
        let m_labels = m_distance.map((row) => row.month);
        month_chart.data.datasets[0].data = m_values;
        month_chart.data.labels = m_labels;
        month_chart.update();

        tag_chart.options.scales.x.min = new Date(yr_click - 1, 11, 31);
        tag_chart.options.scales.x.max = new Date(yr_click, 11, 1);
        tag_chart.update();

        bubble_chart.options.scales.x.min = new Date(yr_click - 1, 11, 31);
        bubble_chart.options.scales.x.max = new Date(yr_click, 11, 1);
        bubble_chart.update();

        is_data_filtered = true;
        document.getElementById("reset-filter-button").style.visibility =
            "visible";
    }
};

const toggleDataset = () => {
    if (graph_select === true) {
        tag_chart.data.datasets = q_datasets;
        document.getElementById("q-button").innerHTML = "Tag view";
    } else {
        tag_chart.data.datasets = tag_datasets;
        document.getElementById("q-button").innerHTML = "Q/NQ view";
    }
    graph_select = !graph_select;

    tag_chart.update();
};

const toggleStack = () => {
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
};

const ResizeHandler = (ctx) => {
    const resetFilters = () => {
        // console.log("Reset filters");
        // console.log(ctx);
        const n_data_points = yr_chart.data.datasets[0].data.length;

        const original_background_color = "rgba(54, 162, 235, 0.5)";
        const original_border_color = "rgba(54, 162, 235, 1)";
        const repeat = (arr, n) => [].concat(...Array(n).fill(arr));
        const newBackgroundColor = repeat(
            original_background_color,
            n_data_points
        );
        const newBorderColor = repeat(original_border_color, n_data_points);
        yr_chart.data.datasets[0].backgroundColor = newBackgroundColor;
        yr_chart.data.datasets[0].borderColor = newBorderColor;
        yr_chart.update();

        let m_distance = m_avg(yr_m_data);
        let m_values = m_distance.map((row) => row.distance);
        let m_labels = m_distance.map((row) => row.month);
        month_chart.data.datasets[0].data = m_values;
        month_chart.data.labels = m_labels;
        month_chart.update();

        tag_chart.options.scales.x.min = null;
        tag_chart.options.scales.x.max = null;
        tag_chart.update();

        bubble_chart.options.scales.x.min = null;
        bubble_chart.options.scales.x.max = null;
        bubble_chart.update();

        document.getElementById("reset-filter-button").style.visibility =
            "hidden";
    };

    let resetButton = document.getElementById("reset-filter-button");

    if (!resetButton) {
        resetButton = document.createElement("button");
        const buttonText = document.createTextNode("RESET");
        resetButton.id = "reset-filter-button";
        resetButton.classList.add("btn");
        resetButton.classList.add("btn-outline-primary");
        resetButton.style.position = "relative";
        resetButton.appendChild(buttonText);
        ctx.canvas.parentNode.appendChild(resetButton);

        const xPos = ctx.width / 2;
        const yPos = ctx.height;

        resetButton.style.top = -yPos + "px";
        resetButton.style.left = xPos + "px";

        resetButton.addEventListener("click", resetFilters);

        if (!is_data_filtered) {
            resetButton.style.visibility = "hidden";
        } else {
            resetButton.style.visibility = "visible";
        }
    }
};
