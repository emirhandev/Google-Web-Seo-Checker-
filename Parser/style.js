const axios = require('axios');
const cheerio = require('cheerio');
const { sql, poolPromise } = require('../db/dbConnect.js');
async function analyzeStyle(url) {
    try {
     
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

      
        let internalStyles = [];
        let externalStyles = [];
        
      
        $('style').each((i, elem) => {
            internalStyles.push($(elem).html());
        });

        $('link[rel="stylesheet"]').each((i, elem) => {
            externalStyles.push($(elem).attr('href'));
        });
        let internalStylesCount =internalStyles.length;
        let externalStylesCount =externalStyles.length;
        const externalStyleAdress = externalStyles.join(',');

        const connection = await poolPromise;
  const query = `
  INSERT INTO Style (internalStylesCount, externalStylesCount, externalStyleAdress,Url)
  VALUES (?,?,?,?)`;



const params = [internalStylesCount,externalStylesCount,externalStyleAdress,url];
return new Promise((resolve, reject) => {
  connection.query(query, params, (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      return reject(err);
    }
    console.log('Data inserted successfully');
    resolve({
        internalStylesCount,
        externalStylesCount,
        externalStyleAdress:externalStyles
        ,url
    });
  });
});
        












        

   
        return {
            internalStylesCount: internalStyles.length,
            externalStylesCount: externalStyles.length,
            externalStyles: externalStyles
        };
    } catch (error) {
        console.error(`Bir hata oluştu: ${error.message}`);
        return null; 
    }
}

module.exports = analyzeStyle;