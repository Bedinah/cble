'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { handleStockAnalysis } from '@/app/actions';
import { products } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import type { AnalyzeStockDepletionAndSuggestRestockOutput } from '@/ai/flows/analyze-stock-depletion-and-suggest-restock';
import { useToast } from '@/hooks/use-toast';

type AnalysisResult = AnalyzeStockDepletionAndSuggestRestockOutput &amp; { error?: string };

export function StockAnalysis() {
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const selectedProduct = products.find(p => p.id === selectedProductId);

  const onAnalyze = async () => {
    if (!selectedProductId) {
      toast({
        title: 'No Product Selected',
        description: 'Please select a product to analyze.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setAnalysisResult(null);
    const result = await handleStockAnalysis(selectedProductId);
    if(result.error) {
      toast({
        title: 'Analysis Failed',
        description: result.error,
        variant: 'destructive',
      })
    }
    setAnalysisResult(result);
    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">AI-Powered Restock Suggestions</CardTitle>
        <CardDescription>
          Analyze stock depletion rates and get smart suggestions on when and how much to restock.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 space-y-2 sm:space-y-0">
          <Select onValueChange={setSelectedProductId} value={selectedProductId}>
            <SelectTrigger className="w-full sm:w-[280px]">
              <SelectValue placeholder="Select a product..." />
            </SelectTrigger>
            <SelectContent>
              {products.map(product => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={onAnalyze} disabled={isLoading || !selectedProductId} className="w-full sm:w-auto">
            {isLoading ? 'Analyzing...' : 'Analyze Stock'}
          </Button>
        </div>
        
        {selectedProduct && (
          <div className="text-sm text-muted-foreground pt-2">
            Current Stock for <strong>{selectedProduct.name}</strong>: {selectedProduct.stock} units
          </div>
        )}

        {isLoading && (
          <div className="space-y-4 pt-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        )}

        {analysisResult && !analysisResult.error && (
          <Alert className="mt-6">
            <Terminal className="h-4 w-4" />
            <AlertTitle className="font-headline">Analysis Complete</AlertTitle>
            <AlertDescription className="space-y-4">
              <p className="font-bold text-lg text-foreground">
                Suggested Restock Amount: <span className="text-accent">{analysisResult.suggestedRestockAmount} units</span>
              </p>
              <p>{analysisResult.analysisReport}</p>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Powered by Generative AI. Suggestions are based on historical data and may require human oversight.
        </p>
      </CardFooter>
    </Card>
  );
}
