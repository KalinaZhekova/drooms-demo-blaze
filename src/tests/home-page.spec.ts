import { test } from '@playwright/test';
import { HomePage } from '../pages/home-page';


test.describe('Home page before login', () => {
  let homePage: HomePage;
    test.beforeEach(async ({page}) => {
            homePage = new HomePage(page);
            await homePage.openHomePage(); 
    });         
    test('Verify categories list', async ({page})=> {                
        await homePage.verifyCategories();  
    }); 
    test('Verify items have price tag', async ({page})=> {                
        await homePage.verifyAllCardsHavePrices();         
    });      
});
test.describe('Home page after login', () => {
  let homePage: HomePage;
    test.beforeEach(async ({page}) => {
            homePage = new HomePage(page);
            await homePage.openHomePage(); 
            await homePage.loginAs('existing_user');
    });         
    test('Add item to the card and validate the message', async ()=> {
        const item_1 = { id: 1, name: 'Samsung galaxy s6' };  
        const messageAddedItem = 'Product added';
        await homePage.clickItem(item_1.id, item_1.name);
        await homePage.addToCart(messageAddedItem);            
    }); 
        
});

