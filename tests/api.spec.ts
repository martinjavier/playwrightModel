import { test, expect } from '@playwright/test';
import axios from 'axios';
import { setToken, getToken } from './functions/tokenManager';
import { GETHealthcheck, GETProfile, POSTLogin, POSTRegister, DELETELogout, DeleteUser } from './functions/apirestFunctions';

const userName = 'user008'
const userEMail = 'user008@hotmail.com'
const userPassword = 'Buenaventura'

test.describe.serial('User lifecycle', () => {

  let authToken: string;

  test('User creation', async({page}) => {
    // Get environment health
    const healthValue = await GETHealthcheck(`${process.env.URL}`);
    expect(healthValue?.message).toBe('Notes API is Running')
    expect(healthValue?.status).toBe(200)
    expect(healthValue?.success).toBe(true)

    // Register a new user
    const registerValue = await POSTRegister(`${process.env.URL}`, userName, userEMail, userPassword);
    expect(registerValue?.data.success).toBe(true)
    expect(registerValue?.data.message).toBe('User account created successfully')
    expect(registerValue?.data.status).toBe(201)

    // Login
    const loginResult = await POSTLogin(`${process.env.URL}`, userEMail, userPassword);
    const token = loginResult?.response.data.data.token;
    authToken = token;
    setToken(authToken)
    expect(loginResult?.response.data.status).toBe(200)
    expect(authToken).toBeTruthy();
    expect(getToken()).toBe(authToken);

    // Get Profile
    authToken = getToken()
    const returnValue = await GETProfile(`${process.env.URL}`);
    expect(returnValue?.data.message).toBe('Profile successful')
    expect(returnValue?.data.status).toBe(200)

    // Logout
    const response = await DELETELogout(`${process.env.URL}`);
    expect(response?.data.success).toBe(true)
    expect(response?.data.status).toBe(200)
    expect(response?.data.message).toBe('User has been successfully logged out')
  })

  test('Delete an user', async({page}) => {
    // Get environment health
    const healthValue = await GETHealthcheck(`${process.env.URL}`);
    expect(healthValue?.message).toBe('Notes API is Running')
    expect(healthValue?.status).toBe(200)
    expect(healthValue?.success).toBe(true)

    // Login
    const loginResult = await POSTLogin(`${process.env.URL}`, userEMail, userPassword);
    const token = loginResult?.response.data.data.token;
    authToken = token;
    setToken(authToken)
    expect(loginResult?.response.data.status).toBe(200)
    expect(authToken).toBeTruthy();
    expect(getToken()).toBe(authToken);

    // Get Profile
    authToken = getToken()
    const returnValue = await GETProfile(`${process.env.URL}`);
    expect(returnValue?.data.message).toBe('Profile successful')
    expect(returnValue?.data.status).toBe(200)

    // Delte an user
    const response = await DeleteUser(`${process.env.URL}`);
    console.log("RESPONSE: ", response)
    expect(response?.data.success).toBe(true)
    expect(response?.data.status).toBe(200)
    expect(response?.data.message).toBe('Account successfully deleted')
  })

})
