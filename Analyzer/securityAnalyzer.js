const axios = require('axios');
function getCheckSecurity() {
  return axios.get('http://localhost:3000/security')
    .then(response => {
      const data = response.data;
      const check = {};
       if(data.length>0){
        check['status'] = 'Bad';
        check['description'] = 'There is a Http (Non Security) Link';
       }
       else{
        check['status'] = 'Good';
        check['description'] = 'All links are Https (Safe)';
       }
      return [check,data];
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      throw error;
    });
}

module.exports = getCheckSecurity;
