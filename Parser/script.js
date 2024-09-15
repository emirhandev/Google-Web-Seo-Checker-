const axios = require('axios');
const cheerio = require('cheerio');
const { performance } = require('perf_hooks');
const { sql, poolPromise } = require('../db/dbConnect.js');

async function fetchScriptsWithTiming(url) {
    try {
        const start = performance.now();
        
       
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        
        const scripts = [];
        $('script').each((i, elem) => {
            const src = $(elem).attr('src');
            if (src) {
                scripts.push(src);
            } else {
                scripts.push($(elem).html());
            }
        });
        
        const end = performance.now();
        const duration = end - start;
        
    

        const inlineScriptsCount = scripts.filter(script => !script.startsWith('http')).length;
        const connection = await poolPromise;
        const query = `
        INSERT INTO Script (ScriptDuration,inlineScriptsCount,Url)
        VALUES (?, ?, ?)`;
    
        const params = [duration,inlineScriptsCount, url];
    
        return new Promise((resolve, reject) => {
            connection.query(query, params, (err, result) => {
                if (err) {
                    console.error('Error inserting data:', err);
                    return reject(err);
                }
                console.log('Data inserted successfully');
                resolve({
                    duration,inlineScriptsCount,url
                   
                });
            });
        });

        return { duration, inlineScriptsCount };
    } catch (error) {
        console.error('Error fetching the page:', error);
    }
}

module.exports = { fetchScriptsWithTiming };
