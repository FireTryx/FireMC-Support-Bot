const puppeteer = require('puppeteer');

module.exports = (prompt) => {

    return new Promise(async (resolve, reject) => {

        const browser = await puppeteer.launch(/*{ headless: true }*/);
        const page = await browser.newPage();

        await page.goto('https://chat-app-f2d296.zapier.app/');

        const textBoxSelector = 'textarea[aria-label="chatclient-user-prompt"]';
        await page.waitForSelector(textBoxSelector);
        await page.type(textBoxSelector, prompt);

        await page.keyboard.press('Enter');

        await page.waitForSelector('[data-testid="final-client-response"] p');

        var value = await page.$$eval('[data-testid="final-client-response"]', async (elements) => {
            return elements.map((element) => element.textContent);
        });

        setTimeout(async () => {
            if (value.length == 0) reject('Timeout, unexcepted error');
        }, 30000);

        await browser.close();

        value.shift();
        resolve(value.join('\n\n\n\n'));
        
    });

};