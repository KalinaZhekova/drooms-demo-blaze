# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: home-page-api.spec.ts >> Buying products >> add two products at the cart
- Location: src\tests\home-page-api.spec.ts:51:9

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
```

# Test source

```ts
  15  |     data: { cat: category }
  16  |   });
  17  | }
  18  | 
  19  | async login(userKey: keyof typeof users) {
  20  |   const user: User = users[userKey];
  21  | 
  22  |   return await this.request.post(`${config.apiBaseUrl}/login`, {
  23  |     data: {
  24  |       username: user.username,
  25  |       password: user.password //to encode it to base64
  26  |     }
  27  |   });
  28  | }
  29  | 
  30  | async addToCart(
  31  |   authToken: string,
  32  |   productId: string
  33  | ): Promise<APIResponse> {
  34  |   return await this.request.post(`${config.apiBaseUrl}/addtocart`, {
  35  |     data: {
  36  |       id: randomUUID(), //works with random uuid
  37  |       cookie: authToken,
  38  |       prod_id: productId,
  39  |       flag: true 
  40  |     }
  41  |   });
  42  | }
  43  | 
  44  | async viewCart(authToken: string) : Promise<APIResponse>{
  45  |     return await this.request.post(`${config.apiBaseUrl}/viewcart`, {
  46  |     data: {      
  47  |       cookie: authToken,
  48  |       flag: true 
  49  |     }
  50  |   });
  51  | 
  52  | }
  53  | async getProductIdsByTitles(
  54  |   category: string,
  55  |   titles: string[]
  56  | ): Promise<number[]> {
  57  |   const response = await this.getEntriesByCategory(category);
  58  | 
  59  |   const body = await response.json();
  60  | 
  61  |   return body.Items
  62  |     .filter((item: { title: string }) => titles.includes(item.title.trim()))
  63  |     .map((item: { id: number }) => item.id);
  64  | }
  65  | 
  66  | async getAuthToken(userKey: keyof typeof users): Promise<string> {
  67  |   const user: User = users[userKey];
  68  |   // Encode password to base64
  69  |   const encodedPassword = Buffer.from(user.password).toString('base64');
  70  | 
  71  |   const response = await this.request.post(`${config.apiBaseUrl}/login`, {
  72  |     data: {
  73  |       username: user.username,
  74  |       password: 'UGFzc3dvcmQjMjAyNg=='
  75  |     }
  76  |   });
  77  | 
  78  |   const responseText = await response.text();
  79  |   const [, token] = responseText.split(':');
  80  |   return token.trim().replace(/"/g, '');
  81  | }
  82  | 
  83  | async addProductsToCart(
  84  |   userKey: keyof typeof users,
  85  |   category: string,
  86  |   productTitles: string[],
  87  |   page: any
  88  | ): Promise<void> {
  89  |   // Step 1: Get auth token
  90  |   const authToken = await this.getAuthToken(userKey);
  91  |   console.log('✓ Auth token obtained');
  92  |   
  93  |   // Step 2: Get product IDs by titles
  94  |   const productIds = await this.getProductIdsByTitles(category, productTitles);
  95  |   console.log(`✓ Found ${productIds.length} products: ${productIds}`);
  96  |   
  97  |   // Step 3: Add each product to cart
  98  |   for (const productId of productIds) {
  99  |     console.log(authToken);
  100 |     const response = await this.addToCart(authToken, productId.toString());
  101 |     expect(response.status()).toBe(200);
  102 |     console.log(`✓ Added product ${productId} to cart`);
  103 |   }
  104 |   
  105 |   console.log(`✓ Successfully added ${productIds.length} products to cart`);
  106 | 
  107 |   // Verify in cart
  108 |   const cartResponse = await this.viewCart(authToken);
  109 |   const cartData = await cartResponse.json();
  110 |   
  111 |  console.log('Cart response:', JSON.stringify(cartData, null, 2));
  112 |  for (const productId of productIds) {
  113 |   const found = cartData.Items.some((item: any) => item.prod_id === productId);
  114 |   console.log(`Found: ${found}`);
> 115 |   expect(found).toBeTruthy();
      |                 ^ Error: expect(received).toBeTruthy()
  116 |   console.log(`✓ Product ${productId} verified in cart`);
  117 | }
  118 | await page.context().clearCookies();
  119 | console.log(authToken);
  120 | }
  121 | }
```