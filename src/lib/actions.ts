'use server';

import { analyzeSoilHealth } from "@/ai/flows/analyze-soil-health";
import { personalizedCropRecommendations } from "@/ai/flows/personalized-crop-recommendations";
import { z } from "zod";

const CropFormSchema = z.object({
    soilData: z.string().min(10, { message: "Please provide more detailed soil data." }),
    climateData: z.string().min(10, { message: "Please provide more detailed climate data." }),
    location: z.string().min(3, { message: "Please provide a valid location." }),
});

export type CropRecState = {
    errors?: {
        soilData?: string[];
        climateData?: string[];
        location?: string[];
    };
    message?: string | null;
    data?: Awaited<ReturnType<typeof personalizedCropRecommendations>> | null;
};

export async function getCropRecommendations(prevState: CropRecState, formData: FormData): Promise<CropRecState> {
    const validatedFields = CropFormSchema.safeParse({
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
        console.error(error);
        return {
            message: 'Failed to get recommendations from AI. Please check your internet connection and try again.',
            data: null,
            errors: {},
        }
    }
}


const SoilHealthFormSchema = z.object({
    soilData: z.string().min(10, { message: "Please provide more detailed soil data." }),
    location: z.string().min(3, { message: "Please provide a valid location." }),
    climateData: z.string().optional(),
});

export type SoilHealthState = {
    errors?: {
        soilData?: string[];
        location?: string[];
        climateData?: string[];
    };
    message?: string | null;
    data?: Awaited<ReturnType<typeof analyzeSoilHealth>> | null;
};


export async function getSoilHealthAnalysis(prevState: SoilHealthState, formData: FormData): Promise<SoilHealthState> {
    const validatedFields = SoilHealthFormSchema.safeParse({
        soilData: formData.get('soilData'),
        location: formData.get('location'),
        climateData: formData.get('climateData'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Invalid input. Please check the fields.',
            data: null,
        };
    }
    
    const climateData = validatedFields.data.climateData || 'Average regional climate conditions for the specified location.';

    try {
        const result = await analyzeSoilHealth({
            ...validatedFields.data,
            climateData: climateData,
        });
        return {
            message: 'Successfully generated soil health analysis.',
            data: result,
            errors: {},
        }
    } catch (error) {
        console.error(error);
        return {
            message: 'Failed to get soil health analysis from AI. Please check your internet connection and try again.',
            data: null,
            errors: {},
        }
    }
}
