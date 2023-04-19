const bcrypt = require("bcrypt");

async function passwordHash(password) {
  const salt = await bcrypt.genSalt(3);
  return (password = await bcrypt.hash(password, salt));
}

export { passwordHash };
