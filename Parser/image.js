const axios = require('axios');
const cheerio = require('cheerio');
const { sql, poolPromise } = require('../db/dbConnect.js');

const altTextMissingImages = [];
async function analyzeImages(url) {
  try {
    
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    
    const images = $('img');
    let totalimages=images.length;
  
    let missingCount = 0;

  
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      
      const altText = $(img).attr('alt') || 'Alt text missing';

     
      if (altText === 'Alt text missing') {
        
        missingCount++;
        if (!altTextMissingImages.includes($(img).attr('src'))) {
          altTextMissingImages.push($(img).attr('src'));
      }
      
      }
    }

    
    const connection = await poolPromise;

    const query = `
    INSERT INTO Imagee (altTextMissingCount, Url,totalImages)
    VALUES (?, ?,?)`;
    const params = [missingCount, url,totalimages];

  
    return new Promise((resolve, reject) => {
      connection.query(query, params, (err, result) => {
        if (err) {
          console.error('Error inserting data:', err);
          return reject(err);
        }
        console.log('Data inserted successfully');
        resolve({
          missingCount,
          url,
          altTextMissingImages,
          totalimages
        });
      });
    });

  } catch (error) {
    console.error('Error fetching the webpage:', error);
    throw error;
  }
}

module.exports = { analyzeImages };
