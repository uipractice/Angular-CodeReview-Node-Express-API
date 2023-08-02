const mockUserData = [
  { email: "test@example.com", password: "hashed_password" },
  // Additional mock user data...
];

// Mocked database findOne function
function findOne(query, callback) {
  const user = mockUserData.find((u) => u.email === query.email);
  callback(null, user);
}

module.exports = {
  findOne,
};
