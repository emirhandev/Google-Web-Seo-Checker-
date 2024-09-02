const axios = require('axios');

function getCheckStyle() {
  return axios.get('http://localhost:3000/style')
    .then(response => {
      const data = response.data;
      const check = {};


      if (data.internalStylesCount <= 2) {
          check['internalStatus'] = 'Good';
          check['internalDescription'] = 'There are '+ data.internalStylesCount+' Internal Styles';
      }  else {
          check['internalStatus'] = 'Bad';
          check['internalDescription'] = 'There are more than two internal styles';
      }
      if (data.externalStylesCount <= 2) {
        check['externalStatus'] = 'Good';
        check['externalDescription'] = 'There are '+ data.externalStylesCount+' External Styles';
    }  else {
        check['externalStatus'] = 'Bad';
        check['externalDescription'] = 'There are more than two external styles';
    }




      return [check,data];
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      throw error;
    });
}

module.exports = getCheckStyle;
