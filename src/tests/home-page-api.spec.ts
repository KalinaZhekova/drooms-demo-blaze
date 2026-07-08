import { test, expect} from '@playwright/test';
import { ApiClient } from '../api/clients/api-client';
import { categories } from '../data/categories';
import { ShoppingService } from '../api/services/shopping-service';


test.describe('Returned entries', () => {
  
  test('Verify entries end point returns 9 items', async ({ request }) => {
    const apiClient = new ApiClient(request);
    const response = await apiClient.getEntries();
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.Items).toHaveLength(9);
  });
   
});

test.describe('Category filtering', () => {
  let apiClient: ApiClient;

  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request);
  });

  test('Correct number of items per category is returned', async () => {
  for (const { category, expectedCount } of categories) {   

    const response = await apiClient.getEntriesByCategory(category);
    const body = await response.json();

    expect(response.status()).toBe(200);    
    expect(response.ok()).toBeTruthy();    
    expect(body.Items).toBeDefined();
    expect(Array.isArray(body.Items)).toBeTruthy();
    expect(body.Items.length).toBe(expectedCount);
        }
    });  

    
});

test.describe('Buying products', () => {
    let shoppingService: ShoppingService;
    let apiClient: ApiClient;

  test.beforeEach(async ({ request, page }) => {
    apiClient = new ApiClient(request);
    shoppingService = new ShoppingService(apiClient, page); 
  });
    
   test('Adding two products at the cart', async()=>{
     await shoppingService.addProductsToCart(
    'existing_user',                                    
    'phone',                                            
    ['Samsung galaxy s6', 'HTC One M9'],
       
  );
  });
   
    
});