"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getArtisanCategories, getProducts } from "@/lib/data-services";
import { useToast } from "@/hooks/use-toast";

export function DatabaseTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const { toast } = useToast();

  const runDatabaseTests = async () => {
    setIsLoading(true);
    const results: Record<string, any> = {};

    try {
      // Test 1: Get artisan categories
      console.log("Testing artisan categories...");
      const categoriesResult = await getArtisanCategories();
      results.categories = categoriesResult;
      console.log("Categories result:", categoriesResult);

      // Test 2: Get products
      console.log("Testing products...");
      const productsResult = await getProducts({ limit: 5 });
      results.products = productsResult;
      console.log("Products result:", productsResult);

      setTestResults(results);

      toast({
        title: "Database tests completed!",
        description: "Check the console and results below for details.",
      });
    } catch (error) {
      console.error("Database test error:", error);
      toast({
        title: "Database test failed",
        description: "Check the console for error details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Database Connection Test</CardTitle>
        <CardDescription>
          Test the connection to your Supabase database and verify the new
          schema is working.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={runDatabaseTests}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Testing..." : "Run Database Tests"}
        </Button>

        {Object.keys(testResults).length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Test Results:</h3>

            {testResults.categories && (
              <div>
                <h4 className="font-medium mb-2">Artisan Categories:</h4>
                <div className="flex flex-wrap gap-2">
                  {testResults.categories.success ? (
                    testResults.categories.data?.map((category: any) => (
                      <Badge key={category.id} variant="secondary">
                        {category.name}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="destructive">
                      Error: {testResults.categories.error}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {testResults.products && (
              <div>
                <h4 className="font-medium mb-2">Products:</h4>
                <div className="text-sm text-muted-foreground">
                  {testResults.products.success ? (
                    `Found ${testResults.products.data?.length || 0} products`
                  ) : (
                    <Badge variant="destructive">
                      Error: {testResults.products.error}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="text-sm text-muted-foreground">
          <p>
            <strong>Instructions:</strong>
          </p>
          <ol className="list-decimal list-inside space-y-1 mt-2">
            <li>
              Make sure you've applied the new database schema in Supabase
            </li>
            <li>Ensure your environment variables are set correctly</li>
            <li>Click "Run Database Tests" to verify the connection</li>
            <li>Check the browser console for detailed logs</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
