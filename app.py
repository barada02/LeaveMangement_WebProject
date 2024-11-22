from flask import Flask, request, jsonify, send_from_directory, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///leave_management.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    name = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'admin' or 'employee'
    leaves = db.relationship('Leave', backref='user', lazy=True)

class Leave(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    reason = db.Column(db.String(200))
    status = db.Column(db.String(20), default='pending')  # pending, approved, rejected
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Routes
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    
    if user and user.password == data['password']:  # Note: We'll implement proper password hashing later
        return jsonify({
            'id': user.id,
            'username': user.username,
            'name': user.name,
            'role': user.role
        })
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/leaves', methods=['GET', 'POST'])
def handle_leaves():
    if request.method == 'POST':
        data = request.json
        new_leave = Leave(
            user_id=data['user_id'],
            start_date=datetime.strptime(data['start_date'], '%Y-%m-%d'),
            end_date=datetime.strptime(data['end_date'], '%Y-%m-%d'),
            reason=data['reason']
        )
        db.session.add(new_leave)
        db.session.commit()
        return jsonify({'message': 'Leave request submitted successfully'})
    
    # GET request - fetch all leaves
    user_id = request.args.get('user_id')
    if user_id:
        leaves = Leave.query.filter_by(user_id=user_id).all()
    else:
        leaves = Leave.query.all()
    
    return jsonify([{
        'id': leave.id,
        'user_id': leave.user_id,
        'start_date': leave.start_date.strftime('%Y-%m-%d'),
        'end_date': leave.end_date.strftime('%Y-%m-%d'),
        'reason': leave.reason,
        'status': leave.status,
        'created_at': leave.created_at.strftime('%Y-%m-%d %H:%M:%S')
    } for leave in leaves])

@app.route('/api/leaves/<int:leave_id>', methods=['PUT'])
def update_leave(leave_id):
    data = request.json
    leave = Leave.query.get_or_404(leave_id)
    leave.status = data['status']
    db.session.commit()
    return jsonify({'message': 'Leave status updated successfully'})

# Serve static files
@app.route('/')
def serve_homepage():
    return send_from_directory('src/homePage', 'homePage.html')

@app.route('/login')
def serve_login():
    return send_from_directory('src/login', 'login.html')

@app.route('/dashboard/admin')
def serve_admin_dashboard():
    return send_from_directory('src/dashboard', 'adminDashboard.html')

@app.route('/dashboard/employee')
def serve_employee_dashboard():
    return send_from_directory('src/dashboard', 'employeeDashboard.html')

# Serve static files from specific directories
@app.route('/homePage/<path:filename>')
def serve_homepage_static(filename):
    return send_from_directory('src/homePage', filename)

@app.route('/login/<path:filename>')
def serve_login_static(filename):
    return send_from_directory('src/login', filename)

@app.route('/dashboard/<path:filename>')
def serve_dashboard_static(filename):
    return send_from_directory('src/dashboard', filename)

# Generic static file handler
@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory('src', filename)

# Error handlers
@app.errorhandler(404)
def not_found_error(error):
    if request.path.startswith('/api/'):
        return jsonify({'error': 'API endpoint not found'}), 404
    return send_from_directory('src/homePage', 'homePage.html')

# Create initial admin user
def create_admin():
    with app.app_context():
        db.create_all()
        admin = User.query.filter_by(username='admin').first()
        if not admin:
            admin = User(
                username='admin',
                password='admin123',  # We'll implement proper password hashing later
                name='Administrator',
                role='admin'
            )
            db.session.add(admin)
            db.session.commit()

if __name__ == '__main__':
    create_admin()
    app.run(debug=True)
