import { test, expect } from '@playwright/test';
import axios from 'axios';
import { setToken, getToken } from './functions/tokenManager';
import { GETHealthcheck, GETProfile, POSTLogin, POSTRegister, DELETELogout, DeleteUser } from './functions/apirestFunctions';
import { generateRandomString } from './functions/generationFunctions';
import { faker } from '@faker-js/faker';

test.describe.serial('User lifecycle', () => {

  let authToken: string;
  const userName = faker.internet.userName()
  const userEMail = faker.internet.email()
  const userPassword = faker.internet.password()

  test('Get environment healthcheck', async({page}) => {
        // Get environment health
        const healthValue = await GETHealthcheck(`${process.env.URL}`);
        expect(healthValue?.message).toBe('Notes API is Running')
        expect(healthValue?.status).toBe(200)
        expect(healthValue?.success).toBe(true)
  })

  test('User creation', async({page}) => {

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
    expect(response?.data.success).toBe(true)
    expect(response?.data.status).toBe(200)
    expect(response?.data.message).toBe('Account successfully deleted')
  })

})
