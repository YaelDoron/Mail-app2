let users = [];
let Id = 0;

// Adds a new user to the list
function addUser(userData) {
  const newUser = { id: Id++, ...userData }; //spreading the fields from user data to new user object
  users.push(newUser);
  return newUser;
}

// Returns a user by ID
function getUserById(id) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].id == id) {
      return users[i];
    }
  }
}

// Checks if a user with the given ID exists
function exists(id) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].id == id) {
      return true;
    }
  }
  return false;
}

// Finds a user by email address
function findUserByEmail(email) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].email === email) {
      return users[i];
    }
  }
}

module.exports = {
  addUser,
  getUserById,
  exists,
  findUserByEmail
};
