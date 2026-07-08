import {Locator, Page} from '@playwright/test';
import { BasePage } from './base-page';
import { config } from '../config/config';


export class CartPage extends BasePage {
    private deleteLink: Locator;
    private cartPageUrl: string;  

    constructor(page: Page) {
        super(page); 
        this.page = page; 
        // Get all delete links in the table
        this.deleteLink = page.locator('a[onclick*="deleteItem"]');
        this.cartPageUrl = `${config.baseUrl}${config.cartUrl}`;       
      }

async openCartPage(): Promise<void> {
    await this.navigate(this.cartPageUrl);
  }

async getDeleteLinksCount(): Promise<number> {
    await this.openCartPage();
    const deleteLinks = this.page.getByRole('link', { name: 'Delete' });
    await deleteLinks.first().waitFor({ state: 'visible' });
    return await this.deleteLink.count();
}

async deleteAllItems(): Promise<void> {
  const count = await this.getDeleteLinksCount();  
  // Get initial count of delete links
  let deleteLinks = this.page.getByRole('link', { name: 'Delete' });
  //let count = await deleteLinks.count();  
  //console.log(`Found ${count} items to delete`);  
  // Click each delete link
  for (let i = 0; i < count; i++) {
    deleteLinks = this.page.getByRole('link', { name: 'Delete' });    
    // Click the first delete link
    await deleteLinks.first().click();
    console.log(`✓ Deleted item ${i + 1}`);    
    // Wait for page to update
    await this.page.waitForTimeout(1000);
  }  
  console.log(`✓ All ${count} items deleted`);
}
}
