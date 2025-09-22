import { RecommendationForm } from "@/components/recommendations/recommendation-form";

export default function RecommendationsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">Crop Recommendations</h1>
                <p className="text-muted-foreground">
                    Leverage AI to discover the most suitable crops for your farm.
                </p>
            </div>
            <RecommendationForm />
        </div>
    );
}
