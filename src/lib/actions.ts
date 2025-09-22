'use server';

import { personalizedCropRecommendations } from "@/ai/flows/personalized-crop-recommendations";
import { z } from "zod";

const FormSchema = z.object({
    soilData: z.string().min(10, { message: "Please provide more detailed soil data." }),
    climateData: z.string().min(10, { message: "Please provide more detailed climate data." }),
    location: z.string().min(3, { message: "Please provide a valid location." }),
});

export type State = {
    errors?: {
        soilData?: string[];
        climateData?: string[];
        location?: string[];
    };
    message?: string | null;
    data?: Awaited<ReturnType<typeof personalizedCropRecommendations>> | null;
};

export async function getCropRecommendations(prevState: State, formData: FormData) {
    const validatedFields = FormSchema.safeParse({
        soilData: formData.get('soilData'),
        climateData: formData.get('climateData'),
        location: formData.get('location'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Invalid input. Please check the fields.',
            data: null,
        };
    }

    try {
        const result = await personalizedCropRecommendations(validatedFields.data);
        return {
            message: 'Successfully generated recommendations.',
            data: result,
            errors: {},
        }
    } catch (error) {
        return {
            message: 'Failed to get recommendations from AI. Please try again later.',
            data: null,
            errors: {},
        }
    }
}
