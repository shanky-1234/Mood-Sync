import {Mistral} from '@mistralai/mistralai'

const client = new Mistral({apiKey:process.env.MISTRAL_API_KEY})
export const callMistral = async(text) =>{
    const response = await client.chat.complete({
        model:'mistral-medium-latest',
        messages:[{role:'user',content:text}],
        temperature:0.3
    })

    return response.choices[0].message.content
}