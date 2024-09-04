const axios = require('axios');
function getCheckTime() {
  return axios.get('http://localhost:3000/time')
    .then(response => {
      const data = response.data;
      const check = {};

       if(data<2000){
        check['status'] = 'Good';
        check['description'] = 'Web Page load time less than 2000 ms';
       }
       else if(data>2000 && data<4000){
        check['status'] = 'Neutral';
        check['description'] = 'Web Page load time between 2000 ms and 4000 ms';
       }
       else{
        check['status'] = 'Bad';
        check['description'] = 'Web Page load time more than 4000 ms';
       }
      return [check,data];
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      throw error;
    });
}

module.exports = getCheckTime;
