const mongoose = require('mongoose');
const User = require('../schema/user.schema');

exports.connect = async() => {
  await mongoose.connect('mongodb://localhost/NodeJsTask', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  //  Create admin user if not exist
  await createAdminUser();
}

async function createAdminUser() {
  try {
    const adminUser = await User.get({ isAdmin: true });
    if (!adminUser) {
      const admin = {
          username: 'admin',
          password: 'admin',
          isAdmin: true
      };
      let r = await User.add(admin);
    }
  } catch (error) {
      console.error('Failed to initialize admin user:', error);
  }
}
