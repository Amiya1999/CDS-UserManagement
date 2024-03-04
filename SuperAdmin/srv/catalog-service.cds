namespace superadmin;
using from '../db/schema'; // Assuming the path is correctly referencing the schema definition file

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
service promote{
    entity Promote as projection on superadmin.User;
}
service getToken{
    entity Token as projection on superadmin.User;
}