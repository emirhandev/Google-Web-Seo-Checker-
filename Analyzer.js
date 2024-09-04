const fs = require('fs'); 

const getCheckHeader = require('./Analyzer/headerAnalyzer');
const getCheckHeading = require('./Analyzer/headingAnalyzer');
const getCheckImage = require('./Analyzer/imageAnalyzer');
const getCheckLink = require('./Analyzer/linkAnalyzer');
const getCheckMeta = require('./Analyzer/metaAnalyzer');
const getCheckScript = require('./Analyzer/scriptAnalyzer');
const getCheckSize = require('./Analyzer/sizeAnalyzer');
const getCheckStyle = require('./Analyzer/styleAnalyzer');
const getCheckText = require('./Analyzer/textAnalyzer');
const getCheckTime = require('./Analyzer/timeAnalyzer');

async function runAllChecks() {
  try {
    const results = {};

    const [headerCheck, headerData] = await getCheckHeader();
    console.log('Header Check:', headerCheck);
    results.header = { check: headerCheck, data: headerData };

    const [headingCheck, headingData] = await getCheckHeading();
    console.log('Heading Check:', headingCheck);
    results.heading = { check: headingCheck, data: headingData };

    const [imageCheck, imageData] = await getCheckImage();
    console.log('Image Check:', imageCheck);
    results.image = { check: imageCheck, data: imageData };

    const [metaCheck, metaData] = await getCheckMeta();
    console.log('Meta Check:', metaCheck);
    results.meta = { check: metaCheck, data: metaData };

    const [scriptCheck, scriptData] = await getCheckScript();
    console.log('Script Check:', scriptCheck);
    results.script = { check: scriptCheck, data: scriptData };

    const [sizeCheck, sizeData] = await getCheckSize();
    console.log('Size Check:', sizeCheck);
    results.size = { check: sizeCheck, data: sizeData };

    const [styleCheck, styleData] = await getCheckStyle();
    console.log('Style Check:', styleCheck);
    results.style = { check: styleCheck, data: styleData };

    const [timeCheck, timeData] = await getCheckTime();
    console.log('Time Check:', timeCheck);
    results.time = { check: timeCheck, data: timeData };

    const [textCheck,textData] = await getCheckText();
    console.log('Text Check:', textData);
    results.text = { check: textCheck, data: textData };

    const [linkCheck, linkData] = await getCheckLink();
    console.log('Link Check:', linkCheck);
    results.link = { check: linkCheck, data: linkData };

  
    const jsonResults = JSON.stringify(results, null, 2);

   
    fs.writeFileSync('./view/dashboard/results.json', jsonResults);

  } catch (error) {
    console.error('Error:', error);
  }
  console.log("Finished..");
 
}

module.exports = { runAllChecks };
