import os
from flask import Flask, render_template, request, redirect, url_for, session
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.secret_key = 'hafida_fenix_secret_2026'

# إعداد مجلد الصور المرفوعة
UPLOAD_FOLDER = 'static/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

profile_info = {
    "name": "حفيظة فينيكس",
    "bio": "كاتبة، ممارسة للوعي وتطوير الذات، وتقدم خدمات إستشارية وإدارية متكاملة في إسبانيا.",
    "avatar_img": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=500&auto=format&fit=crop",
    "banner_img": "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=1000&auto=format&fit=crop"
}

books = [{'title': 'كلنا معجزة – ولادة جديدة من تحت الرماد', 'desc': 'رحلة تأملية في الحياة والتحول والقدرة على النهوض من جديد.'}]
articles = [{'title': 'لماذا نختار الوعي قبل الألم؟', 'content': 'لأننا لا نحتاج دائماً إلى المرور بالألم حتى نستيقظ.'}]
media_items = [{'title': 'مقدمة في رحلة الوعي الذاتي', 'type': 'فيديو', 'url': 'https://youtube.com'}]
bookings = []
ADMIN_PASSWORD = '123'

@app.route('/')
def home():
    return render_template('index.html', profile=profile_info, books=books, articles=articles, media_items=media_items)

@app.route('/book', methods=['POST'])
def book():
    bookings.append({'name': request.form.get('name'), 'contact': request.form.get('contact'), 'service_type': request.form.get('service_type'), 'notes': request.form.get('notes')})
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
    if not session.get('admin'): return redirect(url_for('admin_login'))
    return render_template('admin_dashboard.html', profile=profile_info, books=books, articles=articles, media_items=media_items, bookings=bookings)

@app.route('/update-profile', methods=['POST'])
def update_profile():
    if session.get('admin'):
        profile_info['name'] = request.form.get('name')
        profile_info['bio'] = request.form.get('bio')
        
        # معالجة رفع الصورة الشخصية من الجهاز
        avatar_file = request.files.get('avatar_file')
        if avatar_file and avatar_file.filename != '':
            filename = secure_filename(avatar_file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            avatar_file.save(filepath)
            profile_info['avatar_img'] = '/' + filepath

        # معالجة رفع صورة الغلاف من الجهاز
        banner_file = request.files.get('banner_file')
        if banner_file and banner_file.filename != '':
            filename = secure_filename(banner_file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            banner_file.save(filepath)
            profile_info['banner_img'] = '/' + filepath

    return redirect(url_for('admin_dashboard'))

@app.route('/add-book', methods=['POST'])
def add_book():
    if session.get('admin'): books.append({'title': request.form.get('title'), 'desc': request.form.get('desc')})
    return redirect(url_for('admin_dashboard'))

@app.route('/add-article', methods=['POST'])
def add_article():
    if session.get('admin'): articles.append({'title': request.form.get('title'), 'content': request.form.get('content')})
    return redirect(url_for('admin_dashboard'))

@app.route('/add-media', methods=['POST'])
def add_media():
    if session.get('admin'): media_items.append({'title': request.form.get('title'), 'type': request.form.get('type'), 'url': request.form.get('url')})
    return redirect(url_for('admin_dashboard'))

@app.route('/logout')
def logout():
    session.pop('admin', None)
    return redirect(url_for('admin_login'))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)
