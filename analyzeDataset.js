var queries = require("./queries.js");


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

// const regex = /[a-zA-Z0-9]+/g;

// str = 'hello world, my name is john';
// for (const s of str.matchAll(regex)){
//     console.log(s[0]);
// }
// console.log(str.matchAll(regex));
// summarizeKeyword('tableaccessories').then(ans => {

//     var items = Object.keys(ans).map(function(key) {
//         return [key, ans[key]];
//       });
      
//       // Sort the array based on the second element
//       items.sort(function(first, second) {
//         return second[1] - first[1];
//       });
      
//       // Create a new array with only the first 5 items
//       console.log(items.slice(0, 50));
// })

module.exports = {
    summarizeKeyword
}