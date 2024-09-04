const https = require('https');
const cheerio = require('cheerio');  // For parsing HTML
const url = require('url');

// Function to get the size of an image
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
function getPageSize(siteUrl) {
  return new Promise((resolve, reject) => {
    https.get(siteUrl, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', async () => {
        let sizeInBytes = Buffer.byteLength(data);
        let sizeInKb = sizeInBytes / (1024 * 1024);

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
        let totalSizeInKB = (totalImageSize.toFixed(2))/1000;
        console.log(`Web sitesinin içeriği boyutu: ${totalSizeInKB} KB`);
        resolve(totalSizeInKB);
      });
    }).on('error', (e) => {
      reject(e);
    });
  });
}

module.exports = { getPageSize, getSizeOfImage };
