const jwt = require("jsonwebtoken");
const user = require('../schema/user.schema')
const getAuthToken = (req, res, next) => {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      req.authToken = req.headers.authorization.split(" ")[1];
    } else {
      req.authToken = null;
    }
    next();
};

module.exports.isAuthenticate = async (req, res, next) => {
    getAuthToken(req, res, async () => {
      try {
        let decoded = jwt.verify(req.authToken, process.env.JWT_TOKEN_STRING);

        if (decoded._id) {
          let userDetails = await user.get({ _id: decoded._id });
          if (userDetails) {
            req.user = userDetails;
            return next();
          } else {
            throw new Error("Authorized");
          }
        } else {
            throw new Error("Authorized");
        }
      } catch (error) {
        return res
          .status(401)
          .json({ message: "You are not authorized to make this request" });
      }
    });
};

module.exports.isAdmin = (req, res, next) => {
    if(req.user.isAdmin){
        return next();
    }
    return res
        .status(401)
        .json({ message: "You are not authorized to make this request" });

};
