const crypto = require("crypto");

//encode password
const encodePW = (pw) => {
  return crypto.createHmac("sha256", "secret key").update(pw).digest("hex");
};

module.exports = { encodePW };
