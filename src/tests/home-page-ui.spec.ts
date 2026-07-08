import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home-page';
import { CartPage } from '../pages/cart-page';


test.describe('Home page before login', () => {
  let homePage: HomePage;
    test.beforeEach(async ({page}) => {
            homePage = new HomePage(page);
            await homePage.openHomePage(); 
    });         
    test('Verify categories list', async ({page})=> {  
        const categoryList: string[] = ['Phones', 'Laptops', 'Monitors']            
        await homePage.verifyCategories(categoryList);  
    }); 
    test('Verify items have price tag', async ({page})=> {                
        await homePage.verifyAllCardsHavePrices();         
    });      
});
test.describe('Adding products for customer account', () => {
    let homePage: HomePage;
    let cartPage: CartPage;
             
    test('Add item to the card and validate the message', async ({page})=> {
            homePage = new HomePage(page);
            cartPage = new CartPage(page);
            await homePage.openHomePage(); 
            await homePage.loginAs('existing_user');
        const item_1 = { id: 1, name: 'Samsung galaxy s6' };  
        const messageAddedItem = 'Product added.';
        await homePage.clickItem(item_1.id, item_1.name);
        await homePage.addToCart(messageAddedItem); 
        //await page.getByRole('link', { name: 'Delete' }).first().waitFor({ state: 'visible' }); // to write a function that returns the deleteItems locator
        await cartPage.deleteAllItems();  

    }); 
        
});

