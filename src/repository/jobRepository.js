const db = require("../config/db");
const Job = require("../models/jobModel");

class JobRepository{
  constructor(){
    this.db = db;
  }

  async findAllJobs(){
    const storedJob = await this.db.manyOrNone('SELECT * FROM jobs');
    
    return storedJob.map(job => new Job(job)) ;
  }

  async save({company_id, title, description, location, notes, status}){
    const job = new Job({company_id, title, description, location, notes, status});

    await this.db.none("INSERT INTO jobs(company_id, title, description, location, notes, status) VALUES ($1, $2, $3, $4, $5, $6)",[
        job.company_id, job.title, job.description, job.location, job.notes, job.status
    ]);

    return {message: "Job created successfully."};
  }

  async publishByID(id){
    //Verifica se o anuncio existe
    const overLapping = (await this.findAllJobs()).find((job) =>{
      return (
        job.id === id
      )
    })
    if(!overLapping){//Caso nao exista, retorna negativa
      return {message: 'The ad does not exist'};
    }

    const storedJob = await this.db.none('UPDATE jobs SET status = $1, updated_at = NOW() WHERE id = $2', [
      "published",
      id
    ]);
    
    return {message: "Draft advertisement published successfully."};
  }

  async editByID({id, title, description, location}){
    const newJob = new Job({id, title, description, location});

    //Verifica se o anuncio existe
    const overLapping = (await this.findAllJobs()).find((job) =>{
      return (
        job.id === id
      )
    })
    if(!overLapping){//Caso nao exista, retorna negativa
      return {message: 'The ad does not exist'};
    }

    const storedJob = await this.db.none('UPDATE jobs SET title = $1, description = $2, location = $3, updated_at = NOW() WHERE id = $4', [
      newJob.title,
      newJob.description,
      newJob.location,
      newJob.id
    ]);
    
    return {message: "Ad draft updated successfully."};
  }

  async deleteByID(id){
    //Verifica se o anuncio existe
    const overLapping = (await this.findAllJobs()).find((job) =>{
      return (
        job.id === id
      )
    })
    if(!overLapping){//Caso nao exista, retorna negativa
      return {message: 'The ad does not exist'};
    }
    
    const storedJob = await this.db.none('DELETE FROM jobs WHERE id = $1', [
      id
    ]);
    
    return {message: "Ad draft successfully deleted."};
  }

  async archiveByID(id){
    //Verifica se o anuncio existe
    const overLapping = (await this.findAllJobs()).find((job) =>{
      return (
        job.id === id &&
        job.status === 'published'
      )
    })
    if(!overLapping){//Caso nao exista, retorna negativa
      return {message: 'The ad does not exist or is inactive'};
    }

    const storedJob = await this.db.none('UPDATE jobs SET status = $1, updated_at = NOW() WHERE id = $2', [
      "archived",
      id
    ]);
    
    return {message: "The ad successfully archived."};
  }

  async archiveByIDInappropriate(id, notes){
    //Verifica se o anuncio existe
    const overLapping = (await this.findAllJobs()).find((job) =>{
      return (
        job.id === id
      )
    })
    if(!overLapping){//Caso nao exista, retorna negativa
      return {message: 'The ad does not exist or is inactive'};
    }

    const storedJob = await this.db.none('UPDATE jobs SET status = $1, updated_at = NOW(), notes = $2 WHERE id = $3', [
      "archived",
      "Ad with inappropriate content",
      id
    ]);
    
    return {message: "The ad successfully archived."};
  }

  async findByPublished(id){
    const storedJob = await this.db.manyOrNone('SELECT id, title, description FROM jobs WHERE id = $1',[
      id,
    ]);
    
    return storedJob ;
  }

  async findByID(id){
    //Verifica se o anuncio existe
    const overLapping = (await this.findAllJobs()).find((jobOver) =>{
      return (
        jobOver.id === id
      )
    })
    if(!overLapping){//Caso nao exista, retorna negativa
      return {message: 'The job does not exist'};
    }
    
    return overLapping;
  }

  async findByPublication(){
    const storedJob = await this.db.manyOrNone('SELECT id, title, description FROM jobs WHERE status = $1',[
      "published",
    ]);
    
    //return storedJob.map(job => new Job(job)) ;
    return storedJob ;
  }
}

module.exports = JobRepository

