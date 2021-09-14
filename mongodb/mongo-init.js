db.auth('admin', 'password')

db = db.getSiblingDB('dbsample')

db.createUser(
    {
        user: "mongouser",
        pwd: "password",
        roles: [
            {
                role: "readWrite",
                db: "dbsample"
            }
        ]
    }
);