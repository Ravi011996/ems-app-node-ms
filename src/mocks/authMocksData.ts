export const mockNewUser = {
    username: "testuser",
    email: "testuser@example.com",
    password: "hashedpassword",
    save: jest.fn(),
  };
  
  export const mockExistingUser = {
    email: "existinguser@example.com",
  };
  
  export const mockUserForLogin = {
    _id: "user_id_123",
    email: "testuser@example.com",
    password: "hashedpassword",  
  };
  
  export const mockToken = "mocked-token";

  export const testUser = {
    user : 'testuser',
    mail : 'testuser@example.com',
    password : "password123",
    nonexistentuser : 'nonexistentuser',
    wrongpassword : 'wrongpassword',
    hashedpassword : 'hashedpassword'
};
  