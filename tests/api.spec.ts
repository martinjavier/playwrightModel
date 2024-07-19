import { test, expect } from '@playwright/test';
import axios from 'axios';
import { setToken, getToken } from './functions/tokenManager';
import { GETHealthcheck, GETProfile, POSTLogin, POSTRegister, DELETELogout, DeleteUser } from './functions/apirestFunctions';
import { generateRandomString } from './functions/generationFunctions';
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

  test.beforeAll(async ({ request }) => {
    // Register a new user
    const registerValue = await POSTRegister(`${process.env.URL}`, userName, userEMail, userPassword);
    console.log("Register Value: ", registerValue)
    expect(registerValue?.data.success).toBe(true)
    expect(registerValue?.data.message).toBe('User account created successfully')
    expect(registerValue?.data.status).toBe(201)
  });

  test('User lifecycle', async({page}) => {

    console.log("Creation userName: ", userName)
    console.log("Creation userEMail: ", userEMail)
    console.log("Creation userPassword: ", userPassword)

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
