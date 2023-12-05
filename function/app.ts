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
  console.log("started page")

  // Navigate the page to a URL
  await page.goto(event.url);
  console.log("url visited")

  const bodyChildren = await page.$$('body > *');

  console.log(bodyChildren.length)
  let message = await bodyChildren[0].boundingBox();
  console.log(message)
  // page.$eval('body', body => body.children)
  // console.log(await body?.boundingBox())

   // page.close();
   // browser.close();

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/json",
    },
    body:JSON.stringify({message:  message})
  }
};
