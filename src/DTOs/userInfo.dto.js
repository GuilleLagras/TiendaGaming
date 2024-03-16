export  class DocumentInfo {
    constructor(name, reference, _id) {
      this.name = name;
      this.reference = reference;
      this._id = _id;
    }
  }
  
  export class UserInfoDTO {
    constructor(dni, address, bank) {
      this.dni = dni;
      this.address = address;
      this.bank = bank;
    }
  }