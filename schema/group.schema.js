const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const groupSchema = new Schema({
  name: String,
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [{
    text: String,
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  }],
});

const Group = mongoose.model('Group', groupSchema);

exports.get = (query) => {
  return Group.findOne(query);
};

exports.search = (query) => {
  return Group.find(query);
};

exports.create = (data) => {
  // Create a new group
  const group = new Group({
    name: data.name,
    adminId: data.userId,
    members:[data.userId]
  });

  // Save the group to the database
  return group.save();
}

exports.delete = (query) => {
  return Group.deleteOne(query);
};
