import { test, expect } from '@playwright/test';
import axios from 'axios';
import { setToken, getToken } from './functions/tokenManager';
import { GETHealthcheck, GETProfile, POSTLogin, POSTRegister, DELETELogout, DeleteUser, UpdateProfile, CreateNewNote } from './functions/apirestFunctions';
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
  const name = generateRandomString(8)
  const userName = name
  const userEMail = name+'@hotmail.com'
  const userPassword = generateRandomString(8)
  const userPhoneNumber = generateRandomNumber(9)
  const userCompanyName = faker.company.name()

  test.beforeAll(async ({ request }) => {
    // Register a new user
    const registerValue = await POSTRegister(`${process.env.URL}`, userName, userEMail, userPassword);
    expect(registerValue?.data.success).toBe(true)
    expect(registerValue?.data.message).toBe('User account created successfully')
    expect(registerValue?.data.status).toBe(201)
  });

  test('User creation', async({request}) => {
    
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

    // Update Profile
    authToken = getToken()
    const userData = { name: userName, phone: userPhoneNumber, company: userCompanyName };
    var returnValue = await UpdateProfile(`${process.env.URL}`, userData)
    expect(returnValue?.data.message).toBe('Profile updated successful')
    expect(returnValue?.data.status).toBe(200)
    expect(returnValue?.data.data.name).toBe(userName)
    expect(returnValue?.data.data.email).toBe(userEMail)
    expect(returnValue?.data.data.phone).toBe(userPhoneNumber)
    expect(returnValue?.data.data.company).toBe(userCompanyName)

    // Verify Update Profile Information
    returnValue = await GETProfile(`${process.env.URL}`);
    expect(returnValue?.data.message).toBe('Profile successful')
    expect(returnValue?.data.status).toBe(200)
    expect(returnValue?.data.data.name).toBe(userName)
    expect(returnValue?.data.data.email).toBe(userEMail)
    expect(returnValue?.data.data.phone).toBe(userPhoneNumber)
    expect(returnValue?.data.data.company).toBe(userCompanyName)

    // Logout
    var response = await DELETELogout(`${process.env.URL}`);
    expect(response?.data.success).toBe(true)
    expect(response?.data.status).toBe(200)
    expect(response?.data.message).toBe('User has been successfully logged out')

    // Login
    loginResult = await POSTLogin(`${process.env.URL}`, userEMail, userPassword);
    token = loginResult?.response.data.data.token;
    authToken = token;
    setToken(authToken)
    expect(loginResult?.response.data.status).toBe(200)
    expect(authToken).toBeTruthy();
    expect(getToken()).toBe(authToken);

    // Get Profile
    authToken = getToken()
    returnValue = await GETProfile(`${process.env.URL}`);
    expect(returnValue?.data.message).toBe('Profile successful')
    expect(returnValue?.data.status).toBe(200)
    expect(returnValue?.data.data.name).toBe(userName)
    expect(returnValue?.data.data.email).toBe(userEMail)
    expect(returnValue?.data.data.phone).toBe(userPhoneNumber)
    expect(returnValue?.data.data.company).toBe(userCompanyName)

    // Delte an user
    response = await DeleteUser(`${process.env.URL}`);
    expect(response?.data.success).toBe(true)
    expect(response?.data.status).toBe(200)
    expect(response?.data.message).toBe('Account successfully deleted')
  })

})

test.describe.serial('Notes lifecycle', () => {

  let authToken: string;
  const name = generateRandomString(8)
  const userName = name
  const userEMail = name+'@hotmail.com'
  const userPassword = generateRandomString(8)
  const noteTitle = generateRandomString(8)
  const noteDescription = generateRandomString(12)
  const noteCategory = 'Home' // Home, Work or Personal

  test.beforeAll(async ({ request }) => {
    // Register a new user
    const registerValue = await POSTRegister(`${process.env.URL}`, userName, userEMail, userPassword);
    expect(registerValue?.data.success).toBe(true)
    expect(registerValue?.data.message).toBe('User account created successfully')
    expect(registerValue?.data.status).toBe(201)
  });

  test('Notes creation', async({page}) => {

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
    console.log("Note creation registerValue: ", registerValue)
    expect(registerValue?.data.success).toBe(true)
    expect(registerValue?.data.status).toBe(200)
    expect(registerValue?.data.message).toBe('Note successfully created')

    // Get Profile
    authToken = getToken()
    var returnValue = await GETProfile(`${process.env.URL}`);
    expect(returnValue?.data.message).toBe('Profile successful')
    expect(returnValue?.data.status).toBe(200)

    // Logout
    var response = await DELETELogout(`${process.env.URL}`);
    expect(response?.data.success).toBe(true)
    expect(response?.data.status).toBe(200)
    expect(response?.data.message).toBe('User has been successfully logged out')

    // Login
    loginResult = await POSTLogin(`${process.env.URL}`, userEMail, userPassword);
    token = loginResult?.response.data.data.token;
    authToken = token;
    setToken(authToken)
    expect(loginResult?.response.data.status).toBe(200)
    expect(authToken).toBeTruthy();
    expect(getToken()).toBe(authToken);

    // Get Profile
    authToken = getToken()
    returnValue = await GETProfile(`${process.env.URL}`);
    expect(returnValue?.data.message).toBe('Profile successful')
    expect(returnValue?.data.status).toBe(200)

    // Delte an user
    response = await DeleteUser(`${process.env.URL}`);
    expect(response?.data.success).toBe(true)
    expect(response?.data.status).toBe(200)
    expect(response?.data.message).toBe('Account successfully deleted')
  })

})

