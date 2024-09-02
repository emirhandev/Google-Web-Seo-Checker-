const axios = require('axios');
const cheerio = require('cheerio');
const { sql, poolPromise } = require('./db/dbConnect.js');

async function fetchHeadingData(url) {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const h1 = $('h1').length;
    const h2 = $('h2').length;
    const h3 = $('h3').length;
    const h4 = $('h4').length;
    const h5 = $('h5').length;

    const connection = await poolPromise;

    const query = `
      INSERT INTO Heading (H1, H2, H3, H4, H5, Url)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [h1, h2, h3, h4, h5, url];

    return new Promise((resolve, reject) => {
      connection.query(query, params, (err, result) => {
        if (err) {
          console.error('Error inserting data:', err);
          return reject(err);
        }
        console.log('Data inserted successfully');
        resolve({
          h1, h2, h3, h4, h5, url
        });
      });
    });

  } catch (error) {
    console.error('An error occurred:', error);
    throw error;
  }
}

module.exports = fetchHeadingData;
