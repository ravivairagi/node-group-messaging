require('dotenv').config();
require('./config/db.connect').connect();
require('./server').app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});