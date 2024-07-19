import { test, expect } from '@playwright/test';
import axios from 'axios';
import { setToken, getToken } from './functions/tokenManager';
import { GETHealthcheck, GETProfile, POSTLogin, POSTRegister, DELETELogout } from './functions/apirestFunctions';

test.describe.serial('Flujo de autenticación', () => {

  let authToken: string;

  test('Llamada Get Healthcheck', async({page}) => {
    console.log("URL: ", `${process.env.URL}`)
    const healthValue = await GETHealthcheck(`${process.env.URL}`);
    console.log("Health Check: ", healthValue)
  })

  test('Llamada Post Register', async({page}) => {
    const registerValue = await POSTRegister(`${process.env.URL}`);
    console.log("POST Register Data", registerValue?.data);
    console.log("POST Register Status", registerValue?.status);
  })

  /*

  test('Llamada Post Login', async({page}) => {
    const loginResult = await POSTLogin(`${process.env.URL}`);
    const token = loginResult?.response.data.data.token;
    authToken = token;
    setToken(authToken);
    console.log("Valor del Token: ",loginResult?.response.data.data.token);
    console.log("Valor del Status: ",loginResult?.response.data.status);
    console.log("Valor del Message: ",loginResult?.response.data.message);
    expect(loginResult?.response.data.status).toBe(200);
    expect(authToken).toBeTruthy();
    expect(getToken()).toBe(authToken);
  })
  
  test('Llamada Get Profile', async({page}) => {
    await page.waitForTimeout(1000);
    const returnValue = await GETProfile(`${process.env.URL}`);
    console.log("Return Message: ", returnValue?.data.message);
    console.log("Return Status: ", returnValue?.data.status);
  })
  
  test('Llamada Post Logout', async({page}) => {
    await page.waitForTimeout(10000);
    const response = await DELETELogout(`${process.env.URL}`);
    console.log("Response: ", response)
  })
*/
})




