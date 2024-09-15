
const puppeteer = require('puppeteer');
const sendEmail = require('./mailer');


async function reportAndMailer() {
    const browser = await puppeteer.launch({ headless: true });
    try {
        const page = await browser.newPage();

        await page.setViewport({ width: 1280, height: 1024 });

        await page.goto('http://127.0.0.1:5500/view/dashboard/dashboard.html', {
            waitUntil: ['load', 'domcontentloaded', 'networkidle2'],
        });

        await page.waitForSelector('#headingChart', { visible: true });

        await page.screenshot({
            type: 'png',
            path: 'Reporter/report.png',
            fullPage: true,
        });

        console.log('Report is created.');
        await sendEmail('1emirhanonder@gmail.com');
    } catch (e) {
        console.error('Error taking screenshot:', e);
    } finally {
        await browser.close();
    }
}

module.exports= {reportAndMailer};


