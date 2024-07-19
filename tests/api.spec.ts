import { test, expect } from '@playwright/test';
import axios from 'axios';
import { setToken, getToken } from './functions/tokenManager';
import { GETHealthcheck, GETProfile, POSTLogin, POSTRegister, DELETELogout } from './functions/apirestFunctions';

test.describe.serial('Flujo de autenticación', () => {

  let authToken: string;

  test('Get Healthcheck', async({page}) => {
    const healthValue = await GETHealthcheck(`${process.env.URL}`);
    expect(healthValue?.message).toBe('Notes API is Running')
    expect(healthValue?.status).toBe(200)
    expect(healthValue?.success).toBe(true)
  })

  test.skip('Register a new user', async({page}) => {
    const userName = 'Horacio'
    const userEMail = 'horacio@hotmail.com'
    const userPassword = 'Buenaventura'
    const registerValue = await POSTRegister(`${process.env.URL}`, userName, userEMail, userPassword);
    expect(registerValue?.data.success).toBe(true)
    expect(registerValue?.data.message).toBe('User account created successfully')
    expect(registerValue?.data.status).toBe(201)
  })

  test('Login process', async({page}) => {
    const userEMail = "martinjavier3@hotmail.com"
    const userPassword = "ClaveSecreta"
    const loginResult = await POSTLogin(`${process.env.URL}`, userEMail, userPassword);
    const token = loginResult?.response.data.data.token;
    authToken = token;
    setToken(authToken)
    expect(loginResult?.response.data.status).toBe(200)
    expect(authToken).toBeTruthy();
    expect(getToken()).toBe(authToken);
  })
 
  test('Get Profile', async({page}) => {
    const returnValue = await GETProfile(`${process.env.URL}`);
    expect(returnValue?.data.message).toBe('Profile successful')
    expect(returnValue?.data.status).toBe(200)
  })

  test('Logout session', async({page}) => {
    const response = await DELETELogout(`${process.env.URL}`);
    expect(response?.data.success).toBe(true)
    expect(response?.data.status).toBe(200)
    expect(response?.data.message).toBe('User has been successfully logged out')
  })

})