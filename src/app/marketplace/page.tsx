'use client';
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { getMarketPrices, MarketPriceRecord } from "@/ai/flows/get-market-prices";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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
    const [marketData, setMarketData] = useState<MarketPriceRecord[]>([]);
    const [filteredMarketData, setFilteredMarketData] = useState<MarketPriceRecord[]>([]);
    const [states, setStates] = useState<string[]>([]);
    const [districts, setDistricts] = useState<string[]>([]);
    const [selectedState, setSelectedState] = useState<string | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchMarketData() {
            try {
                setLoading(true);
                const data = await getMarketPrices();
                setMarketData(data.records);
                setFilteredMarketData(data.records);
                const uniqueStates = [...new Set(data.records.map(record => record.state))];
                setStates(uniqueStates);
            } catch (e) {
                setError("Failed to fetch market data. Please try again later.");
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchMarketData();
    }, []);

    const handleStateChange = (state: string) => {
        setSelectedState(state);
        setSelectedDistrict(null);
        const stateDistricts = [...new Set(marketData.filter(record => record.state === state).map(record => record.district))];
        setDistricts(stateDistricts);
        setFilteredMarketData(marketData.filter(record => record.state === state));
    };

    const handleDistrictChange = (district: string) => {
        setSelectedDistrict(district);
        if (selectedState) {
            setFilteredMarketData(marketData.filter(record => record.state === selectedState && record.district === district));
        }
    };


    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">Marketplace</h1>
                <p className="text-muted-foreground">
                    View live agricultural market rates from various APMCs across India.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Filter Markets</CardTitle>
                    <CardDescription>Select a state and district to narrow down results.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="state-select">State</Label>
                            <Select onValueChange={handleStateChange} value={selectedState || ""}>
                                <SelectTrigger id="state-select">
                                    <SelectValue placeholder="Select a state" />
                                </SelectTrigger>
                                <SelectContent>
                                    {states.map(state => (
                                        <SelectItem key={state} value={state}>{state}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor="district-select">District</Label>
                            <Select onValueChange={handleDistrictChange} value={selectedDistrict || ""} disabled={!selectedState}>
                                <SelectTrigger id="district-select">
                                    <SelectValue placeholder="Select a district" />
                                </SelectTrigger>
                                <SelectContent>
                                    {districts.map(district => (
                                        <SelectItem key={district} value={district}>{district}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Live Market Prices</CardTitle>
                            <CardDescription>
                                Latest prices for various crops sold across different markets.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                             {loading && (
                                <div className="flex items-center justify-center h-64">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    <p className="ml-4 text-muted-foreground">Loading market data...</p>
                                </div>
                            )}
                            {error && <p className="text-destructive">{error}</p>}
                            {!loading && !error && (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Crop</TableHead>
                                            <TableHead>Market</TableHead>
                                            <TableHead className="text-right">Price (₹ per Quintal)</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredMarketData.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <div className="font-medium">{item.commodity}</div>
                                                    <div className="text-sm text-muted-foreground">{item.variety}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{item.market}, {item.district}</Badge>
                                                </TableCell>
                                                <TableCell className="text-right font-semibold">₹{item.modal_price}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </div>
                 <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Wheat Price Trend</CardTitle>
                            <CardDescription>Nashik APMC - Last 6 Months (Placeholder)</CardDescription>
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
