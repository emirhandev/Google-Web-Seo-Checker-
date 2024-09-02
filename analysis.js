// headerCheck.js
const axios = require('axios');

function getCheck() {
  return axios.get('http://localhost:3000/header')
    .then(response => {
      const data = response.data;
      const check = {};
      console.log('Received data:', data.missingHeaderInfoCount);
      if (data.missingHeaderInfoCount < 2) {
          check['status'] = 'Good';
          check['description'] = 'Missing header information less than 2';
      } else if (data.missingHeaderInfoCount >= 2 && data.missingHeaderInfoCount <= 4) {
          check['status'] = 'Notr';
          check['description'] = 'Missing header information Between 2-4';
      } else {
          check['status'] = 'Bad';
          check['description'] = 'Missing header more than 4';
      }
      return check;
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      throw error;
    });
}

module.exports = getCheck;
