from flask import Flask, render_template, url_for

app = Flask(__name__, static_folder="static", template_folder="templates")


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/activity/<activity_id>")
def activityPage(activity_id):
    return render_template("activity_detail.html", activity_id=activity_id)


if __name__ == "__main__":
    app.config["DEBUG"] = True
    app.config["TEMPLATES_AUTO_RELOAD"] = True
    app.run(debug=True)
