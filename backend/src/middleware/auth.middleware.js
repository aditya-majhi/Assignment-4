const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  console.log({ authHeader });

  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    console.log({ user });

    req.user = user;
    next();
  });
}

module.exports = { authenticateToken };
