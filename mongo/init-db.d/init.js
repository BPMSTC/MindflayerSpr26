db = db.getSiblingDB('catmon_db');

db.createCollection('users');
db.createCollection('stories');
db.createCollection('storynodes');

db.users.createIndex({ username: 1 }, { unique: true });
db.stories.createIndex({ author: 1 });
db.stories.createIndex({ isPublished: 1 });
db.storynodes.createIndex({ storyId: 1 });
