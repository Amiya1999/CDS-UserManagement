const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
let logID;
let token1;

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
      const { username, email, password } = req.data;
      const id = uuidv4();
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await db.run(
        INSERT.into('superadmin.User').columns(
          'id', 'username', 'email', 'password'
        ).values(
          id, username, email, hashedPassword
        )
      );
      
      return result;
    } catch (err) {
      console.error('Error registering user:', err);
      throw err;
    }
  });

  srv.on('CREATE', 'LoginUser', async (req,res) => {
    console.log(res);
    try {
      const { email:email, password:password } = req.data;
  
      const user = await db.run(
        SELECT.from('superadmin_user').where({ email: email })
      );
      console.log(user);
  
      if (!user || !user[0]) {
        return req.reply({ error: 'User not found' }).code(404);
      }
      logID=user[0].id;
  
      const hashedPasswordFromDB = user[0].password;
      const match = await bcrypt.compare(password, hashedPasswordFromDB);
  
      if (match) {
        const token = generateToken(user.id);
      
        return req.reply({ token });
      
      } else {
        return req.reply({ error: 'Incorrect password' }).code(401);
      }
    } catch (err) {
      console.error('Error logging in:', err);
      return req.reply({ error: 'Internal server error' }).code(500);
    }
});
const generateToken = (logID) => {
  const secretKey='efddfefbjdushjbcrfyudshjcbrefyuchrejf';
  const token = jwt.sign({ logID }, secretKey, { expiresIn: '1h' });
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
    const { id} = req.data;
    const result = await db.run(
      DELETE.from('superadmin_user').where({ id: id})
    );
    return true;
  } catch (err) {
    console.error('Error deleting user:', err);
    return req.error({ error: 'Internal server error' }).code(500);
  }
});
srv.get('READ', 'Token', async (req) => {
  try {
    const users = await db.run(
      SELECT.from('superadmin_user')
    );

    let token; 
    console.log(logID);
    users.forEach(user => {
      console.log(user);
      if (user.id === logID) {
        console.log('UserID:', logID);
        token = generateToken(logID);
        } else{
          console.log('no user found');
        }
    });
    console.log(token);
    return {token};
  } catch (err) {
    console.error('Error fetching users:', err);
    return req.error({ error: 'Internal server error' }).code(500);
  }
});

srv.on('READ','UserRole',async(req)=>{
  try {
    const UserRole = await db.run(
      SELECT.from('superadmin_userrole')
    );
    console.log(UserRole);
    return UserRole;
  } catch (err) {
    console.error('Error fetching users:', err);
    return req.error({ error: 'Internal server error' }).code(500);
  }
});
srv.on('CREATE', 'AssignRoles', async (req) => {
  try {
    const id = uuidv4();
    const {user_id :user_id,role_id:role_id } = req.data;
    
    const result = await db.run(
      INSERT.into('superadmin_UserRole').columns('id','user_id', 'role_id').values(id,user_id, role_id)
    );
    console.log(result);
    return result;
  } catch (err) {
    console.error('Error handling AssignRoles:', err);
    return req.error({ error: 'Internal server error' }).code(500);
  }
});

srv.on('READ','Roles',async(req)=>{
  try {
    const Roles = await db.run(
      SELECT.from('superadmin_role')
    );
    console.log(Roles);
    return Roles;
  } catch (err) {
    console.error('Error fetching users:', err);
    return req.error({ error: 'Internal server error' }).code(500);
  }
})

};

