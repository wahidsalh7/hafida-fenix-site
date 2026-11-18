def add_media():
    if session.get('admin'): media_items.append({'title': request.form.get('title'), 'type': request.form.get('type'), 'url': request.form.get('url')})
    return redirect(url_for('admin_dashboard'))

@app.route('/logout')
def logout():
    session.pop('admin', None)
    return redirect(url_for('admin_login'))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)
EOF

cat << 'EOF' > templates/admin_dashboard.html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8"><title>لوحة التحكم الشاملة</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600&display=swap" rel="stylesheet">
    <style>
        body { background: #0b0f19; color: #fff; font-family: 'Cairo'; padding: 20px; }
        .container { max-width: 850px; margin: 0 auto; }
        .card { background: #1e293b; padding: 20px; border-radius: 12px; margin-bottom: 20px; border: 1px solid #334155; }
        input, textarea, select { width: 100%; padding: 10px; margin: 10px 0; background: #0f172a; border: 1px solid #475569; color: #fff; border-radius: 8px; box-sizing: border-box; font-family: 'Cairo'; }
        button { background: #22c55e; color: #fff; border: none; padding: 10px 20px; font-weight: bold; border-radius: 8px; cursor: pointer; }
        .logout { background: #ef4444; color: #fff; text-decoration: none; padding: 6px 12px; border-radius: 6px; float: left; }
    </style>
</head>
<body>
<div class="container">
    <h1>⚙️ لوحة تحكم الموقع <a href="/logout" class="logout">خروج</a></h1>
    <a href="/" style="color:#38bdf8; display:block; margin-bottom:20px; text-decoration:none;">عرض الموقع 🌐</a>
    
    <!-- تعديل معلومات المالك والصورة الشخصية -->
    <div class="card" style="border: 1px solid #f59e0b;">
        <h3>👤 تعديل السيرة الذاتية، الاسم، والصورة الشخصية</h3>
        <form method="POST" action="/update-profile">
            <label>اسم مالك الموقع:</label>
            <input type="text" name="name" value="{{ profile.name }}" required>
            <label>السيرة الذاتية (Bio):</label>
            <textarea name="bio" rows="3" required>{{ profile.bio }}</textarea>
            <label>رابط الصورة الشخصية (Avatar URL):</label>
            <input type="url" name="avatar_img" value="{{ profile.avatar_img }}" required>
            <label>رابط صورة الغلاف أو الواجهة (Banner URL):</label>
            <input type="url" name="banner_img" value="{{ profile.banner_img }}" required>
            <button type="submit" style="background:#f59e0b; color:#0f172a;">حفظ معلومات الملف الشخصي</button>
        </form>
    </div>

    <div class="card">
        <h3>➕ إضافة كتاب جديد</h3>
        <form method="POST" action="/add-book">
            <input type="text" name="title" placeholder="عنوان الكتاب" required>
            <textarea name="desc" placeholder="وصف الكتاب..." rows="2" required></textarea>
            <button type="submit">إضافة الكتاب</button>
        </form>
    </div>

    <div class="card">
        <h3>✍️ إضافة مقال أو تأمل جديد</h3>
        <form method="POST" action="/add-article">
            <input type="text" name="title" placeholder="عنوان المقال / الفكرة" required>
            <textarea name="content" placeholder="محتوى المقال أو التأمل..." rows="3" required></textarea>
            <button type="submit" style="background:#3b82f6;">نشر المقال</button>
        </form>
    </div>

    <div class="card">
        <h3>🔗 إضافة فيديو أو صورة أو رابط</h3>
        <form method="POST" action="/add-media">
            <input type="text" name="title" placeholder="عنوان الوسيط أو الصورة" required>
            <select name="type">
                <option value="فيديو">فيديو</option>
                <option value="صورة">صورة</option>
                <option value="رابط خارجي">رابط خارجي</option>
            </select>
            <input type="url" name="url" placeholder="رابط الـ URL" required>
            <button type="submit" style="background:#f59e0b; color:#0f172a;">إضافة المحتوى</button>
        </form>
    </div>

    <div class="card">
        <h3>🗓️ طلبات الحجز الواردة</h3>
        {% if bookings %}
            {% for b in bookings %}
                <p style="border-bottom:1px solid #334155; padding-bottom:10px;"><b>الاسم:</b> {{ b.name }} | <b>التواصل:</b> {{ b.contact }}<br><b>الخدمة:</b> {{ b.service_type }} | <b>ملاحظات:</b> {{ b.notes }}</p>
            {% endfor %}
        {% else %}
            <p style="color:#94a3b8;">لا توجد طلبات حجز جديدة حتى الآن.</p>
        {% endif %}
    </div>
</div>
</body>
</html>
EOF

cat << 'EOF' > templates/index.html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ profile.name }} | الموقع الرسمي</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        body { background: #0b0f19; color: #f1f5f9; font-family: 'Cairo', sans-serif; margin: 0; padding: 0; line-height: 1.8; }
        header { background: rgba(15, 23, 42, 0.95); padding: 20px 30px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(245, 158, 11, 0.3); position: sticky; top:0; z-index: 1000; }
        .logo { font-size: 1.4rem; font-weight: 700; color: #f59e0b; }
        .container { max-width: 850px; margin: 0 auto; padding: 30px 20px; }
        
        /* تصميم البانر والبروفایل الفاخر */
        .profile-card {
            background: linear-gradient(135deg, #1e293b, #0f172a);
            border: 2px solid #f59e0b;
            border-radius: 20px;
            padding: 30px 20px;
            text-align: center;
            margin-bottom: 40px;
            box-shadow: 0 15px 35px rgba(245, 158, 11, 0.15);
        }
        .avatar-img {
            width: 110px;
            height: 110px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid #f59e0b;
            margin-bottom: 15px;
            box-shadow: 0 0 20px rgba(245, 158, 11, 0.3);
        }

        .section-title { color: #f59e0b; border-bottom: 1px solid rgba(245, 158, 11, 0.2); padding-bottom: 10px; margin-top: 40px; }
        .card { background: rgba(30, 41, 59, 0.7); padding: 22px; border-radius: 14px; margin-bottom: 20px; border: 1px solid rgba(245, 158, 11, 0.2); }
        .card h3 { color: #38bdf8; margin-top: 0; }
        input, select, textarea { width: 100%; padding: 12px; margin-bottom: 15px; background: #0f172a; border: 1px solid #475569; color: #fff; border-radius: 8px; box-sizing: border-box; font-family: 'Cairo'; }
        button { background: #f59e0b; color: #0f172a; border: none; padding: 12px; font-weight: bold; border-radius: 8px; width: 100%; cursor: pointer; font-family: 'Cairo'; }
    </style>
</head>
<body>
    <header>
        <div class="logo">🔥 {{ profile.name }}</div>
        <div>
            <a href="/" style="color:#fff; text-decoration:none; margin-left:15px;">الرئيسية</a>
            <a href="/admin-login" style="color:#f59e0b; text-decoration:none;">لوحة الأدمن ⚙️</a>
        </div>
    </header>

    <div class="container">
        <!-- كارت التعريف الشخصي والصورة والسيرة الذاتية -->
        <div class="profile-card">
            <img src="{{ profile.avatar_img }}" alt="الصورة الشخصية" class="avatar-img">
            <h1 style="color:#f59e0b; font-size: 2rem; margin: 0 0 10px 0;">{{ profile.name }}</h1>
            <p style="color:#cbd5e1; font-size: 1.05rem; margin: 0 auto; max-width: 650px;">{{ profile.bio }}</p>
        </div>

        <h2 class="section-title">📚 المكتبة والإصدارات</h2>
        {% for book in books %}
        <div class="card">
            <h3>{{ book.title }}</h3>
            <p style="color:#94a3b8;">{{ book.desc }}</p>
        </div>
        {% endfor %}

        <h2 class="section-title">✨ المقالات والتأملات</h2>
        {% for article in articles %}
        <div class="card">
            <h3>{{ article.title }}</h3>
            <p style="color:#94a3b8;">{{ article.content }}</p>
        </div>
        {% endfor %}

        <h2 class="section-title">🎥 الفيديوهات والصور والروابط</h2>
        {% for media in media_items %}
        <div class="card">
            <h3>{{ media.title }}</h3>
            <p style="color:#94a3b8;">النوع: {{ media.type }}</p>
            <a href="{{ media.url }}" target="_blank" style="color:#38bdf8; text-decoration:none;">عرض المحتوى ↗</a>
        </div>
        {% endfor %}

        <h2 class="section-title">🏛️ الخدمات الإدارية في إسبانيا</h2>
        <div class="card">
            <p style="color:#94a3b8;">مساعدة ومواكبة إدارية متكاملة في إسبانيا (هجرة، إقامة، ومعاملات).</p>
        </div>

        <h2 class="section-title">🗓️ حجز موعد أو استشارة</h2>
        <div class="card" style="background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9));">
            <form method="POST" action="/book">
                <input type="text" name="name" placeholder="اسمك الكريم" required>
                <input type="text" name="contact" placeholder="وسيلة التواصل" required>
                <select name="service_type">
                    <option value="استشارة وعي وتطوير ذاتي">استشارة وعي وتطوير ذاتي</option>
                    <option value="خدمات إدارية في إسبانيا">خدمات إدارية في إسبانيا</option>
                </select>
                <textarea name="notes" placeholder="تفاصيل الطلب..." rows="3"></textarea>
                <button type="submit">إرسال طلب الحجز</button>
            </form>
        </div>
    </div>
</body>
</html>
EOF

python3 main.py
mkdir -p static/uploads
cat << 'EOF' > main.py
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
EOF

cat << 'EOF' > templates/admin_dashboard.html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8"><title>لوحة التحكم الشاملة</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600&display=swap" rel="stylesheet">
    <style>
        body { background: #0b0f19; color: #fff; font-family: 'Cairo'; padding: 20px; }
        .container { max-width: 850px; margin: 0 auto; }
        .card { background: #1e293b; padding: 20px; border-radius: 12px; margin-bottom: 20px; border: 1px solid #334155; }
        input, textarea, select { width: 100%; padding: 10px; margin: 10px 0; background: #0f172a; border: 1px solid #475569; color: #fff; border-radius: 8px; box-sizing: border-box; font-family: 'Cairo'; }
        input[type="file"] { background: #1e293b; border: 1px dashed #f59e0b; cursor: pointer; padding: 15px; }
        button { background: #22c55e; color: #fff; border: none; padding: 10px 20px; font-weight: bold; border-radius: 8px; cursor: pointer; }
        .logout { background: #ef4444; color: #fff; text-decoration: none; padding: 6px 12px; border-radius: 6px; float: left; }
    </style>
</head>
<body>
<div class="container">
    <h1>⚙️ لوحة تحكم الموقع <a href="/logout" class="logout">خروج</a></h1>
    <a href="/" style="color:#38bdf8; display:block; margin-bottom:20px; text-decoration:none;">عرض الموقع 🌐</a>
    
    <!-- تعديل الملف الشخصي مع خاصية اختيار الصور من الجهاز -->
    <div class="card" style="border: 1px solid #f59e0b;">
        <h3>👤 تعديل السيرة الذاتية والصور (من ملفات الجهاز)</h3>
        <form method="POST" action="/update-profile" enctype="multipart/form-data">
            <label>اسم مالك الموقع:</label>
            <input type="text" name="name" value="{{ profile.name }}" required>
            
            <label>السيرة الذاتية (Bio):</label>
            <textarea name="bio" rows="3" required>{{ profile.bio }}</textarea>
            
            <label style="color:#f59e0b; font-weight:bold;">📷 اختر الصورة الشخصية من جهازك:</label>
            <input type="file" name="avatar_file" accept="image/*">
            
            <label style="color:#f59e0b; font-weight:bold;">🖼️ اختر صورة الغلاف/الواجهة من جهازك:</label>
            <input type="file" name="banner_file" accept="image/*">
            
            <button type="submit" style="background:#f59e0b; color:#0f172a; margin-top:15px;">حفظ وتحديث الصور والمعلومات</button>
        </form>
    </div>

    <div class="card">
        <h3>➕ إضافة كتاب جديد</h3>
        <form method="POST" action="/add-book">
            <input type="text" name="title" placeholder="عنوان الكتاب" required>
            <textarea name="desc" placeholder="وصف الكتاب..." rows="2" required></textarea>
            <button type="submit">إضافة الكتاب</button>
        </form>
    </div>

    <div class="card">
        <h3>✍️ إضافة مقال أو تأمل جديد</h3>
        <form method="POST" action="/add-article">
            <input type="text" name="title" placeholder="عنوان المقال / الفكرة" required>
            <textarea name="content" placeholder="محتوى المقال أو التأمل..." rows="3" required></textarea>
            <button type="submit" style="background:#3b82f6;">نشر المقال</button>
        </form>
    </div>

    <div class="card">
        <h3>🔗 إضافة فيديو أو صورة أو رابط</h3>
        <form method="POST" action="/add-media">
            <input type="text" name="title" placeholder="عنوان الوسيط أو الصورة" required>
            <select name="type">
                <option value="فيديو">فيديو</option>
                <option value="صورة">صورة</option>
                <option value="رابط خارجي">رابط خارجي</option>
            </select>
            <input type="url" name="url" placeholder="رابط الـ URL" required>
            <button type="submit" style="background:#f59e0b; color:#0f172a;">إضافة المحتوى</button>
        </form>
    </div>

    <div class="card">
        <h3>🗓️ طلبات الحجز الواردة</h3>
        {% if bookings %}
            {% for b in bookings %}
                <p style="border-bottom:1px solid #334155; padding-bottom:10px;"><b>الاسم:</b> {{ b.name }} | <b>التواصل:</b> {{ b.contact }}<br><b>الخدمة:</b> {{ b.service_type }} | <b>ملاحظات:</b> {{ b.notes }}</p>
            {% endfor %}
        {% else %}
            <p style="color:#94a3b8;">لا توجد طلبات حجز جديدة حتى الآن.</p>
        {% endif %}
    </div>
</div>
</body>
</html>
EOF

cat << 'EOF' > templates/index.html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ profile.name }} | الموقع الرسمي</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        body { background: #0b0f19; color: #f1f5f9; font-family: 'Cairo', sans-serif; margin: 0; padding: 0; line-height: 1.8; }
        header { background: rgba(15, 23, 42, 0.95); padding: 20px 30px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(245, 158, 11, 0.3); position: sticky; top:0; z-index: 1000; }
        .logo { font-size: 1.4rem; font-weight: 700; color: #f59e0b; }
        .container { max-width: 850px; margin: 0 auto; padding: 30px 20px; }
        
        .profile-card {
            background: linear-gradient(135deg, #1e293b, #0f172a);
            border: 2px solid #f59e0b;
            border-radius: 20px;
            padding: 30px 20px;
            text-align: center;
            margin-bottom: 40px;
            box-shadow: 0 15px 35px rgba(245, 158, 11, 0.15);
        }
        .avatar-img {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid #f59e0b;
            margin-bottom: 15px;
            box-shadow: 0 0 20px rgba(245, 158, 11, 0.3);
        }

        .section-title { color: #f59e0b; border-bottom: 1px solid rgba(245, 158, 11, 0.2); padding-bottom: 10px; margin-top: 40px; }
        .card { background: rgba(30, 41, 59, 0.7); padding: 22px; border-radius: 14px; margin-bottom: 20px; border: 1px solid rgba(245, 158, 11, 0.2); }
        .card h3 { color: #38bdf8; margin-top: 0; }
        input, select, textarea { width: 100%; padding: 12px; margin-bottom: 15px; background: #0f172a; border: 1px solid #475569; color: #fff; border-radius: 8px; box-sizing: border-box; font-family: 'Cairo'; }
        button { background: #f59e0b; color: #0f172a; border: none; padding: 12px; font-weight: bold; border-radius: 8px; width: 100%; cursor: pointer; font-family: 'Cairo'; }
    </style>
</head>
<body>
    <header>
        <div class="logo">🔥 {{ profile.name }}</div>
        <div>
            <a href="/" style="color:#fff; text-decoration:none; margin-left:15px;">الرئيسية</a>
            <a href="/admin-login" style="color:#f59e0b; text-decoration:none;">لوحة الأدمن ⚙️</a>
        </div>
    </header>

    <div class="container">
        <div class="profile-card">
            <img src="{{ profile.avatar_img }}" alt="الصورة الشخصية" class="avatar-img">
            <h1 style="color:#f59e0b; font-size: 2rem; margin: 0 0 10px 0;">{{ profile.name }}</h1>
            <p style="color:#cbd5e1; font-size: 1.05rem; margin: 0 auto; max-width: 650px;">{{ profile.bio }}</p>
        </div>

        <h2 class="section-title">📚 المكتبة والإصدارات</h2>
        {% for book in books %}
        <div class="card">
            <h3>{{ book.title }}</h3>
            <p style="color:#94a3b8;">{{ book.desc }}</p>
        </div>
        {% endfor %}

        <h2 class="section-title">✨ المقالات والتأملات</h2>
        {% for article in articles %}
        <div class="card">
            <h3>{{ article.title }}</h3>
            <p style="color:#94a3b8;">{{ article.content }}</p>
        </div>
        {% endfor %}

        <h2 class="section-title">🎥 الفيديوهات والصور والروابط</h2>
        {% for media in media_items %}
        <div class="card">
            <h3>{{ media.title }}</h3>
            <p style="color:#94a3b8;">النوع: {{ media.type }}</p>
            <a href="{{ media.url }}" target="_blank" style="color:#38bdf8; text-decoration:none;">عرض المحتوى ↗</a>
        </div>
        {% endfor %}

        <h2 class="section-title">🏛️ الخدمات الإدارية في إسبانيا</h2>
        <div class="card">
            <p style="color:#94a3b8;">مساعدة ومواكبة إدارية متكاملة في إسبانيا (هجرة، إقامة، ومعاملات).</p>
        </div>

        <h2 class="section-title">🗓️ حجز موعد أو استشارة</h2>
        <div class="card" style="background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9));">
            <form method="POST" action="/book">
                <input type="text" name="name" placeholder="اسمك الكريم" required>
                <input type="text" name="contact" placeholder="وسيلة التواصل" required>
                <select name="service_type">
                    <option value="استشارة وعي وتطوير ذاتي">استشارة وعي وتطوير ذاتي</option>
                    <option value="خدمات إدارية في إسبانيا">خدمات إدارية في إسبانيا</option>
                </select>
                <textarea name="notes" placeholder="تفاصيل الطلب..." rows="3"></textarea>
                <button type="submit">إرسال طلب الحجز</button>
            </form>
        </div>
    </div>
</body>
</html>
EOF

python3 main.py
npm install -g localtunnel
lt --port 5002
ssh -R 80:localhost:5002 serveo.net
ssh -R 80:localhost:5002 serveo.net
ssh -p 80 -R0:localhost:5002 pinggy.io
