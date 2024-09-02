const axios = require('axios');
const cheerio = require('cheerio');
const { sql, poolPromise } = require('./db/dbConnect.js');

async function analyzeImages(url) {
  try {
    
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    
    const images = $('img');
    let missingCount = 0;

  
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      
      const altText = $(img).attr('alt') || 'Alt text missing';

     
      if (altText === 'Alt text missing') {
        missingCount++;
      }
    }

    
    const connection = await poolPromise;

    const query = `
    INSERT INTO Imagee (altTextMissingCount, Url)
    VALUES (?, ?)`;
    const params = [missingCount, url];

  
    return new Promise((resolve, reject) => {
      connection.query(query, params, (err, result) => {
        if (err) {
          console.error('Error inserting data:', err);
          return reject(err);
        }
        console.log('Data inserted successfully');
        resolve({
          missingCount,
          url
        });
      });
    });

  } catch (error) {
    console.error('Error fetching the webpage:', error);
    throw error;
  }
}

module.exports = { analyzeImages };
