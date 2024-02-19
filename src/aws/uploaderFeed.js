const axios = require('axios');

require('dotenv').config({
    override: true,
    path:  '.env',
    //debug: true,
    encoding: 'utf-8'
  });

class UploaderFeed{
  async sendUploadAws(message){
    try {
      const url = await axios.get(process.env.APIUPLOAD);
      
      const ret = await axios.put(url.data.url, message, {
          headers: {
              Accept: 'application/json',
              //'Content-Type': 'image/jpeg',
              //'Content-Type': 'text/*',
              'Content-Type': 'application/json',
              //'Content-Length': image.length
          },
      });
      return {code: 200, body: true};
    }catch(error){
      console.error('Error:', error);
      return {code: 400, body: {message: error}}
    }
  }

}

module.exports = UploaderFeed;

