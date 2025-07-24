import axios from 'axios';

// DO NOT TOUCH!!
const version = "0.0.2";

interface _ReqConfg {
  "User-Agent": string;
  Endpoint: string;
}

class Client(token: string) {
  public token: string;
  private config: _ReqConfg;
  constructor() {
    this.token = token;
    this.config = { "User-Agent": `LyntrJS-bot ${version}`, Endpoint: "https://lyntr.jnnj.xyz/api/" }
  }

  public async SendMessage({ message, id }: { message: string; id: string }) {
    try {
      const response = await axios.post(this.config.Endpoint + 'comment', {
        id,
        content: message,
      }, {
        headers: {
          'Accept': '*/*',
          'Accept-Language': 'en-US,en;q=0.7',
          'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary75Bv3AOwNH7vJFNe',
          'Cookie': `${this.token}`,
          'Origin': 'https://lyntr.jnnj.xyz',
          'Referer': `https://lyntr.jnnj.xyz/?id=${id}`,
          'User-Agent': this.config["User-Agent"]
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
  
  private async findMessages(searchTerm: string): Promise<string[]> {
    try {
      const response = await axios.get(this.config.Endpoint + 'feed', {
        params: { type: 'New' },
        headers: {
          accept: '*/*',
          'accept-language': 'en-US,en;q=0.7',
          cookie: `${this.token}`,
          priority: 'u=1, i',
          referer: 'https://lyntr.jnnj.xyz/',
          '^sec-ch-ua': '^\^Not'
        }
      });
  
      const foundMessageIds: string[] = [];
      for (const lynt of response.data.lynts) {
        if (lynt.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lynt.content.toLowerCase().startsWith(searchTerm.toLowerCase())) {
          foundMessageIds.push(lynt.id);
        }
      }
  
      return foundMessageIds;
    } catch (error) {
      console.error('Error finding messages:', error);
      return [];
    }
  }
  
  public async ContinuousSearch(searchTerm: string) {
    while (true) {
      const messageIds = await findMessages(this.token, searchTerm);
      console.log('Found message IDs:', messageIds);
  
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  }
}

export { class };
