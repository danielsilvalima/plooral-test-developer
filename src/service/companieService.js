const CompanieRepository = require("../repository/companieRepository")
const companieRepository = new CompanieRepository();
class CompanieService{
  constructor(){
     
  }

  //Lista todas as empresas existentes
  async findAll(){
    const companies = await companieRepository.findAllCompanies();
    return {code: 200, body: companies};
  }

  //Lista empresa existente pelo ID
  async findByID(req){
    const id = req;
    if(!id){
      return {code: 400, body: {message: "All fields are required."}}
    }

    const companies = await companieRepository.findByID(id);

    return {code: 200, body: companies};
  }
}

module.exports = CompanieService;

