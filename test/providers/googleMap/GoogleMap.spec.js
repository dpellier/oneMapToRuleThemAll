const startServer = require('../../commons/server').startServer;
const fs = require('fs');
const {promisify} = require("util");

const unlinkFile = promisify(fs.unlink);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);


let server;

beforeAll(async () => {
    await processTemplateFile();
    server = await startServer(`${__dirname}/test_content`);

});

afterAll(async () => {
    // do not stop server for debugging purposes
    if ('true' !== process.env.DO_NOT_STOP_SERVER) {
        await unlinkFile(jsFile);
        if (server) {
            await server.stop();
        }
    }
});

/*
NOTICE: in order to run successfully this test, you MUST define environment variable GOOGLE_MAPS_API_KEY.
It's value MUST be a valid google maps api key
*/

describe(
    'google maps test',
    () => {
        it('should find expected label', async () => {

            // GIVEN
            await page.goto(`http://localhost:8000/index.html`);

            // WHEN
            // click on dismiss button to clean warning message due to google map api
            await clickOnElement(page, 'button[class=dismissButton]');
            // need to click 2 times on cluster to find expected labels
            await clickOnElement(page, 'div[class=cluster]');
            await clickOnElement(page, 'div[class=cluster]');

            // THEN
            await hasDivWithTextAndClass(page, 'MARIE-LAURE ESTHETIQUE', 'map-custom-label');
            await hasDivWithTextAndClass(page, 'Test Chambéry', 'map-custom-label');
            await hasDivWithTextAndClass(page, 'institut dépositaire test chambéry', 'map-custom-label');

        });
    }
);


// templating stuff
const jsTemplateFile = `${__dirname}/test_content/map.js.tst_template`;
const jsFile = jsTemplateFile.replace('.tst_template','');

async function processTemplateFile() {
    // takes template file content and replace <YOUR_API_KEY> string by the env variable that contain
    // the API key. Then the result is written in a js file
    // @see README.md in this directory
    const content = await readFile(jsTemplateFile, 'utf-8');
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const jsContent = content.replace('<YOUR_API_KEY>', apiKey);
    await writeFile(jsFile, jsContent);
}

// utility functions
async function clickOnElement(page, selector) {
    await (await page.waitFor(selector)).click();
}

async function hasDivWithTextAndClass(page, text, cssClass) {
    const div = await page.waitFor(`//div[contains(., '${text}') and contains(@class, '${cssClass}')]`);
    expect(div).toBeDefined();
}
