from app import app, db, User, Leave

def init_db():
    with app.app_context():
        # Drop all existing tables
        db.drop_all()
        
        # Create all tables
        db.create_all()
        
        # Create admin user
        admin = User(
            username='admin',
            password='admin123',  # We'll implement proper password hashing later
            name='Administrator',
            role='admin'
        )
        
        # Create a test employee
        employee = User(
            username='emp001',
            password='emp123',
            name='John Doe',
            role='employee'
        )
        
        # Add users to session
        db.session.add(admin)
        db.session.add(employee)
        
        # Commit changes
        db.session.commit()
        
        print("Database initialized successfully!")

if __name__ == '__main__':
    init_db()
