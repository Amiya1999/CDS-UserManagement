namespace superadmin;
using from '../db/schema'; 
service CatalogService {
    entity User as projection on superadmin.User;
};
service login {
    entity LoginUser as projection on superadmin.User;
};

service terminal{
    entity Terminal as projection on superadmin.User;
}
service delete{
     
    entity Delete as projection on superadmin.User;
}
service getToken{
    entity Token as projection on superadmin.User;
}
service roles{
    entity Roles as projection on superadmin.Role;
}
service UserRoles {
entity UserRole as projection on superadmin.UserRole;
entity AssignRoles as projection on superadmin.UserRole;
entity GetRoles as projection on superadmin.UserRole;
}