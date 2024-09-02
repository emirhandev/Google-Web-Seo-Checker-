const axios = require('axios');
function getCheckSize() {
  return axios.get('http://localhost:3000/size')
    .then(response => {
      const data = response.data;
      const check = {};
       if(data<3){
        check['status'] = 'Good';
        check['description'] = 'Web Page size less than 3 MB';
       }
       else{
        check['status'] = 'Bad';
        check['description'] = 'Web Page size more than 3 MB';
       }
      return [check,data];
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      throw error;
    });
}

module.exports = getCheckSize;
