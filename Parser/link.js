const axios = require('axios');
const cheerio = require('cheerio');
const { URL } = require('url');
const { sql, poolPromise } = require('./db/dbConnect.js');

let baseURL;
const links = new Set();
let brokenLinksCount = 0;
let internalLinks = 0;
let externalLinks = 0;
const brokenLinks = [];

async function checkURL(url) {
  try {
    const response = await axios.get(url);
    return response.status;
  } catch (error) {
    return error.response ? error.response.status : 'Error';
  }
}

function isInternalLink(linkURL) {
  try {
    const linkDomain = new URL(linkURL).hostname;
    return linkDomain === new URL(baseURL).hostname;
  } catch (error) {
    return false;
  }
}

async function fetchLinksData(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const linkPromises = [];

    $('a').each((index, element) => {
      let link = $(element).attr('href');
      if (link) {
        
        link = new URL(link, url).href;

        if (!links.has(link)) {
          links.add(link);
          
          if (isInternalLink(link)) {
            internalLinks++;
          } else {
            externalLinks++;
          }
          
          linkPromises.push(
            checkURL(link).then(status => {
              if (status == 404) {
                console.log(`${link}: ${status} (Broken)`);
                brokenLinks.push(link);
                brokenLinksCount++;
              }
            })
          );
        }
      }
    });

     Promise.all(linkPromises);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

async function start(url) {
  baseURL = url;
  links.add(url);
  await fetchLinksData(url);
  const brokenLinksList = brokenLinks.join(',');
  const connection = await poolPromise;
  const query = `
  INSERT INTO Link (internalLinks, externalLinks, brokenLinksCount,listOfBrokenLinks,Url)
  VALUES (?,?,?,?,?)
`;
const params = [internalLinks,externalLinks,brokenLinksCount,brokenLinksList,url];
return new Promise((resolve, reject) => {
  connection.query(query, params, (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      return reject(err);
    }
    console.log('Data inserted successfully');
    resolve({
      internalLinks,externalLinks,brokenLinksCount,brokenLinksList,url
    });
  });
});






  return { internalLinks, externalLinks, brokenLinksCount, brokenLinks };
}

module.exports = { start, fetchLinksData };