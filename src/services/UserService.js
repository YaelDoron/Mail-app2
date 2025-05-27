// Checks if a user with the given ID exists
const exists=(id) => {
  return users.some(user => user.id == id);
}

// Finds a user by email address
const findUserByEmail=(email)=>  {
  return users.find(user => user.email === email);
}