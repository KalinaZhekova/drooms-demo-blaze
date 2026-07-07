import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { config } from '../config/config';
import { users, User } from '../data/users';
import { randomUUID } from 'crypto';

export class ApiClient {
  constructor(private request: APIRequestContext) {}
  
async getEntries() {
    return await this.request.get(`${config.apiBaseUrl}/entries`);
  }

async getEntriesByCategory(category: string) {
  return await this.request.post(`${config.apiBaseUrl}/bycat`, {
    data: { cat: category }
  });
}

async login(userKey: keyof typeof users) {
  const user: User = users[userKey];

  return await this.request.post(`${config.apiBaseUrl}/login`, {
    data: {
      username: user.username,
      password: user.password //to encode it to base64
    }
  });
}

async addToCart(
  authToken: string,
  productId: string
): Promise<APIResponse> {
  return await this.request.post(`${config.apiBaseUrl}/addtocart`, {
    data: {
      id: randomUUID(), //works with random uuid
      cookie: authToken,
      prod_id: productId,
      flag: true 
    }
  });
}

async viewCart(authToken: string) : Promise<APIResponse>{
    return await this.request.post(`${config.apiBaseUrl}/viewcart`, {
    data: {      
      cookie: authToken,
      flag: true 
    }
  });

}
async getProductIdsByTitles(
  category: string,
  titles: string[]
): Promise<number[]> {
  const response = await this.getEntriesByCategory(category);

  const body = await response.json();

  return body.Items
    .filter((item: { title: string }) => titles.includes(item.title.trim()))
    .map((item: { id: number }) => item.id);
}

async getAuthToken(userKey: keyof typeof users): Promise<string> {
  const user: User = users[userKey];
  // Encode password to base64
  const encodedPassword = Buffer.from(user.password).toString('base64');

  const response = await this.request.post(`${config.apiBaseUrl}/login`, {
    data: {
      username: user.username,
      password: 'UGFzc3dvcmQjMjAyNg=='
    }
  });

  const responseText = await response.text();
  const [, token] = responseText.split(':');
  return token.trim().replace(/"/g, '');
}

async addProductsToCart(
  userKey: keyof typeof users,
  category: string,
  productTitles: string[],
  page: any
): Promise<void> {
  // Step 1: Get auth token
  const authToken = await this.getAuthToken(userKey);
  console.log('✓ Auth token obtained');
  
  // Step 2: Get product IDs by titles
  const productIds = await this.getProductIdsByTitles(category, productTitles);
  console.log(`✓ Found ${productIds.length} products: ${productIds}`);
  
  // Step 3: Add each product to cart
  for (const productId of productIds) {
    console.log(authToken);
    const response = await this.addToCart(authToken, productId.toString());
    expect(response.status()).toBe(200);
    console.log(`✓ Added product ${productId} to cart`);
  }
  
  console.log(`✓ Successfully added ${productIds.length} products to cart`);

  // Verify in cart
  const cartResponse = await this.viewCart(authToken);
  const cartData = await cartResponse.json();
  
 console.log('Cart response:', JSON.stringify(cartData, null, 2));
 for (const productId of productIds) {
  const found = cartData.Items.some((item: any) => item.prod_id === productId);
  console.log(`Found: ${found}`);
  expect(found).toBeTruthy();
  console.log(`✓ Product ${productId} verified in cart`);
}
await page.context().clearCookies();
console.log(authToken);
}
}