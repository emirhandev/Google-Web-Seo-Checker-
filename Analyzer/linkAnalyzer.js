const axios = require('axios');

function getCheckLink() {
  return axios.get('http://localhost:3000/link')
    .then(response => {
      const data = response.data;
      const check = {};
    
      if (data.brokenLinksCount > 0) {
        check['status'] = 'Bad';
        check['description'] = 'There is '+ data.brokenLinksCount+' broken links';
    }  else {
        check['status'] = 'Good';
        check['description'] = 'There is no broken link';
    }
      return [check,data];
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      throw error;
    });
}

module.exports = getCheckLink;
