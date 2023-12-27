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

            let tag_arr = [];
            if (act["tag"]) {
                tag_arr = act["tag"].split("|");
            }
            const tag_badges = tag_arr.map((t) => {
                let color;
                if (t.includes("I")) color = "interval";
                else if (t.includes("C")) color = "warmup";
                else if (t.includes("E")) color = "easy";
                else if (t.includes("H")) color = "hills";
                else if (t.includes("T")) color = "tempo";
                else if (t.includes("F")) color = "fartlek";
                else if (t.includes("L")) color = "longrun";
                else if (t.includes("P")) color = "progressive";
                else if (t.includes("NA")) color = "na";
                else if (t.includes("R")) color = "race";

                return `<span class="badge bg-${color}">${t}</span>`;
            });

            let tag = row.insertCell(2);
            tag.innerHTML = tag_badges.join("<br/>") || null;

            let distance = row.insertCell(3);
            distance.innerHTML = act["distance"];

            let duration = row.insertCell(4);
            duration.innerHTML = act["duration"];

            let icon = row.insertCell(5);
            icon.innerHTML = `<a href="/activity/${act["activity_id"]}"><i class="fa-solid fa-chevron-right"></i></a>`;
        });
    });
