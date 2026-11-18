from flask import Flask, render_template, request, redirect, url_for, session

app = Flask(__name__)
app.secret_key = 'khatab_secret_key_2026'

articles = [
    {"title": "رحلة العودة إلى الذات الحقيقية", "content": "كيف تستمع لصوتك الداخلي وسط صخب العالم الخارجي."},
    {"title": "قانون الامتنان وأثره الروحي", "content": "كيف تحول طاقة الشكوى إلى طاقة امتنان عميقة."}
]

books = [
    {"title": "أصداء بالداخل", "desc": "رحلة 21 يوماً من التأمل والتدوين اليومي."},
]

bookings = []
ADMIN_PASSWORD = "123"

@app.route('/')
def home():
    return render_template('index.html', articles=articles, books=books)

@app.route('/book', methods=['POST'])
def book():
    name = request.form.get('name')
    contact = request.form.get('contact')
    session_type = request.form.get('session_type')
    notes = request.form.get('notes')
    bookings.append({"name": name, "contact": contact, "session_type": session_type, "notes": notes})
    return redirect(url_for('home'))

@app.route('/admin-login', methods=['GET', 'POST'])
def admin_login():
    error = False
    if request.method == 'POST':
        if request.form.get('password') == ADMIN_PASSWORD:
            session['admin'] = True
            return redirect(url_for('admin_dashboard'))
        else:
            error = True
    return render_template('admin_login.html', error=error)

@app.route('/admin-dashboard')
def admin_dashboard():
    if not session.get('admin'):
        return redirect(url_for('admin_login'))
    return render_template('admin_dashboard.html', bookings=bookings)

@app.route('/add-article', methods=['POST'])
def add_article():
    if session.get('admin'):
        articles.append({"title": request.form.get('title'), "content": request.form.get('content')})
    return redirect(url_for('admin_dashboard'))

@app.route('/add-book', methods=['POST'])
def add_book():
    if session.get('admin'):
        books.append({"title": request.form.get('title'), "desc": request.form.get('desc')})
    return redirect(url_for('admin_dashboard'))

@app.route('/logout')
def logout():
    session.pop('admin', None)
    return redirect(url_for('admin_login'))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6000)

