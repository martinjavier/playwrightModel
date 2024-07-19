import { test, expect } from '@playwright/test';
import axios from 'axios';
import { setToken, getToken } from './tokenManager';

export async function GETHealthcheck(apiBaseUrl) {
    try {
        const response = await axios.get(`${apiBaseUrl}/health-check`);
        return response.data;
    } catch (error) {
        console.error('Error en la solicitud GET:', error.message);
    }
}

export async function POSTRegister(apiBaseUrl, username, useremail, userpassword) {
  try {
      const data = { name: username, email: useremail, password: userpassword };
      const response = await axios.post(`${apiBaseUrl}/users/register`, data);
      return response;
  } catch (error) {
      console.error('Error en la solicitud POST Register:', error.message);
  }
}

export async function POSTLogin(apiBaseUrl, userEMail, userPassword) {
    try {
        const data = { email: userEMail, password: userPassword };
        const response = await axios.post(`${apiBaseUrl}/users/login`, data);
        const token = response.data.data.token;
        setToken(token);
        return { response, token };
    } catch (error) {
        console.error('Error en la solicitud POST:', error.message);
    }
}

export async function GETProfile(apiBaseUrl) {
  try {
      const currentToken = getToken();
      const response = await axios.get(`${apiBaseUrl}/users/profile`, {
        headers: {
          'x-auth-token': currentToken
        }
      });
      return response;
  } catch (error) {
    console.error('Error en la solicitud GET Profile:', error.response ? error.response.data : error.message);
  }
}

export async function DELETELogout(apiBaseUrl) {
  try {
    const currentToken = getToken()
      const response = await axios.delete(`${apiBaseUrl}/users/logout`, {
        headers: {
          'x-auth-token': currentToken
        }
      });
      return response;
  } catch (error) {
      console.error('Error en la solicitud DELETE Logout:', error.message);
  }
}

export async function DeleteUser(apiBaseUrl) {
    try {
      const currentToken = getToken()
        const response = await axios.delete(`${apiBaseUrl}/users/delete-account`, {
          headers: {
            'x-auth-token': currentToken
          }
        });
        return response;
    } catch (error) {
        console.error('Error en la solicitud DELETE User:', error.message);
    }
  }

