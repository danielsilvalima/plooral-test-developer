const JobRepository = require("../repository/jobRepository")
const jobRepository = new JobRepository();
const UploaderFeed = require("../aws/uploaderFeed")
const uploaderFeed = new UploaderFeed();
const sendMessage = require('../aws/sendMessageSQS')
const { SQSClient, GetObjectCommand, SendMessageCommand } = require("@aws-sdk/client-sqs");
class JobService{
  constructor(){
     
  }

  //Lista todos os anuncios
  async findAll(){
    const jobs = await jobRepository.findAllJobs();
    return {code: 200, body: jobs};
  }

  //Insere anuncio novo
  async save(req){
    const {company_id, title, description, location, notes, status} = req;

    if(!company_id || !title || !description ){
      return {code: 400, body: {message: "All fields are required."}}
    }

    const job = await jobRepository.save({company_id, title, description, location, notes, status});

    return {code: 200, body: job};
  }

  //Publica um anuncio de rascunho
  async publishByIDSQS(req){
    const {id} = req;
    if(!id){
      return {code: 400, body: {message: "All fields are required."}}
    }
    
    //Localiza o anuncio pelo ID, retorna ID, titulo e descricao
    const job = await jobRepository.findByPublished(id);
    //Envia o anuncio para a fila SQS
    const {code, body} = await sendMessage.sendMessageSQSAws(job);
    
    return {code: 200, body: 'Draft advertisement published successfully.'};
  }

  //Edita o anuncio pelo ID
  async editByID(reqId, reqBody){
    const {title, description, location} = reqBody;
    const {id} = reqId;
    if(!id || !title || !description){
      return {code: 400, body: {message: "All fields are required."}}
    }

    const jobs = await jobRepository.editByID({id, title, description, location});
    
    return {code: 200, body: jobs};
  }

  //Exclui anuncio pelo ID
  async deleteByID(req){
    const {id} = req;
    if(!id){
      return {code: 400, body: {message: "All fields are required."}}
    }

    const jobs = await jobRepository.deleteByID(id);
    
    return {code: 200, body: jobs};
  }

  //Arquiva anuncio ativo pelo ID
  async archiveByID(req){
    const {id} = req;
    if(!id){
      return {code: 400, body: {message: "All fields are required."}}
    }

    const jobs = await jobRepository.archiveByID(id);
    
    return {code: 200, body: jobs};
  }

  //Lista anuncio publicado pelo ID
  async findByPublished(id){
    const jobs = await jobRepository.findByPublished(id);

    return {code: 200, body: jobs};
  }

  async publishByID(req){
    const {id} = req;
    if(!id){
      return {code: 400, body: {message: "All fields are required."}}
    }

    const jobs = await jobRepository.publishByID(id);
    
    return {code: 200, body: 'Draft advertisement published successfully.'};
  }
}


module.exports = JobService;

