import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

/**
    mongosh --eval "db.adminCommand({ listDatabases: 1 }).databases.forEach(function(d){if (d.name !== 'admin') {db.getSiblingDB(d.name).dropDatabase()}})"
*/
// user schema
const UserSchema = mongoose.Schema({
    username : {type: String, unique: true, required:true},
    password: {type: String, unique:false, required:false},
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Favorite' }],
  });
UserSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', UserSchema);

export default User;
