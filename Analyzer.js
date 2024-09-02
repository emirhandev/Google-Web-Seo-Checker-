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
    const [headerCheck, headerData] = await getCheckHeader();
    console.log('Header Check:', headerCheck);

    const [headingCheck, headingData] = await getCheckHeading();
    console.log('Heading Check:', headingCheck);

    const [imageCheck, imageData] = await getCheckImage();
    console.log('Image Check:', imageCheck);

    const [metaCheck, metaData] = await getCheckMeta();
    console.log('Meta Check:', metaCheck);

    const [scriptCheck, scriptData] = await getCheckScript();
    console.log('Script Check:', scriptCheck);

    const [sizeCheck, sizeData] = await getCheckSize();
    console.log('Size Check:', sizeCheck);

    const [styleCheck, styleData] = await getCheckStyle();
    console.log('Style Check:', styleCheck);

    const [timeCheck, timeData] = await getCheckTime();
    console.log('Time Check:', timeCheck);
    const [textData] = await getCheckText();
    console.log('Time Check:', textData);
    const [linkCheck, linkData] = await getCheckLink();
    console.log('Link Check:', linkCheck);

  } catch (error) {
    console.error('Error:', error);
  }
  console.log("Finished..")
}


module.exports = { runAllChecks };
