const express = require('express');
const fetchHeadingData = require('./Parser/heading.js');
const {start} = require('./Parser/link.js'); 
const {analyzeImages} = require('./Parser/image.js');
const fetchText = require('./Parser/text.js'); 
const measurePageLoadTime = require('./Parser/time.js'); 
const {getPageSize} = require('./Parser/size.js'); 
const {fetchScriptsWithTiming }= require('./Parser/script.js'); 
const {evaluateMeta} = require('./Parser/meta.js'); 
const { analyzeHeaders, getHeaders } = require('./Parser/header.js');
const analyzeStyle = require('./Parser/style.js');
const  {runAllChecks}  = require('./Analyzer.js');
const path = require('path');
const app = express();
const port = 3000;


app.get('/', (req, res) => {
  const urlParam = req.query.url;
  console.log("URL: "+urlParam)
  let url;
if (urlParam.includes("https://")) {
    url = urlParam;
} else {
    url = "https://" + urlParam;
}
runAllChecks();

app.use(express.static(path.join(__dirname, 'view/dashboard')));



app.get('/heading', async (req, res) => {
    try {
      const dataHeader = await fetchHeadingData(url); 
      res.json(dataHeader); 
    } catch (error) {
      res.status(500).send('An error occurred while fetching heading data');
    }
  });
  app.get('/link', async (req, res) => {
    try {
      const dataLink = await start(url); 
      res.json(dataLink); 
    } catch (error) {
      res.status(500).send('An error occurred while fetching link data');
    }
  });
  app.get('/image', async (req, res) => {
 

    try {
      const imageAnalysis = await analyzeImages(url);
      res.json(imageAnalysis);  
    } catch (error) {
      res.status(500).send('An error occurred while analyzing images');
    }
  });
  
  app.get('/text', async (req, res) => {
    try {
      const dataText = await fetchText(url); 
      res.json(dataText); 
    } catch (error) {
      res.status(500).send('An error occurred while fetching link data');
    }
  });
  
  app.get('/time', async (req, res) => {
    try {
      const dataTime = await measurePageLoadTime(url); 
      res.json(dataTime); 
    } catch (error) {
      res.status(500).send('An error occurred while fetching link data');
    }
  });
  
  app.get('/size', async (req, res) => {
    try {
      const dataSize = await getPageSize(url); 
      res.json(dataSize); 
    } catch (error) {
      res.status(500).send('An error occurred while fetching link data');
    }
  });
  
  app.get('/script', async (req, res) => {
    try {
      const dataScript = await fetchScriptsWithTiming(url); 
  
      res.json(dataScript);
    } catch (error) {
      res.status(500).send('An error occurred while fetching link data');
    }
  });
  
  app.get('/meta', async (req, res) => {
    try {
      const dataMeta = await evaluateMeta(url); 
  
      res.json(dataMeta); 
    } catch (error) {
      res.status(500).send('An error occurred while fetching link data');
    }
  });
  
  app.get('/header', async (req, res) => {
    try {
        const dataHeader = await getHeaders(url);
        res.json(dataHeader);
    } catch (error) {
        res.status(500).send('An error occurred while fetching header data');
    }
  });
  
  app.get('/style', async (req, res) => {
    try {
        const datastyle = await analyzeStyle(url);
        res.json(datastyle);
    } catch (error) {
        res.status(500).send('An error occurred while fetching header data');
    }
  });
});






















app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
