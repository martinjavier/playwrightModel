import { test, expect } from '@playwright/test';
import { setToken, getToken } from './functions/tokenManager';
import { GETHealthcheck, GETProfile, POSTLogin, POSTRegister, DELETELogout, DeleteUser, UpdateProfile, CreateNewNote, GetAllNotes, GetOneNote, UpdateExistingNote, ChangeNoteStatus, DeleteOneNote, ChangeUserPassword } from './functions/apirestFunctions';
import { generateRandomString, generateRandomNumber} from './functions/generationFunctions';
import { faker } from '@faker-js/faker';

test('Get environment healthcheck', async({page}) => {
  // Get environment health
  const healthValue = await GETHealthcheck(`${process.env.URL}`);
  expect(healthValue?.message).toBe('Notes API is Running')
  expect(healthValue?.status).toBe(200)
  expect(healthValue?.success).toBe(true)
})

test.describe.serial('User lifecycle', () => {

  let authToken: string;

  test('User creation', async({request}) => {

    // Random User Information
    const name = generateRandomString(8)
    const userName = name
    const userEMail = name+'@hotmail.com'
    const userPassword = generateRandomString(8)

    // Register a new user
    const registerValue = await POSTRegister(`${process.env.URL}`, userName, userEMail, userPassword);
    expect(registerValue?.data.success).toBe(true)
    expect(registerValue?.data.message).toBe('User account created successfully')
    expect(registerValue?.data.status).toBe(201)

    // Login
    var loginResult = await POSTLogin(`${process.env.URL}`, userEMail, userPassword);
    var token = loginResult?.response.data.data.token;
    authToken = token;
    setToken(authToken)
    expect(loginResult?.response.data.status).toBe(200)
    expect(authToken).toBeTruthy();
    expect(getToken()).toBe(authToken);

    // Delte an user
    const response = await DeleteUser(`${process.env.URL}`);
    expect(response?.data.success).toBe(true)
    expect(response?.data.status).toBe(200)
    expect(response?.data.message).toBe('Account successfully deleted')


  })

  test('Get User Profile', async({request}) => {
    
    // Random User Information
    const name = generateRandomString(8)
    const userName = name
    const userEMail = name+'@hotmail.com'
    const userPassword = generateRandomString(8)

    // Register a new user
    const registerResult = await POSTRegister(`${process.env.URL}`, userName, userEMail, userPassword);
    expect(registerResult?.data.success).toBe(true)
    expect(registerResult?.data.message).toBe('User account created successfully')
    expect(registerResult?.data.status).toBe(201)

    // Login
    var loginResult = await POSTLogin(`${process.env.URL}`, userEMail, userPassword);
    var token = loginResult?.response.data.data.token;
    authToken = token;
    setToken(authToken)
    expect(loginResult?.response.data.status).toBe(200)
    expect(authToken).toBeTruthy();
    expect(getToken()).toBe(authToken);

    // Get Profile
    authToken = getToken()
    var returnValue = await GETProfile(`${process.env.URL}`);
    expect(returnValue?.data.message).toBe('Profile successful')
    expect(returnValue?.data.status).toBe(200)
    expect(returnValue?.data.data.name).toBe(userName)
    expect(returnValue?.data.data.email).toBe(userEMail)

    // Delte an user
    const response = await DeleteUser(`${process.env.URL}`);
    expect(response?.data.success).toBe(true)
    expect(response?.data.status).toBe(200)
    expect(response?.data.message).toBe('Account successfully deleted')
  })

  test('Update User Profile', async({request}) => {
    
    // Random User Information
    const name = generateRandomString(8)
    const userName = name
    const userEMail = name+'@hotmail.com'
    const userPassword = generateRandomString(8)
    const userPhoneNumber = generateRandomNumber(9)
    const userCompanyName = faker.company.name()

    // Register a new user
    const registerResult = await POSTRegister(`${process.env.URL}`, userName, userEMail, userPassword);
    expect(registerResult?.data.success).toBe(true)
    expect(registerResult?.data.message).toBe('User account created successfully')
    expect(registerResult?.data.status).toBe(201)

    // Login
    var loginResult = await POSTLogin(`${process.env.URL}`, userEMail, userPassword);
    var token = loginResult?.response.data.data.token;
    authToken = token;
    setToken(authToken)
    expect(loginResult?.response.data.status).toBe(200)
    expect(authToken).toBeTruthy();
    expect(getToken()).toBe(authToken);

    // Update Profile
    authToken = getToken()
    const userData = { name: userName, phone: userPhoneNumber, company: userCompanyName };
    var updateResult = await UpdateProfile(`${process.env.URL}`, userData)
    expect(updateResult?.data.message).toBe('Profile updated successful')
    expect(updateResult?.data.status).toBe(200)
    expect(updateResult?.data.data.name).toBe(userName)
    expect(updateResult?.data.data.email).toBe(userEMail)
    expect(updateResult?.data.data.phone).toBe(userPhoneNumber)
    expect(updateResult?.data.data.company).toBe(userCompanyName)

    // Verify Updated Profile Information
    const getResult = await GETProfile(`${process.env.URL}`);
    expect(getResult?.data.message).toBe('Profile successful')
    expect(getResult?.data.status).toBe(200)
    expect(getResult?.data.data.name).toBe(userName)
    expect(getResult?.data.data.email).toBe(userEMail)
    expect(getResult?.data.data.phone).toBe(userPhoneNumber)
    expect(getResult?.data.data.company).toBe(userCompanyName)

    // Delte an user
    const deleteResult = await DeleteUser(`${process.env.URL}`);
    expect(deleteResult?.data.success).toBe(true)
    expect(deleteResult?.data.status).toBe(200)
    expect(deleteResult?.data.message).toBe('Account successfully deleted')
  })

  test('Change User Password', async({request}) => {
    
    // Random User Information
    const name = generateRandomString(8)
    const userName = name
    const userEMail = name+'@hotmail.com'
    const userPassword = generateRandomString(8)
    const userPhoneNumber = generateRandomNumber(9)
    const userCompanyName = faker.company.name()

    // Register a new user
    const registerResult = await POSTRegister(`${process.env.URL}`, userName, userEMail, userPassword);
    expect(registerResult?.data.success).toBe(true)
    expect(registerResult?.data.message).toBe('User account created successfully')
    expect(registerResult?.data.status).toBe(201)

    // Login
    var loginResult = await POSTLogin(`${process.env.URL}`, userEMail, userPassword);
    var token = loginResult?.response.data.data.token;
    authToken = token;
    setToken(authToken)
    expect(loginResult?.response.data.status).toBe(200)
    expect(authToken).toBeTruthy();
    expect(getToken()).toBe(authToken);

    // Change Password
    authToken = getToken()
    const newUserPassword = generateRandomString(8)
    const userData = { currentPassword: userPassword, newPassword: newUserPassword };
    var changePasswordResult = await ChangeUserPassword(`${process.env.URL}`, userData)
    //console.log("change password: ", changePasswordResult)
    expect(changePasswordResult?.data.message).toBe('The password was successfully updated')
    expect(changePasswordResult?.data.status).toBe(200)
    expect(changePasswordResult?.data.success).toBe(true)
    expect(changePasswordResult?.status).toBe(200)
    expect(changePasswordResult?.statusText).toBe('OK')

    // Logout
    var response = await DELETELogout(`${process.env.URL}`);
    expect(response?.data.success).toBe(true)
    expect(response?.data.status).toBe(200)
    expect(response?.data.message).toBe('User has been successfully logged out')

    // Login
    var loginResult = await POSTLogin(`${process.env.URL}`, userEMail, newUserPassword);
    var token = loginResult?.response.data.data.token;
    authToken = token;
    setToken(authToken)
    expect(loginResult?.response.data.status).toBe(200)
    expect(authToken).toBeTruthy();
    expect(getToken()).toBe(authToken);

    // Delte an user
    const deleteResult = await DeleteUser(`${process.env.URL}`);
    expect(deleteResult?.data.success).toBe(true)
    expect(deleteResult?.data.status).toBe(200)
    expect(deleteResult?.data.message).toBe('Account successfully deleted')
  })

  test('Logout Account', async({request}) => {
    
    // Random User Information
    const name = generateRandomString(8)
    const userName = name
    const userEMail = name+'@hotmail.com'
    const userPassword = generateRandomString(8)

    // Register a new user
    const registerResult = await POSTRegister(`${process.env.URL}`, userName, userEMail, userPassword);
    expect(registerResult?.data.success).toBe(true)
    expect(registerResult?.data.message).toBe('User account created successfully')
    expect(registerResult?.data.status).toBe(201)

    // Login
    var loginResult = await POSTLogin(`${process.env.URL}`, userEMail, userPassword);
    var token = loginResult?.response.data.data.token;
    authToken = token;
    setToken(authToken)
    expect(loginResult?.response.data.status).toBe(200)
    expect(authToken).toBeTruthy();
    expect(getToken()).toBe(authToken);

    // Get Profile
    authToken = getToken()
    var returnValue = await GETProfile(`${process.env.URL}`);
    expect(returnValue?.data.message).toBe('Profile successful')
    expect(returnValue?.data.status).toBe(200)
    expect(returnValue?.data.data.name).toBe(userName)
    expect(returnValue?.data.data.email).toBe(userEMail)

    // Logout
    var response = await DELETELogout(`${process.env.URL}`);
    expect(response?.data.success).toBe(true)
    expect(response?.data.status).toBe(200)
    expect(response?.data.message).toBe('User has been successfully logged out')

  })

  test('Delete User Account', async({request}) => {
    
    // Random User Information
    const name = generateRandomString(8)
    const userName = name
    const userEMail = name+'@hotmail.com'
    const userPassword = generateRandomString(8)

    // Register a new user
    const registerResult = await POSTRegister(`${process.env.URL}`, userName, userEMail, userPassword);
    expect(registerResult?.data.success).toBe(true)
    expect(registerResult?.data.message).toBe('User account created successfully')
    expect(registerResult?.data.status).toBe(201)

    // Login
    var loginResult = await POSTLogin(`${process.env.URL}`, userEMail, userPassword);
    var token = loginResult?.response.data.data.token;
    authToken = token;
    setToken(authToken)
    expect(loginResult?.response.data.status).toBe(200)
    expect(authToken).toBeTruthy();
    expect(getToken()).toBe(authToken);

    // Get Profile
    authToken = getToken()
    var getResult = await GETProfile(`${process.env.URL}`);
    expect(getResult?.data.message).toBe('Profile successful')
    expect(getResult?.data.status).toBe(200)
    expect(getResult?.data.data.name).toBe(userName)
    expect(getResult?.data.data.email).toBe(userEMail)

    // Delte an user
    const deleteResult = await DeleteUser(`${process.env.URL}`);
    expect(deleteResult?.data.success).toBe(true)
    expect(deleteResult?.data.status).toBe(200)
    expect(deleteResult?.data.message).toBe('Account successfully deleted')

  })

})

