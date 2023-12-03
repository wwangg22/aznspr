var queries = require("./queries.js");
const fs = require('fs')

const forbidden = ['and','to','a','for','but','you','on','is','with','your','the','of','can','in','it','this','or','no', '1','2','3','4']


async function summarizeKeyword(keyword){

    const products = await queries.showNonNull(keyword);
    const summary = {};
    const regex = /[a-zA-Z0-9]+/g;
    for (const p of products){
        if (p['features']){
            for (var k of p['features'].matchAll(regex)){
                k = k[0].toLowerCase()
                if (forbidden.includes(k)){
                    console.log(k)
                    continue;
                }
                else{
                    if (k in summary){
                        summary[k] += 1;
                    }
                    else{
                        summary[k] = 1;
                    }
                }
            }

        }

    }

    var items = Object.keys(summary).map(function(key) {
        return [key, summary[key]];
      });
      
      // Sort the array based on the second element
      items.sort(function(first, second) {
        return second[1] - first[1];
      });
      
      // Create a new array with only the first 5 items
    
    return items.slice(0, 15);
}


async function returnFullText(keyword){
    const products = await queries.showNonNull(keyword);
    var gianttext = '';

    for (const p of products){
        gianttext += p['features'].replace(/undefined|[^A-Za-z0-9_.,'" ()\n:;]*/g,'') + '\n';
    }

    fs.writeFile('gianttext.txt', gianttext, function (err) {
        if (err) return console.log(err);
        console.log('Hello World > helloworld.txt');
      }
    );
}

module.exports = {
    summarizeKeyword
}