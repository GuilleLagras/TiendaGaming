export default class UserResDTO {
    constructor(user) {
      this._id = user._id;
      this.name = user.name
      this.Usuario = user.Usuario;
      this.isGithub = user.isGithub;
      this.cartId = user.cartId;
      this.email = user.email;
      this.role = user.role;
      this.orders = user.orders;
      this.last_connection= user.last_connection;
      this.avatar=user.avatar
    }
  }
  