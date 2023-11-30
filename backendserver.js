const express = require("express");
const app = express();
const server = require("http").createServer(app);
var fs = require("fs");
var queries = require("./queries.js");
var amazon = require("./amazonscraper.js");
var cors = require("cors");
const WebSocket = require("ws");
const bcrypt = require("bcryptjs");
let progress = {};

const corsOptions = {
  origin: true,
  credentials: true,
};

const wss = new WebSocket.Server({ server: server });

wss.on("connection", function connection(ws) {
  console.log("new connection!");
  ws.send("Welcome new Client!");
  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
    ws.send(JSON.stringify(progress));
  });
});

function getCookie(req) {
  const cookies = req.headers.cookie;
  var dictcookies = {};
  if (!cookies) {
    return {};
  }

  for (const a of cookies.split("; ")) {
    const b = a.split("=");
    dictcookies[b[0]] = b[1];
  }

  return dictcookies;
}

function admin(req) {
  const cookies = getCookie(req);
  if (cookies["test"] == "testing") {
    return true;
  } else {
    return false;
  }
}

app.options('*', cors(corsOptions));

app.use(express.json());

app.use((req, res, next) => {
  console.log(req);
  console.log("req received from client");
  console.log(req.method);
  console.log(req.body);
  console.log(req.originalUrl);
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (admin(req)) {
    console.log("cookies accepted!");
    if (req.method == "GET") {
      const request = req.originalUrl.slice(1);
      res.setHeader("Content-Type", "application/json");
      if (Object.keys(req.query).length) {
        console.log("query");
        const dic = req.query;
        console.log(dic);
        if (dic.keywords) {
          queries.findExactKeyword(dic.keywords).then((result) => {
            if (result.length > 0) {
              if (dic.remove === "true") {
                queries.removeKeyword(dic.keywords).then((result) => {
                  console.log("successfully deleted keyword");
                });
              }
            } else {
              if (dic.remove != "true") {
                queries.addKeyword(dic.keywords).then((result) => {
                  console.log("successfully added keyword");
                });
              }
            }
          });
        }

        if (dic.amazon === "true") {
          console.log("go fuck yourself");
          queries.getKeywords().then((result) => {
            runAma(result);
            res.send(JSON.stringify({ response: "success" }));
          });
        }
        if (dic.search) {
          console.log("returning search!");
          console.log(dic.search);
          queries.findExactProduct(dic.search).then((result) => {
            if (result.length > 0) {
              console.log(result[0]["created"]);
              console.log(new Date(result[0]["created"]).toLocaleString());
              res.send(JSON.stringify(result));
              console.log("sent");
            }
          });
        }
      } else {
        if (request == "keywords") {
          res.setHeader("Content-Type", "application/json");
          console.log("keyword files requested!");
          var keywords = { keywords: [] };
          queries.getKeywords().then((result) => {
            for (const b in result) {
              keywords["keywords"].push(result[b].content);
            }
            res.send(JSON.stringify(keywords));
          });
        } else {
          res.setHeader("Content-Type", "application/json");
          console.log(`${request} files requested!`);
          queries.showNonNull(request).then((result) => {
            res.send(JSON.stringify(result));
          });
        }
      }
    } else {
      next();
    }
  } else {
    if (req.method == "POST") {
      res.setHeader("Content-Type", "application/json");
      if (Object.keys(req.headers).length) {
        const dic = req.body;
        if (dic['password']) {
          queries.getPasswords().then((result) => {
            console.log(result);
            if (bcrypt.compareSync(dic['password'], result[0]["pass"])) {
              res.cookie("test", "testing");
              res.send(JSON.stringify({ response: "success" }));
            } else {
              res.send(JSON.stringify({ response: "failure" }));
            }
          });
        }
      }
    }
  }
});
app.post("*", (req, res) => {
  console.log("post request received!");
  //console.log(req.body.Cookie);
  const cookies = req.body.Cookie;
  queries.getKeywords().then((result) => {
    progress = {};
    var count = 0;
    for (const b in result) {
      progress[count] = 0;
      count += 1;
    }
    runAma(result, cookies, progress);
    console.log(progress);
  });
  res.send(JSON.stringify({ response: "success" }));
});
server.listen(3000, () => console.log("Node.js app listening on port 3000."));

async function runAma(keywords, cookies, progress) {
  var ct = 0;
  await keywords.reduce(async (promise, keyword) => {
    // This line will wait for the last async function to finish.
    // The first iteration uses an already resolved Promise
    // so, it will immediately continue.
    await promise;
    const j = await amazon.test(keyword.content, cookies, wss, progress, ct);
    console.log("finished with one!");
    ct += 1;
  }, Promise.resolve());
}
