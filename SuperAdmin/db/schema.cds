namespace superadmin;

entity User {
   ID      : UUID;
  username   : String(50);
  key email      : String(100);
  password   : String(100);
  role       : String(20);
}
