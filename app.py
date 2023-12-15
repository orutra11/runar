from flask import Flask, render_template, url_for, redirect

app = Flask(__name__, static_folder="static", template_folder="templates")


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/test_redirect")
def admin():
    return redirect(url_for("index"))


if __name__ == "__main__":
    app.config["DEBUG"] = True
    app.config["TEMPLATES_AUTO_RELOAD"] = True
    app.run(debug=True)
