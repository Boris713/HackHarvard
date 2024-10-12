import { HfInference } from '@huggingface/inference'

const hf = new HfInference(process.env.HF_TOKEN);

const output = await hf.featureExtraction({
    model: 'intfloat/e5-small-v2',
    inputs: 'We are going to win the hackathon',
});

console.log(output);