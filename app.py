import sqlite3
import re
from datetime import datetime, date
from flask import Flask, render_template, abort, jsonify, request, g
import pandas as pd

app = Flask(__name__, static_folder="static", template_folder="templates")


def is_leap(year):
    """
    Calculates if a year is leap or not

    Args:
        year (int): year to check

    Returns:
        bool: leap year = True
    """

    if year % 4 != 0:
        return False

    if (year % 100 == 0) and (year % 400 != 0):
        return False

    return True


def set_menu(section):
    menuconfig = {}

    if len(section) > 0:
        menuconfig[section] = "active"

    return menuconfig


def list_to_dict(data, keys):
    out = []
    for _row in data:
        this_row = dict(list(zip(keys, _row)))
        out.append(this_row)

    return out


def get_totals_by_year_month():
    con = sqlite3.connect("/Users/arturo/HealthData/DBs/garmin_activities.db")
    cur = con.cursor()
    res = cur.execute(
        """
            SELECT year, month, distance
            FROM VIEW_totals_by_year_month
        """
    )

    totals = res.fetchall()
    totals_chartjs = list_to_dict(totals, ["year", "month", "distance"])
    cur.close()
    con.close()

    return totals_chartjs


def get_tag_totals_by_year_month():
    con = sqlite3.connect("/Users/arturo/HealthData/DBs/garmin_activities.db")
    cur = con.cursor()
    res = cur.execute(
        """
            SELECT year, month, 
            I, F, H, P, T,
            C, E, L, NA,
            R
            FROM VIEW_tag_totals_by_year_month
        """
    )

    totals = res.fetchall()
    totals_chartjs = list_to_dict(
        totals, ["year", "month", "I", "F", "H", "P", "T", "C", "E", "L", "NA", "R"]
    )
    cur.close()
    con.close()

    return totals_chartjs


def get_q_totals_by_year_month():
    con = sqlite3.connect("/Users/arturo/HealthData/DBs/garmin_activities.db")
    cur = con.cursor()
    res = cur.execute(
        """
            SELECT year, month, 
            Q, NQ, NA, R
            FROM VIEW_q_totals_by_year_month
        """
    )

    totals = res.fetchall()
    totals_chartjs = list_to_dict(totals, ["year", "month", "Q", "NQ", "NA", "R"])
    cur.close()
    con.close()

    return totals_chartjs


def get_last_five():
    con = sqlite3.connect("/Users/arturo/HealthData/DBs/garmin_activities.db")
    cur = con.cursor()
    res = cur.execute(
        """
            SELECT date, name, tag, distance, duration, activity_id
            FROM VIEW_last_five_acts
        """
    )

    last_five = res.fetchall()
    last_five_dict = list_to_dict(
        last_five, ["date", "name", "tag", "distance", "duration", "activity_id"]
    )
    cur.close()
    con.close()

    return last_five_dict


def get_bubble_view():
    con = sqlite3.connect("/Users/arturo/HealthData/DBs/garmin_activities.db")
    cur = con.cursor()
    res = cur.execute(
        """
            SELECT date, distance, speed
            FROM VIEW_date_distance_speed_E_L
        """
    )

    bubble_data = res.fetchall()
    bubble_data_dict = list_to_dict(bubble_data, ["date", "distance", "speed"])
    cur.close()
    con.close()

    return bubble_data_dict


def get_top_performance(interval):
    def virtual_view(interval):
        view_query = f"""
            SELECT CAST(Substr(start_time, 1, 4) AS INTEGER) year, 
                   name, 
                   strftime('%s',moving_time)-strftime('%s','00:00') + mod(strftime('%f',moving_time)-strftime('%f','00:00'), 1) elapsed_seconds, 
                   Rank() over (Partition BY interval_class ORDER BY moving_time ASC ) AS rank
            FROM SMRY_interval_list
            WHERE interval_class = 'I-{interval}' AND valid_interval = 1
            """
        return view_query

    print(f"Getting {interval} interval VIEW")
    con = sqlite3.connect("/Users/arturo/HealthData/DBs/garmin_activities.db")
    cur = con.cursor()
    res = cur.execute(virtual_view(interval))

    top_data = res.fetchall()
    top_data_dict = list_to_dict(top_data, ["year", "act_name", "seconds", "rank"])
    cur.close()
    con.close()

    return top_data_dict


