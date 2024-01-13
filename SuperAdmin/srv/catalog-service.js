const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
let logEmail;

module.exports = async (srv) => {
  const db = await cds.connect.to({
    kind: 'postgres',
    credentials: {
      "host": "localhost", "port": 5432,
      "user": "postgres",
      "password": "Tathagat@231299",
      "database": "postgres",
      "schemas":"public"
    }
  });

  srv.on('CREATE', 'User', async (req) => {
    try {
      const { username, email, password, role } = req.data;
      const id = uuidv4();
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await db.run(
        INSERT.into('superadmin.User').columns(
          'id', 'username', 'email', 'password', 'role'
        ).values(
          id, username, email, hashedPassword, role
        )
      );
      
      return result;
    } catch (err) {
      console.error('Error registering user:', err);
      throw err;
    }
  });

  srv.on('CREATE', 'LoginUser', async (req) => {
    try {
      const { email, password } = req.data;
  
      const user = await db.run(
        SELECT.from('superadmin_user').where({ email: email })
      );
  
      if (!user || !user[0]) {
        return req.reply({ error: 'User not found' }).code(404);
      }
      logEmail=user[0].email;
  
      const hashedPasswordFromDB = user[0].password;
      const match = await bcrypt.compare(password, hashedPasswordFromDB);
  
      if (match) {
        const token = generateToken(user[0].email);
        console.log(token);
        return req.reply({ token });
      } else {
        return req.reply({ error: 'Incorrect password' }).code(401);
      }
    } catch (err) {
      console.error('Error logging in:', err);
      return req.reply({ error: 'Internal server error' }).code(500);
    }
});
const generateToken = (emailId) => {
  const secretKey='efddfefbjdushjbcrfyudshjcbrefyuchrejf';
  const token = jwt.sign({ emailId }, secretKey, { expiresIn: '1h' });
  return token;
};

srv.on('READ', 'Terminal', async (req) => {
  try {
    const users = await db.run(
      SELECT.from('superadmin_user')
    );
    console.log(users);
    return users;
  } catch (err) {
    console.error('Error fetching users:', err);
    return req.error({ error: 'Internal server error' }).code(500);
  }
});
srv.on('DELETE', 'Delete', async (req) => {
  try {
    const { email} = req.data;
    const result = await db.run(
      DELETE.from('superadmin_user').where({ email: email })
    );
    return true;
  } catch (err) {
    console.error('Error deleting user:', err);
    return req.error({ error: 'Internal server error' }).code(500);
  }
});
srv.on('UPDATE', 'Promote', async (req) => {
  try {
    const { email } = req.data;
    const result = await db.run(
      UPDATE('superadmin_user').set({ role: 'co-leader' }).where({ email: email })
    );
    return result;
  } catch (err) {
    console.error('Error promoting user:', err);
    return req.error({ error: 'Internal server error' }).code(500);
  }
});
srv.on('READ', 'Token', async (req) => {
  try {
    const users = await db.run(
      SELECT.from('superadmin_user')
    );

    let token; 
    users.forEach(user => {
      if (user.email === logEmail) {
        console.log('User Email:', user.email);
        token = generateToken(user.email);
        } 
    });
    console.log(token);
    return token;
  } catch (err) {
    console.error('Error fetching users:', err);
    return req.error({ error: 'Internal server error' }).code(500);
  }
});
};

