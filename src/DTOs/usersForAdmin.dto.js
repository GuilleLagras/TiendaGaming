export default class UserInfoForAdminDTO {
    constructor(user) {
      this._id = user._id;  
      this.name = user.name|| user.Usuario,
      this.email = user.email;
      this.role = user.role;
    }
  }