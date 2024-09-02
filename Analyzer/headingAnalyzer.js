const axios = require('axios');

function getCheckHeading() {
  return axios.get('http://localhost:3000/heading')
    .then(response => {
      const data = response.data;
      const check = {};
      
      if (data.h1==0) {
          check['status'] = 'Bad';
          check['description'] = 'H1 there should be one H1';
      } else if (data.h1== 1) {
          check['status'] = 'Good';
          check['description'] = 'There is a H1';
      }
      else{
        check['status'] = 'Bad';
          check['description'] = 'There should not be more than one H1';
      }
      
      

      
      return [check,data];
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      throw error;
    });
}

module.exports = getCheckHeading;
