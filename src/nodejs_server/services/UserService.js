const User = require('../models/User');


// Checks if a user with the given ID exists
const exists=(id) => {
  return User.users.some(user => user.id == id);
}

// Finds a user by email address
const findUserByEmail=(email)=>  {
  return User.users.find(user => user.email === email);
}

// Validates the birthDate format and value
const validateBirthDate=(birthDate)=> {
  if (!birthDate) {
    return "Missing birthDate";
  }
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(birthDate)) {
    return "Birth date must be in format YYYY-MM-DD";
  }
  const date = new Date(birthDate);
  if (isNaN(date.getTime())) {
    return "Birth date is not a valid calendar date";
  }
  const minDate = new Date("1905-01-01");
  const maxDate = new Date("2012-01-01");

  if (date < minDate || date > maxDate) {
    return "You don’t meet the age requirement to create an account";
  }
  
  return null; // valid
}
function findUserById(id) {
  return User.getUserById(id);
}

module.exports = {
  exists,
  findUserByEmail,
  validateBirthDate,
  findUserById
};