import { Configuration, OpenAIApi } from 'openai-edge';
import { OpenAIStream, StreamingTextResponse } from 'ai';

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

// Set the runtime to edge for best performance
export const runtime = 'edge';

export async function POST(req: Request) {
  const { action, flav } = await req.json();

  // Ask OpenAI for a streaming completion given the prompt
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: [
      {
        role: 'user',
        content: `Generate a descriptions of a dnd5e character critically failing to perform a ${action} as if they had rolled a natural 1 in the game."
        Make sure both description is less than 250 characters, is slightly comedic, is very embarassing, and is based on this intended action: ${flav}${
          flav.slice(-1) === '.' ? '' : '.'
        } After the description, add a sentence to describing how its outcome affects the character in the game negatively, as oulined in the rules of dnd5e.`
      },
    ],
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
