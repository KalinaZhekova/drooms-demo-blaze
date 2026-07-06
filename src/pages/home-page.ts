import {Locator, Page, expect} from '@playwright/test';
import { BasePage } from './base-page';
import { config } from '../config/config';
import { users, User } from '../data/users';



export class HomePage extends BasePage {
    private phonesCategory: Locator;
    private laptopsCategory: Locator;
    private monitorsCategory: Locator;
    private homePageUrl: string;
    private categoryItems: Locator;
    private productCards: Locator;
    private priceElements: Locator;
    private loginLink: Locator;
    private usernameInput: Locator;
    private passwordInput: Locator;
    private loginButton: Locator;
    private addToCartButton: Locator;
    private loginModal: Locator;

    constructor(page: Page) {
        super(page); 
        this.page = page; 
        // Get all cards
        this.productCards = page.locator('div.card.h-100');
        // Get all price tags
        this.priceElements = page.locator('div.card.h-100 h5');
        this.phonesCategory = page.locator('a.list-group-item', { hasText: 'Phones' });
        this.laptopsCategory = page.locator('a.list-group-item', { hasText: 'Laptops' });
        this.monitorsCategory = page.locator('a.list-group-item', { hasText: 'Monitors' }); 
        this.categoryItems = page.locator('a.list-group-item#itemc');
        this.loginLink = page.locator('#login2');
        this.loginModal = page.locator('#logInModal');
        this.usernameInput = page.locator('#loginusername');
        this.passwordInput = page.locator('#loginpassword');
        this.loginButton = this.loginModal.locator('button:has-text("Log in")');
        this.addToCartButton = page.locator('a', { hasText: 'Add to cart'})
        this.homePageUrl = `${config.baseUrl}`;       
      }

async openHomePage(): Promise<void> {
    await this.navigate(this.homePageUrl);
  }

async loginAs(userKey: keyof typeof users) {
  const user: User = users[userKey];

  this.page.on('dialog', dialog => dialog.accept());

  await this.loginLink.click();
  await expect(this.loginModal).toBeVisible();
  await this.usernameInput.fill(user.username);
  await this.passwordInput.fill(user.password);
  await this.loginButton.click();
  await this.loginModal.waitFor({ state: 'hidden' });
}

async verifyCategories(): Promise<void> {
  // Verify each category is visible (hasText already validates the name)
  await expect(this.phonesCategory).toBeVisible();
  await expect(this.laptopsCategory).toBeVisible();
  await expect(this.monitorsCategory).toBeVisible();  
  // Verify exactly 3 categories exist
  await expect(this.categoryItems).toHaveCount(3);

    }

async verifyAllCardsHavePrices(): Promise<void> {    
  const cardCount = await this.productCards.count();
  const priceCount = await this.priceElements.count();
  expect(cardCount).toBe(priceCount);
 
  // Verify each price exists and is visible
  for (let i = 0; i < priceCount; i++) {
    const price = this.priceElements.nth(i);
    await expect(price).toBeVisible();
    
    const priceText = await price.textContent();
    expect(priceText?.trim()).toBeTruthy();
    console.log(`✓ Card ${i + 1} has price: ${priceText}`);
  }
    }

private getItem(productId: number, productName: string): Locator {
  return this.page.locator(
    `a[href="prod.html?idp_=${productId}"]`,
    { hasText: productName }
  );
    }

async clickItem(productId: number, productName: string): Promise<void> {
  await this.getItem(productId, productName).click();
  await expect(this.page).toHaveURL(new RegExp(`idp_=${productId}`));
} 

async addToCart(message: string): Promise<void> {
  const dialogPromise = this.page.waitForEvent('dialog');

  await this.addToCartButton.click();

  const dialog = await dialogPromise;
  expect(dialog.message()).toBe(message);
  await dialog.accept();
}


}
