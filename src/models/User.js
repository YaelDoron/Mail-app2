// Creates a new user object with all the required registration fields
function createUser({
  id,
  firstName,
  lastName,
  birthDate,
  gender,
  email,
  password,
  profilePicture = null
}) {
  return {
    id,
    firstName,
    lastName,
    birthDate,
    gender,
    email,
    password,
    profilePicture
  };
}

module.exports = { createUser };
