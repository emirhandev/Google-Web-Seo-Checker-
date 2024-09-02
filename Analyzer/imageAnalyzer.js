const axios = require('axios');

function getCheckImage() {
  return axios.get('http://localhost:3000/image')
    .then(response => {
      const data = response.data;
      const check = {};
    
      if (data.missingCount > 0) {
          check['status'] = 'Bad';
          check['description'] = 'There is '+ data.missingCount+' image with missing alt text';
      }  else {
          check['status'] = 'Good';
          check['description'] = 'No image missing alt text';
      }
      return [check];
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      throw error;
    });
}

module.exports = getCheckImage;
