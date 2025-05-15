import { Handler } from 'aws-lambda';
import puppeteer from 'puppeteer';
import chromium from '@sparticuz/chromium';

export const handler: Handler = async (event, context) => {
  console.log('EVENT: \n' + JSON.stringify(event, null, 2));

  const browser = await puppeteer.launch({
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
    defaultViewport: chromium.defaultViewport,
    protocolTimeout: 320000,
    args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
  });
  console.log("started browser")
  const page = await browser.newPage();
  console.log("opening " + event.url)
  await page.goto(event.url,
    {
      waitUntil: 'networkidle0',
    });

  console.log("url visited")

  await new Promise(resolve => setTimeout(resolve, 2000));

  const bodyChildren = await page.$$('body > *');

  let message = await bodyChildren[0].boundingBox();

  await browser.close();

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/json",
    },
    body:JSON.stringify({message:  message})
  }
};
