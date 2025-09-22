import { Assistant } from "@/components/assistant/assistant-chat";

export default function AssistantPage() {
    return (
        <div className="flex flex-col h-full">
            <div className="mb-6">
                <h1 className="text-3xl font-bold font-headline">AI Assistant</h1>
                <p className="text-muted-foreground">
                    Ask KrishiMitra anything about farming in India.
                </p>
            </div>
            <div className="flex-1 flex flex-col">
                <Assistant />
            </div>
        </div>
    );
}
