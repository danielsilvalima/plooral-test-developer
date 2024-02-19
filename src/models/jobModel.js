const {v4: UUIDV4} = require("uuid");

class Job{
  constructor({id, company_id, title, description, location, notes, status, created_at, updated_at}){
    this.id = id ?? UUIDV4();
    this.company_id = company_id;
    this.title = title;
    this.description = description;
    this.location = location;
    this.notes = notes;
    this.status = status;
    this.created_at = new Date(created_at);
    this.updated_at = new Date(updated_at);
  }
}

module.exports = Job;

