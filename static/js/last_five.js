const last_five_table_ctx = document.getElementById("last-five-body");

fetch("/api/last_five")
    .then((res) => res.json())
    .then((data) => {
        data.map((act) => {
            let row = last_five_table_ctx.insertRow();
            let date = row.insertCell(0);
            const date_time = act["date"].split(" ");
            date.innerHTML = `<span>${
                date_time[0] || null
            }</span> <br/> <span class="date-hour">${
                date_time[1] || null
            }</span>`;

            let name = row.insertCell(1);
            name.innerHTML = act["name"];

            let tag = row.insertCell(2);
            tag.innerHTML = act["tag"] || null;

            let distance = row.insertCell(3);
            distance.innerHTML = act["distance"];

            let duration = row.insertCell(4);
            duration.innerHTML = act["duration"];

            let icon = row.insertCell(5);
            icon.innerHTML = `<a href="/activity/${act["activity_id"]}"><i class="fa-solid fa-chevron-right"></i></a>`;
        });
    });
