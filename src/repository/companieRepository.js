const db = require("../config/db");
const Companie = require("../models/companieModel");

class CompanieRepository{
  constructor(){
    this.db = db;
  }

  async findAllCompanies(){
    const storedCompanie = await this.db.manyOrNone('SELECT * FROM companies');
    
    return storedCompanie.map(companie => new Companie(companie)) ;
  }

  async findByID(companie){
    //Verifica se a empresa existe
    const overLapping = (await this.findAllCompanies()).find((companieOver) =>{
      return (
        companieOver.id === companie.id
      )
    })
    if(!overLapping){//Caso nao exista, retorna negativa
      return {message: 'The companie does not exist'};
    }

    const storedCompanie = await this.db.manyOrNone('SELECT * FROM companies WHERE id = $1', [
      companie.id
    ]);
    
    return storedCompanie.map(companie => new Companie(companie))  ;
  }

}

module.exports = CompanieRepository

