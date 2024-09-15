const https = require('https');
const cheerio = require('cheerio');  // For parsing HTML
const url = require('url');
const { sql, poolPromise } = require('../db/dbConnect');


function getSizeOfImage(imageUrl) {
  return new Promise((resolve, reject) => {
    https.get(imageUrl, (response) => {
      let size = 0;
      response.on('data', (chunk) => {
        size += chunk.length;
      });
      response.on('end', () => {
        resolve(size);
      });
    }).on('error', (e) => {
      reject(e);
    }); 
  });
}

// Function to get the total size of the page including images
async function getPageSize(siteUrl) {
  try {
    const response = await new Promise((resolve, reject) => {
      https.get(siteUrl, (response) => {
        let data = '';
        response.on('data', (chunk) => {
          data += chunk;
        });
        response.on('end', () => {
          resolve(data);
        });
      }).on('error', (e) => {
        reject(e);
      });
    });

    const sizeInBytes = Buffer.byteLength(response);
    const sizeInKb = sizeInBytes / 1024; 

    const $ = cheerio.load(response);
    const imageUrls = [];
    $('img').each((i, img) => {
      let imgUrl = $(img).attr('src');
      if (imgUrl) {
        imgUrl = url.resolve(siteUrl, imgUrl);
        imageUrls.push(imgUrl);
      }
    });

    let totalImageSize = 0;
    for (const imgUrl of imageUrls) {
      try {
        const imgSize = await getSizeOfImage(imgUrl);
        totalImageSize += imgSize;
      } catch (e) {
        console.error(`Error fetching image: ${e.message}`);
      }
    }

    totalImageSize += sizeInBytes;  
    const totalSizeInKB = (totalImageSize / 1024).toFixed(2); 

    console.log(`Website size: ${totalSizeInKB} KB`);


    const connection = await poolPromise;
    const query = `INSERT INTO Size (Size, Url) VALUES (?, ?)`;
    const params = [totalSizeInKB, siteUrl];

    await new Promise((resolve, reject) => {
      connection.query(query, params, (err, result) => {
        if (err) {
          console.error('Error inserting data:', err);
          reject(err);
        } else {
          console.log('Data inserted successfully');
          resolve(result);
        }
      });
    });

    return totalSizeInKB;

  } catch (err) {
    console.error('Error during page size calculation:', err);
    throw err;
  }
}

module.exports = { getPageSize, getSizeOfImage };
