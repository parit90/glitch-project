const https = require('https');

const userProfilesUrl = 'https://raw.githubusercontent.com/alj-devops/santa-data/master/userProfiles.json';
const usersUrl = 'https://raw.githubusercontent.com/alj-devops/santa-data/master/users.json';

let userProfiles = []
let users = []
const fetchData = async (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve(JSON.parse(data));
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
};

const fetchAllData = async () => {
  try {
      [userProfiles, users] = await Promise.all([
      fetchData(userProfilesUrl),
      fetchData(usersUrl)
    ]);
    
  } catch (err) {
    console.log('Error:', err.message);
  }
};

fetchAllData();

const checkValidUser = async(data) => {
      let result = {}
      const resUser = users.find(userData => userData.username === data.userId)
      if (!resUser) {
            result.error = `ERROR: User ${data.userId} not found in the provided raw.githubusercontent.com URLs`;
            return result;
      }

      const resUserProfileData = userProfiles.find(userProfileData => userProfileData.userUid === resUser.uid)
      const today = new Date();
      const userBirthDate = new Date(resUserProfileData.birthdate);
      const ageInYears = today.getFullYear() - userBirthDate.getFullYear();

      if (ageInYears >= 10) {
            result.error = `ERROR: User ${data.userId} is over 10 years old: ${resUserProfileData.birthdate}`;
            return result;
      }
      if (ageInYears <= 10){
            result.username = data.userId;
            result.address = resUserProfileData.address;
            result.message = data.message;
            result.success = true;
      } else {
            result.error = `ERROR: User ${data.userId} Age is not correct: ${resUserProfileData.birthdate}`;
            return result;
      }
      return result;
}

module.exports.checkValidUser = checkValidUser