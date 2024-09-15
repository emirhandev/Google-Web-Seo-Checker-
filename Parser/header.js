const axios = require('axios');
const { sql, poolPromise } = require('../db/dbConnect.js');

async function getHeaders(url) {
    try {
        const response = await axios.head(url);
        const headers = response.headers;

        const { missingHeaderInfoCount, missingHeaders } = await analyzeHeaders(headers, url);
        return { missingHeaderInfoCount, missingHeaders };
    } catch (error) {
        console.error(`Error fetching headers from ${url}:`, error.message);
        return { error: error.message };
    }
}

async function analyzeHeaders(headers, url) {
    const importantHeaders = [
        "content-security-policy",
        "strict-transport-security",
        "x-content-type-options",
        "x-frame-options",
        "x-xss-protection",
        "cache-control",
        "expires",
         'etag',
        
    ];

    let missingHeaderInfoCount = 0;
    const missingHeaders = [];

    for (const header of importantHeaders) {
        if (headers[header]) {
           
        } else {
            missingHeaderInfoCount++;
            missingHeaders.push(header);
            console.log(`${header} Missing`);
        }
    }

    
    const missingHeadersString = missingHeaders.join(',');

    
    const connection = await poolPromise;
    const query = `
    INSERT INTO Header (MissingHeaderInfoCount, MissingHeaders, Url)
    VALUES (?, ?, ?)`;

    const params = [missingHeaderInfoCount, missingHeadersString, url];

    return new Promise((resolve, reject) => {
        connection.query(query, params, (err, result) => {
            if (err) {
                console.error('Error inserting data:', err);
                return reject(err);
            }
            console.log('Data inserted successfully');
            resolve({
                missingHeaderInfoCount,
                missingHeaders: missingHeadersString,
                url
            });
        });
    });
}

module.exports = { getHeaders, analyzeHeaders };
