const pwd = process.env.TEST_PASSWORD || 'default_test_pwd';


export const users: Users = {    
    existing_user: {
      username: 'fwo.beta.28@gmail.com',
      password: pwd
    }


  } as const;

  export type Users = Record< 'existing_user' ,  User>;

  export interface User {
    username: string;
    password: string;    
  }