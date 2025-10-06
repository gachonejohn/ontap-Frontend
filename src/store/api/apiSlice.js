import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';


console.log('Base URL:', process.env.REACT_APP_SERVER_URI);
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_SERVER_URI,
    credentials: 'include',
    
    prepareHeaders: (headers, { endpoint }) => {
      const accessToken = Cookies.get('accessToken');
      const refreshToken = Cookies.get('refreshToken');
      const endpointsUsingFormData = ['createEmployee',
         "updateProfilePic", 
         "uploadDocument",
          'uploadEmployeeDocuments',
          'createStatutoryInfo',
          "editStatutoryInfo",
          "createEducationInfo",
          "editEducationInfo"
        ];

      if (endpointsUsingFormData.includes(endpoint)) {
        headers.delete('Content-Type');
      }
      if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
      if (refreshToken) headers.set('refreshToken', refreshToken);

      return headers;
      
    },
  }),
  endpoints: (builder) => ({}),
});
