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

export async function POSTRegister(apiBaseUrl: String, username: String, useremail: String, userpassword: String) {
  try {
      const data = { name: username, email: useremail, password: userpassword };
      const response = await axios.post(`${apiBaseUrl}/users/register`, data);
      return response;
  } catch (error) {
      console.error('POST Register Error:', error.message, error.response, error.data)
  }
}

export async function POSTLogin(apiBaseUrl: String, userEMail: String, userPassword: String) {
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

export async function GETProfile(apiBaseUrl: String) {
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

export async function UpdateProfile(apiBaseUrl: string, userData: any) {
  try {
    const currentToken = getToken();
    const response = await axios.patch(`${apiBaseUrl}/users/profile`, 
      userData,  
      {
        headers: {
          'x-auth-token': currentToken
        }
      }
    );
    return response;
  } catch (error) {
    console.error('Error on Update Profile:', error.response ? error.response.data : error.message);
  }
}

export async function DELETELogout(apiBaseUrl: String) {
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

export async function DeleteUser(apiBaseUrl: String) {
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

export async function CreateNewNote(apiBaseUrl: String, noteTitle: String, noteDescription: String, noteCategory: String) {
  try {
      const currentToken = getToken();
      const data = { title: noteTitle, description: noteDescription, category: noteCategory };
      const response = await axios.post(`${apiBaseUrl}/notes`, data, {
        headers: {
          'x-auth-token': currentToken
        }
      });
      return response;
  } catch (error) {
      console.error('Create New Note Error:', error.message, error.response, error.data)
  }
}

export async function GetAllNotes(apiBaseUrl: String) {
  try {
      const currentToken = getToken();
      const response = await axios.get(`${apiBaseUrl}/notes`, {
        headers: {
          'x-auth-token': currentToken
        }
      });
      return response;
  } catch (error) {
    console.error('Error en la solicitud Get All Notes:', error.response ? error.response.data : error.message);
  }
}

export async function GetOneNote(apiBaseUrl: String, noteID: String) {
  try {
      const currentToken = getToken();
      const response = await axios.get(`${apiBaseUrl}/notes/${noteID}`,  
        {
          headers: {
            'x-auth-token': currentToken
          }
        }
      );
      return response;
  } catch (error) {
    console.error('Error en la solicitud Get One Note:', error.response ? error.response.data : error.message);
  }
}

export async function UpdateExistingNote(apiBaseUrl: String, noteID: String, noteData: any) {
  try {
      const currentToken = getToken();
      const response = await axios.put(`${apiBaseUrl}/notes/${noteID}`, 
        noteData,
        {
          headers: {
            'x-auth-token': currentToken
          }
        }
      );
      return response;
  } catch (error) {
    console.error('Error en la solicitud Update One Note:', error.response ? error.response.data : error.message);
  }
}

export async function ChangeNoteStatus(apiBaseUrl: String, noteID: String, noteCompleted: boolean) {
  try {
      const currentToken = getToken();
      const data = { completed: noteCompleted };
      const response = await axios.patch(`${apiBaseUrl}/notes/${noteID}`, 
        data,
        {
          headers: {
            'x-auth-token': currentToken
          }
        }
      );
      return response;
  } catch (error) {
    console.error('Error en la solicitud Change Note Status:', error.response ? error.response.data : error.message);
  }
}

export async function DeleteOneNote(apiBaseUrl: String, noteID: String) {
  try {
      const currentToken = getToken();
      const response = await axios.delete(`${apiBaseUrl}/notes/${noteID}`, 
        {
          headers: {
            'x-auth-token': currentToken
          }
        }
      );
      return response;
  } catch (error) {
    console.error('Error en la solicitud Delete One Note:', error.response ? error.response.data : error.message);
  }
}