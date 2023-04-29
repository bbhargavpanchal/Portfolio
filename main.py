from flask import Flask, render_template, request
import gspread
from oauth2client.service_account import ServiceAccountCredentials

# Connect to Google Sheets
scope = ['https://www.googleapis.com/auth/spreadsheets',
         "https://www.googleapis.com/auth/drive"]

credentials = ServiceAccountCredentials.from_json_keyfile_name("key.json", scope)
client = gspread.authorize(credentials)

# Open the sheet by name
sheet = client.open("appinfo").sheet1

app = Flask(__name__)


@app.route('/')
def home():
    return render_template('home.html')


@app.route('/about')
def about():
    return render_template('about.html')


@app.route('/portfolio')
def portfolio():
    return render_template('portfolio.html')


@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        contact = request.form['contact']
        message = request.form['message']

        # Add the new data to the sheet
        row = [name, email, contact, message]
        sheet.append_row(row)

        return render_template('thanks.html')
    else:
        return render_template('contact.html')


if __name__ == '__main__':
    app.run(debug=True, port=5051)

