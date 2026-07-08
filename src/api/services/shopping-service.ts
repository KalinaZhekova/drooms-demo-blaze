import { expect , Page} from '@playwright/test';
import { ApiClient } from '../clients/api-client';
import { users } from '../../data/users';

export class ShoppingService {
  constructor(private apiClient: ApiClient, private page: Page) {}

  async clearSession(): Promise<void> {
    await this.page.context().clearCookies();
    console.log('✓ Session cleared');
  }

  async addProductsToCart(
    userKey: keyof typeof users,
    category: string,
    productTitles: string[]
  ): Promise<void> {
    await this.clearSession();

    const authToken = await this.apiClient.getAuthToken(userKey);
    console.log('✓ Auth token obtained');
    
    const productIds = await this.apiClient.getProductIdsByTitles(category, productTitles);
    console.log(`✓ Found ${productIds.length} products: ${productIds}`);
    
    const addedUuids: string[] = [];
    
    for (const productId of productIds) {
      const uuid = await this.apiClient.addToCart(authToken, productId.toString());
      addedUuids.push(uuid);
      console.log(`✓ Added product ${productId} to cart (UUID: ${uuid})`);
    }
    
    console.log(`✓ Successfully added ${productIds.length} products to cart`);

    const cartResponse = await this.apiClient.viewCart(authToken);
    const cartData = await cartResponse.json();

    expect(cartData.Items).toBeDefined();
    expect(cartData.Items.length).toBe(productIds.length);
    console.log(`✓ Cart contains exactly ${productIds.length} items`);

    for (const productId of productIds) {
      const productIdNum = Number(productId);
      const found = cartData.Items.some((item: any) => Number(item.prod_id) === productIdNum);
      expect(found).toBeTruthy();
      console.log(`✓ Product ${productIdNum} found in cart`);
    }
    // Cleanup: remove all added products
    console.log('\nCleaning cart...');

    for (const uuid of addedUuids) {
    await this.apiClient.deleteFromCart(uuid);
  }

    console.log('✓ Cart cleanup completed');
  }

}