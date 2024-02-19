const axios = require('axios');
require('dotenv').config({
    override: true,
    path:  '.env',
    //debug: true,
    encoding: 'utf-8'
  });

  //async function moderatorMessage(message){
    const token = process.env.TOKEN_MODERATOR;
    
    const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
    }
    const send = async (message) => {
    try {
        const resp = await axios.post('https://api.openai.com/v1/moderations', {"input": JSON.stringify(message)}, {headers: headers}  );
        console.log(resp.data);
        const result = resp.data;
        if(result){
            const {results} = result;
            const {flagged} = results[0];
            if(flagged){
                return {code: 200, body: true};
            }else{
                return {code: 200, body: false};
            }
        }
    } catch (err) {
        // Handle Error Here
        console.error(err);
        return {code: 500, body: error};
    }
};
    /*axios.post('https://api.openai.com/v1/moderations', {
        "input": JSON.stringify(message),                        
    },{
        headers: headers 
    })
    .then((res) => {
        const result = res.data;
        if(result){
            const {results} = result;
            const {flagged} = results[0];
            if(flagged){
                return {code: 200, body: true};
            }else{
                return {code: 200, body: false};
            }
        }
    })
    .catch((error) => {
        return {code: 500, body: error};
    })*/
//}

module.exports = {send};

