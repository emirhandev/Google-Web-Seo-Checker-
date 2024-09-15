const puppeteer = require('puppeteer');
const { sql, poolPromise } = require('../db/dbConnect.js');

async function measurePageLoadTime(url) {
    const browser = await puppeteer.launch({headless: 'shell'});
    
    const page = await browser.newPage();

    const loadTimes = [];
    let total = 0;

    for (let i = 0; i < 5; i++) {
        const startTime = Date.now();

        await page.goto(url, { waitUntil: 'load' });

        const loadTime = Date.now() - startTime;
        console.log(`Page Load Time [Test ${i + 1}]: ${loadTime} ms`);

        loadTimes.push(loadTime);
        total += loadTime;
    }

    const avg = total / loadTimes.length;
    await browser.close();

    try {
        const connection = await poolPromise;
        const query = `INSERT INTO Timee (loadTime, Url) VALUES (?, ?)`;
        const params = [avg, url];

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

        return avg;
    } catch (err) {
        console.error('Error during database operation:', err);
        throw err;
    }
}

module.exports = measurePageLoadTime;