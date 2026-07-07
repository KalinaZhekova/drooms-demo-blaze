import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests',
  timeout: 10 * 1000, //override the defaut timeout for components and every step
  expect : {
    timeout: 10 * 1000 //assertions timeout
  },    
  reporter: 'html',  
  use: {
    browserName: 'chromium',
    headless: false
    //browserName: 'firefox'
  }
});