test.describe.serial('Notes lifecycle', () => {

  let authToken: string;
  const name = generateRandomString(8)
  const userName = name
  const userEMail = name+'@hotmail.com'
  const userPassword = generateRandomString(8)
  var noteTitle = generateRandomString(8)
  var noteDescription = generateRandomString(12)
  var noteCategory = 'Home' // Home, Work or Personal

  test.beforeAll(async ({ request }) => {
    // Register a new user
    const registerValue = await POSTRegister(`${process.env.URL}`, userName, userEMail, userPassword);
    expect(registerValue?.data.success).toBe(true)
    expect(registerValue?.data.message).toBe('User account created successfully')
    expect(registerValue?.data.status).toBe(201)
  });

  test('Note creation', async({page}) => {

    // Login
    var loginResult = await POSTLogin(`${process.env.URL}`, userEMail, userPassword);
    var token = loginResult?.response.data.data.token;
    authToken = token;
    setToken(authToken)
    expect(loginResult?.response.data.status).toBe(200)
    expect(authToken).toBeTruthy();
    expect(getToken()).toBe(authToken);

    // Create a new Note
    authToken = getToken()
    const registerValue = await CreateNewNote(`${process.env.URL}`, noteTitle, noteDescription, noteCategory);
    expect(registerValue?.data.success).toBe(true)
    expect(registerValue?.data.status).toBe(200)
    expect(registerValue?.data.message).toBe('Note successfully created')

    // Logout
    var response = await DELETELogout(`${process.env.URL}`);
    expect(response?.data.success).toBe(true)
    expect(response?.data.status).toBe(200)
    expect(response?.data.message).toBe('User has been successfully logged out')

  })

  test('Get All Notes', async({page}) => {

    // Login
    var loginResult = await POSTLogin(`${process.env.URL}`, userEMail, userPassword);
    var token = loginResult?.response.data.data.token;
    var authToken = token;
    setToken(authToken)
    expect(loginResult?.response.data.status).toBe(200)
    expect(authToken).toBeTruthy();
    expect(getToken()).toBe(authToken);

    // Get All Notes
    var getResult = await GetAllNotes(`${process.env.URL}`)
    expect(getResult?.data.success).toBe(true)
    expect(getResult?.data.status).toBe(200)
    expect(getResult?.data.message).toBe('Notes successfully retrieved')

    // Logout
    var response = await DELETELogout(`${process.env.URL}`);
    expect(response?.data.success).toBe(true)
    expect(response?.data.status).toBe(200)
    expect(response?.data.message).toBe('User has been successfully logged out')

  })

  test('Get One Note', async({page}) => {

    // Login
    var loginResult = await POSTLogin(`${process.env.URL}`, userEMail, userPassword);
    var token = loginResult?.response.data.data.token;
    var authToken = token;
    setToken(authToken)
    expect(loginResult?.response.data.status).toBe(200)
    expect(authToken).toBeTruthy();
    expect(getToken()).toBe(authToken);

    // New Note Information
    noteTitle = generateRandomString(8)
    noteDescription = generateRandomString(12)
    noteCategory = 'Home' // Home, Work or Personal

    // Create a new Note
    authToken = getToken()
    const registerValue = await CreateNewNote(`${process.env.URL}`, noteTitle, noteDescription, noteCategory);
    var noteID = registerValue?.data.data.id
    expect(registerValue?.data.success).toBe(true)
    expect(registerValue?.data.status).toBe(200)
    expect(registerValue?.data.message).toBe('Note successfully created')

    // Get One Note
    authToken = getToken()
    var getResult = await GetOneNote(`${process.env.URL}`, noteID)
    expect(getResult?.data.success).toBe(true)
    expect(getResult?.data.status).toBe(200)
    expect(getResult?.data.message).toBe('Note successfully retrieved')
    expect(getResult?.data.data.id).toBe(noteID)

    // Logout
    var response = await DELETELogout(`${process.env.URL}`);
    expect(response?.data.success).toBe(true)
    expect(response?.data.status).toBe(200)
    expect(response?.data.message).toBe('User has been successfully logged out')

  })

  test('Update Existing Note', async({page}) => {

    // Login
    var loginResult = await POSTLogin(`${process.env.URL}`, userEMail, userPassword);
    var token = loginResult?.response.data.data.token;
    var authToken = token;
    setToken(authToken)
    expect(loginResult?.response.data.status).toBe(200)
    expect(authToken).toBeTruthy();
    expect(getToken()).toBe(authToken);

    // New note information
    noteTitle = generateRandomString(8)
    noteDescription = generateRandomString(12)
    noteCategory = 'Home' // Home, Work or Personal

    // Create a new Note
    authToken = getToken()
    const registerValue = await CreateNewNote(`${process.env.URL}`, noteTitle, noteDescription, noteCategory);
    var noteID = registerValue?.data.data.id
    expect(registerValue?.data.success).toBe(true)
    expect(registerValue?.data.status).toBe(200)
    expect(registerValue?.data.message).toBe('Note successfully created')

    // New note information for update
    const newNoteTitle = generateRandomString(8)
    const newNoteDescription = generateRandomString(12)
    const newNoteCategory = 'Work' // Home, Work or Personal

    // Update Existing Note
    authToken = getToken()
    const noteData = { id: noteID, title: newNoteTitle, description: newNoteDescription, completed: true, category: newNoteCategory };
    const updateResponse = await UpdateExistingNote(`${process.env.URL}`, noteID, noteData)
    expect(updateResponse?.data.success).toBe(true)
    expect(updateResponse?.data.status).toBe(200)
    expect(updateResponse?.data.message).toBe('Note successfully Updated')

    // Get One Note
    authToken = getToken()
    var getResult = await GetOneNote(`${process.env.URL}`, noteID)
    expect(getResult?.data.success).toBe(true)
    expect(getResult?.data.status).toBe(200)
    expect(getResult?.data.message).toBe('Note successfully retrieved')
    expect(getResult?.data.data.id).toBe(noteID)
    expect(getResult?.data.data.title).toBe(newNoteTitle)
    expect(getResult?.data.data.description).toBe(newNoteDescription)
    expect(getResult?.data.data.completed).toBe(true)
    expect(getResult?.data.data.category).toBe("Work")

    // Logout
    var response = await DELETELogout(`${process.env.URL}`);
    expect(response?.data.success).toBe(true)
    expect(response?.data.status).toBe(200)
    expect(response?.data.message).toBe('User has been successfully logged out')

  })

  test('Change Note Status', async({page}) => {

    // Login
    var loginResult = await POSTLogin(`${process.env.URL}`, userEMail, userPassword);
    var token = loginResult?.response.data.data.token;
    var authToken = token;
    setToken(authToken)
    expect(loginResult?.response.data.status).toBe(200)
    expect(authToken).toBeTruthy();
    expect(getToken()).toBe(authToken);

    // New note information
    noteTitle = generateRandomString(8)
    noteDescription = generateRandomString(12)
    noteCategory = 'Home' // Home, Work or Personal

    // Create a new Note
    authToken = getToken()
    const registerValue = await CreateNewNote(`${process.env.URL}`, noteTitle, noteDescription, noteCategory);
    var noteID = registerValue?.data.data.id
    expect(registerValue?.data.success).toBe(true)
    expect(registerValue?.data.status).toBe(200)
    expect(registerValue?.data.message).toBe('Note successfully created')

    // New note information for update
    const newNoteTitle = generateRandomString(8)
    const newNoteDescription = generateRandomString(12)
    const newNoteCategory = 'Work' // Home, Work or Personal

    // Change Note Status
    authToken = getToken()   
    const noteCompleted:boolean = false
    const patchResponse = await ChangeNoteStatus(`${process.env.URL}`, noteID, noteCompleted)
    expect(patchResponse?.data.success).toBe(true)
    expect(patchResponse?.data.status).toBe(200)
    expect(patchResponse?.data.message).toBe('Note successfully Updated')
    expect(patchResponse?.data.data.completed).toBe(false)

    // Get Updated Note
    authToken = getToken()
    var getResult = await GetOneNote(`${process.env.URL}`, noteID)
    expect(getResult?.data.success).toBe(true)
    expect(getResult?.data.status).toBe(200)
    expect(getResult?.data.message).toBe('Note successfully retrieved')
    expect(getResult?.data.data.id).toBe(noteID)
    expect(getResult?.data.data.completed).toBe(false)

    // Logout
    var response = await DELETELogout(`${process.env.URL}`);
    expect(response?.data.success).toBe(true)
    expect(response?.data.status).toBe(200)
    expect(response?.data.message).toBe('User has been successfully logged out')

  })

  test('Delete One Note', async({page}) => {

    // Login
    var loginResult = await POSTLogin(`${process.env.URL}`, userEMail, userPassword);
    var token = loginResult?.response.data.data.token;
    var authToken = token;
    setToken(authToken)
    expect(loginResult?.response.data.status).toBe(200)
    expect(authToken).toBeTruthy();
    expect(getToken()).toBe(authToken);

    // New note information
    noteTitle = generateRandomString(8)
    noteDescription = generateRandomString(12)
    noteCategory = 'Home' // Home, Work or Personal

    // Create a new Note
    authToken = getToken()
    const registerValue = await CreateNewNote(`${process.env.URL}`, noteTitle, noteDescription, noteCategory);
    var noteID = registerValue?.data.data.id
    expect(registerValue?.data.success).toBe(true)
    expect(registerValue?.data.status).toBe(200)
    expect(registerValue?.data.message).toBe('Note successfully created')

    // Delete An Existing Note
    authToken = getToken()   
    const deleteResponse = await DeleteOneNote(`${process.env.URL}`, noteID)
    expect(deleteResponse?.data.success).toBe(true)
    expect(deleteResponse?.data.status).toBe(200)
    expect(deleteResponse?.data.message).toBe('Note successfully deleted')

    // Logout
    var response = await DELETELogout(`${process.env.URL}`);
    expect(response?.data.success).toBe(true)
    expect(response?.data.status).toBe(200)
    expect(response?.data.message).toBe('User has been successfully logged out')

  })

  test.afterAll(async ({ request }) => {

    // Login
    var loginResult = await POSTLogin(`${process.env.URL}`, userEMail, userPassword);
    var token = loginResult?.response.data.data.token;
    authToken = token;
    setToken(authToken)
    expect(loginResult?.response.data.status).toBe(200)
    expect(authToken).toBeTruthy();
    expect(getToken()).toBe(authToken);

    // Delte an user
    var response = await DeleteUser(`${process.env.URL}`);
    expect(response?.data.success).toBe(true)
    expect(response?.data.status).toBe(200)
    expect(response?.data.message).toBe('Account successfully deleted')

  });

})

