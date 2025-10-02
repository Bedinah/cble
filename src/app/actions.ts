'use server';

import { analyzeStockDepletionAndSuggestRestock } from '@/ai/flows/analyze-stock-depletion-and-suggest-restock';
import { products, sales } from '@/lib/data';

// This is a simplified example. A real app would query a database.
const getHistoricalSalesData = (productId: string) => {
  const productSales = sales.flatMap(sale => 
    sale.items
      .filter(item => item.productId === productId)
      .map(item => ({ date: sale.date, quantity: item.quantity }))
  );
  return productSales;
};

export async function handleStockAnalysis(productId: string) {
  try {
    const product = products.find(p => p.id === productId);
    if (!product) {
      throw new Error('Product not found');
    }

    const historicalSalesData = getHistoricalSalesData(productId);

    const input = {
      productName: product.name,
      historicalSalesData: JSON.stringify(historicalSalesData, null, 2),
      currentStockLevel: product.stock,
      leadTimeDays: 14, // Example lead time
      targetServiceLevel: 0.95, // Example service level
    };

    const result = await analyzeStockDepletionAndSuggestRestock(input);
    return result;
  } catch (error) {
    console.error('Error in AI stock analysis:', error);
    return {
      error: 'Failed to perform analysis. Please try again.'
    };
  }
}
