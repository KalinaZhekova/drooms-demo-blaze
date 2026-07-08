import dotenv from 'dotenv';

// Load .env file
dotenv.config();
const pwd = (process.env.TEST_PASSWORD as string) || 'Password#2026';

export const users: Users = {    
    existing_user: {
      username: 'fwo.beta.28@gmail.com',
      password: 'Password#2026'//pwd
    }


  } as const;

  export type Users = Record< 'existing_user' ,  User>;

  export interface User {
    username: string;
    password: string;    
  }