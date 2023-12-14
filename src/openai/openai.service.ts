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
          content: `Create a prompt for an image related to the following array: ${data}`,
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
