import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { config } from '../../config/config';
import { users, User } from '../../data/users';
import { randomUUID } from 'crypto';

export class ApiClient {
  constructor(private request: APIRequestContext) { }

  async getEntries() {
    return await this.request.get(`${config.apiBaseUrl}/entries`);
  }

  async getEntriesByCategory(category: string) {
    return await this.request.post(`${config.apiBaseUrl}/bycat`, {
      data: { cat: category }
    });
  }

  async addToCart(
    authToken: string,
    productId: string
  ): Promise<string> {
    const uuid = randomUUID();

    const response = await this.request.post(`${config.apiBaseUrl}/addtocart`, {
      data: {
        id: uuid,
        cookie: authToken,
        prod_id: productId,
        flag: true
      }
    });

    expect(response.status()).toBe(200);
    return uuid;
  }

  async viewCart(authToken: string): Promise<APIResponse> {
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
        password: encodedPassword//'UGFzc3dvcmQjMjAyNg=='
      }
    });

    const responseText = await response.text();
    const [, token] = responseText.split(':');
    return token.trim().replace(/"/g, '');
  }

  async clearSession(page: any): Promise<void> {
    await page.context().clearCookies();
    console.log('✓ Session cleared');
  }

  async deleteFromCart(uuid: string): Promise<void> {
  console.log(`\nDeleting item ${uuid} from cart...`);

  const response = await this.request.post(`${config.apiBaseUrl}/deleteitem`, {
    data: {
      id: uuid
    }
  });
  expect(response.status()).toBe(200);
  console.log(`✓ Deleted item ${uuid}`);
}

} 
