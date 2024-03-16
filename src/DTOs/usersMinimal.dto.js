export default class UserMinimalDTO {
    constructor(user) {
      this.name = user.name|| user.Usuario,
      this.email = user.email;
      this.role = user.role;
    }
  }