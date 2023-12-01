console.log("Hello, World!");

const cheerio = require("cheerio");
var queries = require('./queries')
const numbers = "0123456789,";
const _ = require("lodash"); 
require('dotenv').config();
const WebSocket = require('ws');


const alphabet = 'abcdefghijklmnopqrstuvwxyz';
const puppeteer = require('puppeteer-extra')

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

// Add adblocker plugin to block all ads and trackers (saves bandwidth)
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(AdblockerPlugin({ blockTrackers: true }))



async function test(key, cookies, wss, dic, count){

  const objcookies = cookies.split('; ').map(res => res.split(/=(.*)/s).slice(0,2)).map(([name, value]) => ({ name: name, value:value, domain: '.amazon.com', sourceScheme: 'Secure',  sourcePort: 443, httpOnly: false}));
  var keywordcounter = {};

  // const urls = ['a','b','c']
  // var a = 1;
  // for (const url of urls){
  //   setTimeout(()=>{
  //     dic[count] = (a) / urls.length;
  //     console.log(dic);
  //     wss.clients.forEach(function each(client) {
  //                       if (client.readyState === WebSocket.OPEN){
  //                           client.send(JSON.stringify(dic));
  //                       }
  //                   })
  //     a+=1;
  //   },Math.random()*10000)
  // }

  await puppeteer.launch({ headless: process.env.NODE_ENV === 'prod', args:['--no-sandbox'] }).then(async browser => {
    const page = await browser.newPage()
    await page.setViewport({ width: 800, height: 600 })
  
    console.log(`Testing adblocker plugin..`)
    await page.setCookie(...objcookies);
    await page.goto('https://www.amazon.com', {timeout:0})
    // const cc = await page.cookies();
    await page.waitForTimeout(1523)
    console.log('got to amazon')
    try{
      await page.waitForSelector('#twotabsearchtextbox',{timeout:120000});
    }
    catch(e){
      console.log(e);
      const cookies = _.join(
                        _.map(
                          await page.cookies(),
                          ({ name, value }) => _.join([name, value], '='),
                        ),
                        '; ',
                      )
      
      
              
    }
    await page.type('#twotabsearchtextbox', key)
    await page.waitForTimeout(1040);
    await page.keyboard.press('Enter');
    await page.waitForNavigation({ waitUntil: 'load' },{timeout:120000});
    await page.waitForSelector('a[class="a-link-normal s-no-outline"]',{timeout:120000});
    const links = await page.$$('a[class="a-link-normal s-no-outline"]');
    
    // Collect all href attributes of the links.
    const urls = await Promise.all(links.map(link => page.evaluate(el => el.href, link)));
    
    // Loop through each URL and navigate to it.
    var a =1;
    for (const url of urls) {
      // Navigate to the URL.
      try{
        await page.goto(url, { waitUntil: 'load' },{timeout:120000});
        await page.waitForTimeout(300);
      
        // Perform your actions on the new page.
        try{
          await page.waitForSelector('#prodDetails',{timeout:120000});
        }
        catch(e){
          await page.reload();
          await page.waitForSelector('#prodDetails',{timeout:120000});

        }
        const content = await page.content();
        analyzePage(content,key.split(' ').join(''),page.url(),keywordcounter);
      
        // Add a delay if necessary.
      }
      catch(e){
        continue
      }
      dic[count] = ((a)/urls.length);
      wss.clients.forEach(function each(client) {
                    if (client.readyState === WebSocket.OPEN){
                        client.send(JSON.stringify(dic));
                    }
                })
      a+=1;
      
    }
    queries.addKeywordInfo(key, JSON.stringify(keywordcounter));
    

    await browser.close()
  })
}
async function analyzePage(data, sqlkey, href,keywordcounter){
  const $ = cheerio.load(data);
  const name = $('#productTitle').text();
  const reviewsection = $('#averageCustomerReviews');
  const review = isNaN(parseFloat($(reviewsection).find('.a-size-base.a-color-base').text())) ? 0 : parseFloat($(reviewsection).find('.a-size-base.a-color-base').text());
  const numreview = isNaN(parseInt($(reviewsection).find('#acrCustomerReviewText').text().split(' ')[0].split(',').join(''))) ? 0 : parseInt($(reviewsection).find('#acrCustomerReviewText').text().split(' ')[0].split(',').join(''))
  const price = isNaN(
    parseFloat($(".a-price-whole").first().text()) +
    parseFloat("0." + $(".a-price-fraction").first().text())
  ) ? 0 : parseFloat($(".a-price-whole").first().text()) +parseFloat("0." + $(".a-price-fraction").first().text());
  var features;
  for (const z of $('#feature-bullets').find('li'))
  {
    features += $(z).text() + '\n';
  }
  // for (const z of features.replace(/[\W_]+/g, ' ').split(' ')){
  //   if (z.toLowerCase() in keywordcounter){
  //     keywordcounter[z.toLowerCase()] += 1;
  //   }
  //   else{
  //     keywordcounter[z.toLowerCase()] = 1;
  //   }
  // }

  const productdetails = $('#productDetails_techSpec_section_1').find('tbody');
  const pd = {};
  productdetails.find('tr').each((index,element)=>{
    const ky = $(element).find('th').text().replace(/\s/g, '').replace(/[^a-zA-Z0-9]/g, "");
    const val = $(element).find('td').text().replace(/\s/g, '').replace(/[^a-zA-Z0-9]/g, "");
    pd[ky] = val;
  })
  const specs = JSON.stringify(pd);
 
  const dataasin = href.split('/')[5];
  //const dataasin = randomData['ASIN'];
  const desc='';

  const exact = queries.getMostRecent(dataasin).then((result) => {
    if (result){
      if (isdifferent(result, name, price, numreview, review, sqlkey, desc, features, specs)){
        queries.addProduct(name, dataasin, price, numreview, review, sqlkey, href, desc, features, specs);
        console.log('product changed!')
      }
      else{
        console.log('remained the same')
      }
    }
    else{
      queries.addProduct(name, dataasin, price, numreview, review, sqlkey, href, desc, features,  specs);
      console.log('added new product!')
    }
  });
}

async function testing(dic){
  const p1 = await new Promise((res) => setTimeout(()=>{dic[Math.random()] = Math.random(); res('hey');}, 500));
  return;
}
function isdifferent(data1,name, price, numreview, review, keywords, descrip,features,specs){
  if (data1.name == name && 
      data1.price == price && 
      data1.numreview == numreview && 
      data1.review == review && 
      data1.keywords == keywords &&
      data1.descriptions == descrip &&
      data1.features == features //&&
      //data1.specs == specs
      ){

    return false;
  }
  else
  {
    return true;
  }
}
module.exports = {
  test,
  testing
  
}