<!-- const { User } = require('@sap/cds/common');
const bcrypt = require('bcrypt');

module.exports = async (srv) => {
  // CREATE user
  srv.on('CREATE', 'User', async (req) => {
    const { username, email, password, role } = req.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    return newUser;
  });

  // UPDATE user
  srv.on('UPDATE', 'User', async (req) => {
    const { username, email, role } = req.data;
    const userID = req.data.ID;

    const updatedUser = await User.update(userID, {
      username,
      email,
      role,
    });

    return updatedUser;
  });

  // DELETE user
  srv.on('DELETE', 'User', async (req) => {
    const userID = req.data.ID;

    await User.delete(userID);

    return { success: true };
  });

  // Authorization middleware for UPDATE and DELETE
  srv.before(['UPDATE', 'DELETE'], 'User', async (req) => {
    const requestingUser = req.user; // Assuming user info is available in the request

    if (requestingUser.role !== 'superadmin') {
      return req.reject(403, 'Unauthorized');
    }
  });
}; -->