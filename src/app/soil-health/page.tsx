import { SoilHealthForm } from "@/components/soil/soil-health-form";

export default function SoilHealthPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">Soil Health Monitoring</h1>
                <p className="text-muted-foreground">
                    Understand your soil's health and get AI-powered tips to improve it.
                </p>
            </div>
            <SoilHealthForm />
        </div>
    );
}
