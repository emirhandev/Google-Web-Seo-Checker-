const https = require('https');
const cheerio = require('cheerio');
const url = require('url');
const { sql, poolPromise } = require('./db/dbConnect.js');

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

function getPageSize(siteUrl) {
  return new Promise((resolve, reject) => {
    https.get(siteUrl, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', async () => {
        let sizeInBytes = Buffer.byteLength(data);
        let sizeInMB = sizeInBytes / (1024 * 1024);

        const $ = cheerio.load(data);
        const imageUrls = [];
        $('img').each((i, img) => {
          let imgUrl = $(img).attr('src');
          if (imgUrl) {
            imgUrl = url.resolve(siteUrl, imgUrl);
            imageUrls.push(imgUrl);
          }
        });

        let totalImageSize = 0;
        try {
          for (const imgUrl of imageUrls) {
            const imgSize = await getSizeOfImage(imgUrl);
            totalImageSize += imgSize;
          }
        } catch (e) {
          console.error(`Error fetching image: ${e.message}`);
        }

        totalImageSize += sizeInBytes;
        let totalSizeInMB = (totalImageSize / (1024 * 1024)).toFixed(5);

        try {
          const connection = await poolPromise;
          const query = 
            `INSERT INTO Size (Size, Url)
            VALUES (?, ?)`
          ;
          const params = [totalSizeInMB, siteUrl];

          connection.query(query, params, (err, result) => {
            if (err) {
              console.error('Error inserting data:', err);
              reject(err);
            } else {
              console.log('Data inserted successfully');
              resolve(totalSizeInMB);
            }
          });
        } catch (dbError) {
          console.error('Database error:', dbError);
          reject(dbError);
        }
      });
    }).on('error', (e) => {
      reject(e);
    });
  });
}

module.exports = { getPageSize, getSizeOfImage };