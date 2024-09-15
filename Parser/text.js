const axios = require('axios');
const cheerio = require('cheerio');
const { sql, poolPromise } = require('../db/dbConnect.js');

async function fetchText(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const tags = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'ul', 'ol', 'li', 'a', 'blockquote', 'q', 'em', 'strong'];
    let wordFrequency = {};

    tags.forEach(tag => {
      $(tag).each((i, element) => {
        const text = $(element).text().trim().toLowerCase();

        if (text) {
          const words = text.split(/\s+/);
          words.forEach(word => {
            if (!/^\d/.test(word) && word) {
              wordFrequency[word] = (wordFrequency[word] || 0) + 1;
            }
          });
        }
      });
    });

    const sortedWords = Object.entries(wordFrequency).sort((a, b) => b[1] - a[1]);

    let sortedSlice =sortedWords.slice(0, 20);
    const sortedWordsText = sortedSlice.join(',');
    const connection = await poolPromise;
        const query = `
        INSERT INTO Textt (textFrequency,Url)
        VALUES (?, ?)`;
    
        const params = [sortedWordsText,url];
    
        return new Promise((resolve, reject) => {
            connection.query(query, params, (err, result) => {
                if (err) {
                    console.error('Error inserting data:', err);
                    return reject(err);
                }
                console.log('Data inserted successfully');
                resolve({
                    
                  sortedWordsText,url
                   
                });
            });
        });





    return sortedWordsText;
  } catch (error) {
    console.error('Error fetching the page:', error);
    throw error;
  }
}

module.exports = fetchText;
