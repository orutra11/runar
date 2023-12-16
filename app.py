import sqlite3
import re
from flask import Flask, render_template, abort

app = Flask(__name__, static_folder="static", template_folder="templates")


@app.route("/")
def index():
    return render_template("index.html")


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

    if act is None:
        abort(404)

    activity_details = {}
    activity_details["name"] = act[2]

    return render_template("activity_detail.html", activity_details=activity_details)


if __name__ == "__main__":
    app.config["DEBUG"] = True
    app.config["TEMPLATES_AUTO_RELOAD"] = True
    app.run(debug=True)
