const jwt = require("jsonwebtoken");
const errorHandler = require("../utils/error");

const verifyToken = (req, res, next) => {
  const token = req.cookies?.access_token;
  if (!token) return next(errorHandler(401, "Unauthorized - No token provided"));

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return next(errorHandler(401, "Unauthorized - Invalid token"));
    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;