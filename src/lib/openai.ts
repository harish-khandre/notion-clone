import { Configuration, OpenAIApi } from "openai-edge";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function generateImagePrompt(name: string) {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a creative and helpful AI assistant capable of generating interesting thumbnail descriptions for my notes. Your output will be fed into the DALL·E API to generate a thumbnail. The description should be artistic and inspired by Frank Stella",
        },
        {
          role: "user",
          content: `Please generate a thumbnail description for my notebook titled ${name}`,
        },
      ],
    });

    const data = await response.json();

    // Check if data.choices is defined and has at least one element
    if (data.choices && data.choices.length > 0) {
      const image_description = data.choices[0].message.content;
      return image_description as string;
    } else {
      // Handle the case where data.choices is empty or undefined
      throw new Error("No response content available.");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function generateImage(image_description: string) {
  try {
    const response = await openai.createImage({
      prompt: image_description,
      n: 1,
      size: "256x256",
    });
    const data = await response.json();
    const image_url = data.data[0].url;
    return image_url as string;
  } catch (error) {
    console.error(error);
  }
}
