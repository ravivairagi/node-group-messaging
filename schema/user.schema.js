const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, unique : true, required : true },
    password: { type: String, unique : true, required : true },
    isAdmin: { type: Boolean, default: false },
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
});

const User = mongoose.model('User', userSchema);

// Add new user
exports.add = async (data) => {

    const { username, password, isAdmin } = data;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password.toString(), 10);

    // Create a new user
    const user = new User({
        username,
        password: hashedPassword,
        isAdmin,
    });

    // Save the user to the database
    return user.save();
}

// Get user details
exports.get = (query) => {
    return User.findOne(query);
};

// Get users list
exports.list = async (isAdmin, userId) => {
    let query = { _id: { $ne: userId}};
    !isAdmin && (query['isAdmin'] = false);
    return User.find(query, { _id: 1, username: 1, isAdmin: 1 })
};

// Update user
exports.update = async (userId, data) => {
    data.password && (data.password = await bcrypt.hash(password.toString(), 10))
    return User.updateOne({_id: userId }, data);
}
