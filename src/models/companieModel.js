const {v4: UUIDV4} = require("uuid");

class Companie{
  constructor({id, name, created_at, updated_at}){
    this.id = id ?? UUIDV4();
    this.name = name;
    this.created_at = new Date(created_at);
    this.updated_at = new Date(updated_at);
  }
}

module.exports = Companie;

