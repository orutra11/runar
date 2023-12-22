import sqlite3
import re
from flask import Flask, render_template, abort, jsonify

app = Flask(__name__, static_folder="static", template_folder="templates")


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


@app.route("/")
def index():
    return render_template("index.html")


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
