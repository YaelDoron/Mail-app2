let users = []; // In-memory user list
let nextId = 0; // Counter for user IDs

// Creates a new user object with all the required registration fields
const createUser=({ id, firstName, lastName, birthDate, gender, email, password, profilePicture = null})=>  {
  const user ={
    id: nextId++,
    firstName,
    lastName,
    birthDate,
    gender,
    email,
    password,
    profilePicture
  };
  users.push(user);
  return user;
}
// Returns a user by ID
const getUserById=(id) => {
  return users.find(user => user.id == id);
}
module.exports = {
  getUserById,
  createUser,
  users
};


