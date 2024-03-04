import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface UsersProps {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite?: string;
    city: string;
    zipcode: string;
    geo?: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website?: string;
  company?: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `https://jsonplaceholder.typicode.com/`,
  }),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getAllUsers: builder.query<UsersProps[], void>({
      query: () => {
        const url = `users`;

        return {
          url,
          method: "GET",
        };
      },
    }),
    addNewUser: builder.mutation<void, any>({
      query: (body) => {
        return {
          url: `users`,
          method: "POST",
          body: body.body,
        };
      },
    }),
    updateUser: builder.mutation<void, { id: number; body: any }>({
      query: ({ id, ...body }) => {
        return {
          url: `users/${id}`,
          method: "Put",
          body: body,
        };
      },
    }),
    deleteUser: builder.mutation<void, { id: number }>({
      query: ({ id }) => {
        return {
          url: `users/${id}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useAddNewUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
