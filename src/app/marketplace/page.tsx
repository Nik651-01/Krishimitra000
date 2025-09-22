
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const marketData = [
    { crop: "Wheat", variety: "Lokwan", market: "Nashik APMC", quantity: "1 Quintal", price: "₹2,500" },
    { crop: "Grapes", variety: "Thompson Seedless", market: "Pune (Gultekdi)", quantity: "1 Quintal", price: "₹6,000" },
    { crop: "Onion", variety: "Red", market: "Lasalgaon", quantity: "1 Quintal", price: "₹1,800" },
    { crop: "Soybean", variety: "JS 335", market: "Nagpur", quantity: "1 Quintal", price: "₹4,500" },
    { crop: "Cotton", variety: "Long Staple", market: "Jalgaon", quantity: "1 Quintal", price: "₹7,200" },
    { crop: "Pomegranate", variety: "Bhagwa", market: "Solapur", quantity: "1 Quintal", price: "₹11,000" },
];

const priceTrendData = [
  { date: "Jan", price: 2200 },
  { date: "Feb", price: 2300 },
  { date: "Mar", price: 2250 },
  { date: "Apr", price: 2400 },
  { date: "May", price: 2500 },
  { date: "Jun", price: 2450 },
];

const chartConfig = {
  price: {
    label: "Price (₹)",
    color: "hsl(var(--primary))",
  },
};


export default function MarketplacePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">Marketplace</h1>
                <p className="text-muted-foreground">
                    View live agricultural market rates from various APMCs.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Live Market Prices</CardTitle>
                            <CardDescription>
                                Prices for various crops sold today across different markets. API integration pending.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Crop</TableHead>
                                        <TableHead>Market</TableHead>
                                        <TableHead className="text-right">Price</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {marketData.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <div className="font-medium">{item.crop}</div>
                                                <div className="text-sm text-muted-foreground">{item.variety}</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{item.market}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-semibold">{item.price}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
                 <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Wheat Price Trend</CardTitle>
                            <CardDescription>Nashik APMC - Last 6 Months</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig} className="w-full h-[250px]">
                                <BarChart accessibilityLayer data={priceTrendData}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        tickLine={false}
                                        tickMargin={10}
                                        axisLine={false}
                                        tickFormatter={(value) => value.slice(0, 3)}
                                    />
                                     <YAxis
                                        tickFormatter={(value) => `₹${value / 1000}k`}
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent indicator="dot" />}
                                    />
                                    <Bar dataKey="price" fill="var(--color-price)" radius={4} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
