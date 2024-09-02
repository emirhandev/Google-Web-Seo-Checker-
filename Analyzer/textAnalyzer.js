const axios = require('axios');

function getCheckText() {
  return axios.get('http://localhost:3000/text')
    .then(response => {
      const data = response.data;
      return [data];
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      throw error;
    });
}

module.exports = getCheckText;
