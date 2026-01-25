import {InferenceClient} from '@huggingface/inference'


const client = new InferenceClient(process.env.HF_API_KEY)
export const callGoEmotion = async(text)=>{
    const result = await client.textClassification({
        inputs:text,
        model:'SamLowe/roberta-base-go_emotions'
    })

    return result
    
}