def get_yr_evolution():
    today = datetime.now()
    this_year = today.year
    last_year = this_year - 1

    this_doy = today.toordinal() - date(today.year, 1, 1).toordinal() + 1

    con = sqlite3.connect("/Users/arturo/HealthData/DBs/garmin_activities.db")
    cur = con.cursor()
    res = cur.execute(
        """
            SELECT year, doy, cum_distance
            FROM VIEW_cum_daily_yr_distance
            ORDER BY year, doy ASC
        """
    )

    daily_cum_data = res.fetchall()
    cur.close()
    con.close()

    daily_cum_data_cols = list(zip(*daily_cum_data))
    first_year = daily_cum_data_cols[0][0]
    first_doy = daily_cum_data_cols[0][1]

    new_data = []
    for y in range(first_year, this_year + 1):
        filtered_data = [x for x in daily_cum_data if x[0] == y]
        doys = [x[1] for x in filtered_data]
        start_doy = first_doy if y == first_year else 0

        if y == this_year:
            end_doy = this_doy + 1
        else:
            if is_leap(y):
                end_doy = 366
            else:
                end_doy = 365

        for doy in range(start_doy, end_doy):
            if doy in doys:
                new_data.append((y, doy, filtered_data[doys.index(doy)][2]))
            else:
                if doy == 0:
                    new_data.append((y, doy, 0.0))
                else:
                    new_data.append((y, doy, new_data[-1][2]))

    cum_data_df = pd.DataFrame(new_data, columns=["year", "doy", "distance"])
    avg_year = (
        cum_data_df[
            (cum_data_df["year"] > first_year) & (cum_data_df["year"] < this_year)
        ]
        .groupby("doy")
        .mean()
        .reset_index()
    )

    avg_year = avg_year[["year", "doy", "distance"]]

    avg_year_data = [("AV", *tuple(x)) for x in avg_year.values]

    if len(avg_year_data) == 366:
        avg_year_data = avg_year_data[:365]

    this_year_data = [("TY", *x) for x in new_data if x[0] == this_year]
    last_year_data = [("LY", *x) for x in new_data if x[0] == last_year]

    cum_data = this_year_data + last_year_data + avg_year_data

    cum_data_dict = list_to_dict(cum_data, ["ds", "year", "doy", "distance"])

    return cum_data_dict


@app.route("/api/yr_evolution")
def yr_evolution():
    totals = get_yr_evolution()
    return jsonify(totals)


@app.route("/api/yr_month_totals")
def yr_totals():
    totals = get_totals_by_year_month()
    return jsonify(totals)


@app.route("/api/tag_totals")
def tag_totals():
    totals = get_tag_totals_by_year_month()
    return jsonify(totals)


@app.route("/api/q_totals")
def q_totals():
    totals = get_q_totals_by_year_month()
    return jsonify(totals)


@app.route("/api/last_five")
def last_five():
    last_five = get_last_five()
    return jsonify(last_five)


@app.route("/api/bubble_distance")
def bubble_distance():
    bubbles = get_bubble_view()
    return jsonify(bubbles)


@app.route("/api/i-<int:interval>", methods=["GET", "POST"])
def top_performance(interval):
    if request.method == "GET":
        i400 = get_top_performance(interval)
        return jsonify(i400)
    elif request.method == "POST":
        req_json = request.get_json()
        top_i = get_top_performance(req_json["interval"])
        return jsonify(top_i)


@app.route("/")
def index():
    # mc = set_menu("Home")
    g.mc = set_menu("home")
    return render_template("index.html")


@app.route("/intervals")
def intervalsPage():
    # mc = set_menu("Intervals")
    g.mc = set_menu("intervals")
    return render_template("intervals.html")


@app.route("/activity/<activity_id>")
def activityPage(activity_id):
    id_regex = "^[0-9]{10,11}$"
    regex_result = re.match(id_regex, activity_id)
    if not regex_result:
        abort(404)

    con = sqlite3.connect("/Users/arturo/HealthData/DBs/garmin_activities.db")
    cur = con.cursor()
    res = cur.execute(
        f"""
            SELECT activity_id, start_time, name, distance, moving_time, tag_str 
            FROM SMRY_activity_list WHERE activity_id = {activity_id}
        """
    )
    act = res.fetchone()
    cur.close()
    con.close()

    if act is None:
        abort(404)

    activity_details = {}
    activity_details["name"] = act[2]

    return render_template("activity_detail.html", activity_details=activity_details)


if __name__ == "__main__":
    app.config["DEBUG"] = True
    app.config["TEMPLATES_AUTO_RELOAD"] = True
    app.run(debug=True)
