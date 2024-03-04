namespace superadmin;



entity User {
  key id       : UUID;
  username     : String(50);
  email     : String(100);
  password     : String(100);
}

entity Role {
  key id:       UUID;
  role         : String(20);
}

entity UserRole{
  key id: UUID;
  user:Association to User;
  role:Association to Role;
}