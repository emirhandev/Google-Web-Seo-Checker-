const axios = require('axios');

function getCheckMeta() {
  return axios.get('http://localhost:3000/meta')
    .then(response => {
      const data = response.data;
      const check = {};




      if (data.evaluation.titleLength>= 50 && data.evaluation.titleLength<=60 ) {
          check['TitleStatus'] = 'Good';
          check['TitleDescription'] = 'Title length between 50 to 60 characters';

      }    
      else {
          check['TitleStatus'] = 'Bad';
          check['TitleDescription'] = 'Title length is not between 50 and 60 characters';
      }
      if (data.evaluation.descriptionLength>= 150 && data.evaluation.descriptionLength<=160 ) {
        check['DescriptionStatus'] = 'Good';
        check['DescriptionDescription'] = 'Description length between 150 to 160 characters';

    }    
    else {
        check['DescriptionStatus'] = 'Bad';
        check['DescriptionDescription'] = 'Description length is not between 150 and 160 characters';
    }
     
      return [check,data];
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      throw error;
    });
}

module.exports = getCheckMeta;