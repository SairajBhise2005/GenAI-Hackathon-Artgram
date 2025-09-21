'use server';

import { z } from 'zod';
import { generateCaptions } from '@/ai/flows/generate-captions';
import { suggestBackgroundMusic } from '@/ai/flows/suggest-background-music';

export type CaptionState = {
  message: string;
  caption?: string;
  error?: string;
};

const CaptionSchema = z.object({
  mediaDataUri: z.string().min(1, 'Media is required.'),
  topic: z.string().min(1, 'Topic is required.'),
});

export async function generateCaptionAction(prevState: CaptionState, formData: FormData): Promise<CaptionState> {
  try {
    const validatedFields = CaptionSchema.safeParse({
      mediaDataUri: formData.get('mediaDataUri'),
      topic: formData.get('topic'),
    });

    if (!validatedFields.success) {
      return {
        message: 'Validation failed.',
        error: validatedFields.error.flatten().fieldErrors.topic?.[0] || 'Invalid input.',
      };
    }
    
    const result = await generateCaptions(validatedFields.data);

    if (result.captions) {
        return { message: 'Success', caption: result.captions };
    } else {
        return { message: 'Failed to generate captions.', error: 'The AI could not generate a caption. Please try again.' };
    }
  } catch (error) {
    console.error(error);
    return { message: 'An unexpected error occurred.', error: 'Could not connect to the AI service.' };
  }
}


export type MusicState = {
    message: string;
    suggestedMusic?: string[];
    reasoning?: string;
    error?: string;
};

const MusicSchema = z.object({
    reelDescription: z.string().min(1, 'Reel description is required.'),
    artForm: z.string().min(1, 'Art form is required.'),
});

export async function suggestMusicAction(prevState: MusicState, formData: FormData): Promise<MusicState> {
    try {
        const validatedFields = MusicSchema.safeParse({
            reelDescription: formData.get('reelDescription'),
            artForm: formData.get('artForm'),
        });

        if (!validatedFields.success) {
            return {
                message: 'Validation failed.',
                error: Object.values(validatedFields.error.flatten().fieldErrors).join(' '),
            };
        }

        const result = await suggestBackgroundMusic(validatedFields.data);
        
        if (result.suggestedMusic && result.suggestedMusic.length > 0) {
            return {
                message: 'Success',
                suggestedMusic: result.suggestedMusic,
                reasoning: result.reasoning,
            };
        } else {
            return {
                message: 'Failed to suggest music.',
                error: 'The AI could not suggest music. Please try again.'
            };
        }
    } catch (error) {
        console.error(error);
        return { message: 'An unexpected error occurred.', error: 'Could not connect to the AI service.' };
    }
}
