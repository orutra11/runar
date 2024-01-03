const speedToPace = (speed) => {
    return 60 / speed;
};

const formatPace = (pace, textappend = false) => {
    const min = Math.floor(pace);
    const rest = pace - min;
    const segFloat = 60 * rest;
    const segInt = Math.floor(segFloat);
    //const restSeg = segFloat - segInt;
    return `${min}:${segInt < 10 ? "0" + segInt : segInt} ${
        textappend ? "min/km" : ""
    }`;
};

const formatSplitDuration = (duration) => {
    const h = Math.floor(duration / 3600);
    const h_rest = duration / 3600 - h;
    const m = Math.floor(h_rest * 60);
    const m_rest = h_rest * 60 - m;
    const s = Math.floor(m_rest * 60);
    const s_rest = m_rest * 60 - s;
    //const ds = Math.floor(s_rest * 10);

    let strDuration = h > 0 ? `${h}h` : "";
    strDuration += m > 0 || h > 0 ? m + "'" : "";
    strDuration += s < 10 ? "0" + s : s;
    strDuration += "." + s_rest.toFixed(0) + '"';
    return strDuration;
};

function uniqueFilter(value, index, self) {
    return self.indexOf(value) === index;
}

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

const pixelValue = (scale, v) => {
    const val = scale.getValueForPixel(v);
    return Math.trunc(isNaN(val) ? v * 6 : 3);
};
