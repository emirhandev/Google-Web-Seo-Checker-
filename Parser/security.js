const axios = require('axios');
const cheerio = require('cheerio');
const { sql, poolPromise } = require('../db/dbConnect.js');

async function checkHttpsLinks(url) {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const links = [];
    
    $('a').each((index, element) => {
      const link = $(element).attr('href');
      if (link) {
        links.push(link);
      }
    });

    const httpsLinks = links.filter(link => link.startsWith('https://'));
    const nonHttpsLinks = links.filter(link => link.startsWith('http://'));

    const httpUrls = nonHttpsLinks.join(',');
    const connection = await poolPromise;
    const query = `
      INSERT INTO Securityy (httpUrl, Url)
      VALUES (?, ?)
    `;
    const params = [httpUrls, url];
    
    await new Promise((resolve, reject) => {
      connection.query(query, params, (err, result) => {
        if (err) {
          console.error('Error inserting data:', err);
          return reject(err);
        }
        console.log('Data inserted successfully');
        resolve(result);
      });
    });

    return nonHttpsLinks;
  } catch (error) {
    console.error('An error occurred:', error);
    throw error;
  }
}

module.exports = { checkHttpsLinks };
