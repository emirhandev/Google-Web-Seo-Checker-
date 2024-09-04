const axios = require('axios');

function getCheckText() {
  return axios.get('http://localhost:3000/text')
    .then(response => {

      const data = response.data.sortedWordsText;
      const check = {};

      
      const items = data.split(',');

      
      const firstNumber = parseInt(items[1], 10); 
      const secondNumber = parseInt(items[3], 10); 

   
      if ((secondNumber * 1.6) < firstNumber) {
        check['status'] = 'Bad';
        check['description'] = 'There is more than %60 difference between the first and second most used number';
      } else {
        check['status'] = 'Good';
        check['description'] = 'There is less than %60 difference between the first and second most used number';
      }


      return [check, data];
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      throw error;
    });
}

module.exports = getCheckText;
