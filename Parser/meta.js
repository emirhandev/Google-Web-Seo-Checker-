const axios = require('axios');
const cheerio = require('cheerio');
const { sql, poolPromise } = require('./db/dbConnect.js');
async function fetchMetaTags(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const metaTags = {};

        $('meta').each((i, element) => {
            const name = $(element).attr('name');
            const property = $(element).attr('property');
            const content = $(element).attr('content');

            if (name) {
                metaTags[name] = content;
            }
            if (property) {
                metaTags[property] = content;
            }
        });

       
        const title = $('title').text();
        metaTags.title = title;

       
        metaTags.description = $('meta[name="description"]').attr('content') || 'Not provided';
        metaTags.keywords = $('meta[name="keywords"]').attr('content') || 'Not provided';

        
      

        return metaTags;



    } catch (error) {
        console.error('Error fetching meta tags:', error.message);
        return {};
    }
}


async function evaluateMeta(url) {
    try {
        const evaluation = {};
        const metaTags = await fetchMetaTags(url);
        
        const titleLength = metaTags.title ? metaTags.title.length : 0;
        evaluation.titleLength = titleLength;
      
        const descriptionLength = metaTags.description ? metaTags.description.length : 0;
        evaluation.descriptionLength = descriptionLength;
        

        evaluation.keywordsCheck = metaTags.keywords && metaTags.keywords !== 'Not provided' ? 'Present' : 'Missing';

        const connection = await poolPromise;
        const query = `
        INSERT INTO Meta (titleLength,descriptionLength,keywordsCheck,Url)
        VALUES (?, ?, ?, ?)`;
    
        const params = [evaluation.titleLength,evaluation.descriptionLength,evaluation.keywordsCheck, url];
    
        return new Promise((resolve, reject) => {
            connection.query(query, params, (err, result) => {
                if (err) {
                    console.error('Error inserting data:', err);
                    return reject(err);
                }
                console.log('Data inserted successfully');
                resolve({
                    
                    evaluation,url
                   
                });
            });
        });

        return evaluation;
    } catch (error) {
        console.error('Error evaluating SEO:', error.message);
        return {};
    }
}

module.exports = { fetchMetaTags, evaluateMeta };
