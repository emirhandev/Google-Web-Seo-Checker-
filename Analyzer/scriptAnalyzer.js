const axios = require('axios');

function getCheckScript() {
  return axios.get('http://localhost:3000/script')
    .then(response => {
      const data = response.data;
      const check = {};

      if (data.duration<500){
        check['status'] = 'Good';
        check['description'] = 'Fetching scripts took less than 500 ms';
      }
      else if(data.duration>500 && data.duration<1000){
        check['status'] = 'Notr';
        check['description'] = 'Fetching scripts took between 500 and 1000 ms';

      }
      else{
        check['status'] = 'Bad';
        check['description'] = 'Fetching scripts took more than 1000 ms';
      }

    
      return [check,data];
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      throw error;
    });
}

module.exports = getCheckScript;
