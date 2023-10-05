import { OpenAIApi, Configuration } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from 'ai'


const config= new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(config);

export async function POST(req: Request){
    const {prompt} = await req.json()

    const response  = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{
            role: 'system',
            content: "Act as a expert copywriter who is embedded in note app which is used to autocomplete the writers vision "
        }, {
            role: 'user',
            content: `I am writing a text in note app help me with this ##${prompt} match the tone and keep the response short`
        }],
         stream: true
    });
    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream)
}