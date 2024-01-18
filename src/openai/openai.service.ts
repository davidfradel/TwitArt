import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import 'dotenv/config';

@Injectable()
export class OpenAIService {
  private openAiClient: OpenAI;

  constructor() {
    this.openAiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generatePrompt(data: any): Promise<string> {
    const completion = await this.openAiClient.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `Create a prompt for an image linked to the following table, ignoring anything related to sport and more particularly football. I would like you to choose names from the table that have things in common to create a unique work and not lots of small images in a large image.
You have the choice to make an arbitrary choice by taking a theme from the list and creating a work from it as if you were a surrealist painter and you were going to be exhibited at the Georges Pompidou Museum of Modern Art in Paris. Surprise us by imagining what modern art will be like in a century! : ${data}`,
        },
      ],
      model: 'gpt-4-1106-preview',
    });

    if (
      completion.choices &&
      completion.choices.length > 0 &&
      completion.choices[0].message
    ) {
      //console.log(completion.choices[0].message.content);
      return completion.choices[0].message.content.trim();
    } else {
      throw new Error('No completion found.');
    }
  }

  async generateImage(prompt: string): Promise<string> {
    try {
      const response = await this.openAiClient.images.generate({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: '1024x1024',
      });
      const image_url = response.data[0].url;
      //console.log('response.data', response.data);
      return image_url;
    } catch (error) {
      console.error('Error generating image:', error);
      throw error;
    }
  }
}
