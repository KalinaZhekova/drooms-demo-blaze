import { test, expect } from '@playwright/test';
import { ApiClient } from '../api/api-client';
import { categories } from '../data/categories';
import { request } from 'node:http';


test.describe('Returned entries', () => {
  
  test('entries end point returns 9 items', async ({ request }) => {
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

  test('correct number of items per category is returned', async () => {
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
    let apiClient: ApiClient;

  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request);
  });
    
   test.only('add two products at the cart', async({page})=>{
     await apiClient.addProductsToCart(
    'existing_user',                                    
    'phone',                                            
    ['Samsung galaxy s6', 'HTC One M9'],
    page      
  );
  });
   
    
});