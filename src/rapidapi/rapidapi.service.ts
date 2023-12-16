import { Injectable } from '@nestjs/common';
import axios from 'axios';
import 'dotenv/config';

@Injectable()
export class RapidAPIService {
  async getTrendingData(): Promise<any> {
    try {
      const encodedParams = new URLSearchParams();
      encodedParams.set('woeid', '23424819'); // 23424819 is the WOEID for France

      const options = {
        method: 'POST',
        url: 'https://twitter-trends5.p.rapidapi.com/twitter/request.php',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'X-RapidAPI-Key': `${process.env.RAPIDAPI_KEY}`,
          'X-RapidAPI-Host': 'twitter-trends5.p.rapidapi.com',
        },
        data: encodedParams,
      };
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error('Error fetching data from RapidAPI:', error);
      throw error;
    }
  }
}
