const express = require('express')
const app = express();
const CompanieService  = require('./service/companieService')
const companieService = new CompanieService;
const JobService = require('./service/jobService')
const jobService = new JobService();
const GetFeed = require('./aws/getFeed')
const getFeed = new GetFeed();
app.use(express.json());
const port = 3000;

app.listen(port, () => {
  console.log('Example app listening on port '+port)
})


//Listar empresas existentes.
app.get('/companies', async (req, res) => {
  try{  
    const {code, body} = await companieService.findAll(req);
    res.status(code).send(body);
  }catch(error){
    res.status(500).send(error)
  }
  })


//Listar empresa existente pelo ID.  
app.get('/companies/:id', async (req, res) => {
  try{  
    const {code, body} = await companieService.findByID(req.params);
    res.status(code).send(body);
  }catch(error){
    res.status(500).send(error)
  }
  })


  //Listar anuncios existentes.
app.get('/job', async (req, res) => {
  try{  
    const {code, body} = await jobService.findAll(req);
    res.status(code).send(body);
  }catch(error){
    res.status(500).send(error)
  }
})

  //Criar anuncio
  app.post('/job', async (req, res) => {
    try{
      const { code, body } = await jobService.save(req.body);
      res.status(code).send(body);
    }catch(error){
      res.status(500).send(error)
    }
  })

//Publicar um rascunho de anuncio pelo ID.  
app.put('/job/:id/publish', async (req, res) => {
  try{  
    const {code, body} = await jobService.publishByIDSQS(req.params);
    res.status(code).send(body);
  }catch(error){
    res.status(500).send(error)
  }
})

//Editar um anuncio pelo ID.  
app.put('/job/:id', async (req, res) => {
  try{
    const {code, body} = await jobService.editByID(req.params, req.body);
    res.status(code).send(body);
  }catch(error){
    res.status(500).send(error)
  }
})

//Excluir um anuncio pelo ID.  
app.delete('/job/:id', async (req, res) => {
  try{
    const {code, body} = await jobService.deleteByID(req.params);
    res.status(code).send(body);
  }catch(error){
    res.status(500).send(error)
  }
})

//Arquivar um anuncio ativo pelo ID.  
app.put('/job/:id/archive', async (req, res) => {
  try{  
    const {code, body} = await jobService.archiveByID(req.params);
    res.status(code).send(body);
  }catch(error){
    res.status(500).send(error)
  }
})

//Lista os anuncios mais recentes, disponibilizado pelo S3
app.get('/feed', async function(req, res){
  try{
    const {code, body} = await getFeed.getApiAWS(req);
    res.status(code).send(body);
  }catch(error){
    res.status(500).send(error)
  }
});


