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

db.createCollection('users');

db.users.insert(
 {
    first_name: 'firstname',
    last_name: 'lastname'
  });
