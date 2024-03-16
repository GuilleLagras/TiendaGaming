import { faker } from "@faker-js/faker";

export default class UserReqDTO {
  constructor(user) {
      this._id = user._id;
      this.name = `${user.first_name} ${user.last_name}`;
      this.email = user.email;
      this.Usuario = user.Usuario;
      this.password = user.password;
      this.isGithub = user.isGithub || false;
      this.role = user.role || 'User';
      this.age = user.age;
      this.orders = []; 
      this.last_connection = null;
      this.avatar = faker.image.avatar(); 
    }
}


  
  

  