import {NextResponse} from 'next/server'
import OpenAI from 'openai'

const systemPrompt = `
You are a flashcard creator. Your task is to generate concise and effective flashcards based on the following guidelines:

1. Create clear and concise questions for the front of the flashcard.
2. Provide accurate and informative answers for the back of the flashcard.
3. Ensure that each flashcard focuses on a single concept or piece of information.
4. Use simple language to make the flashcards accessible to a wide range of learners.
You are a flashcard creator.
6. Generate flashcards if given one word based on the words but if there is multiple words given as input create flashcards based on that text
7. if there is an image input. read all the text given in the image and make flashcards based on that text. Make in depth flashcards cover all given point
5. Only Generate 12 flashcards

Return in the following json format 

{
    "flashcards":[
    {
        "front": str,
        "back": str
    }
]
}
`
export async function POST(req){
    const openai = new OpenAI(process.env.OPENAI_API_KEY)
    const data = await req.text()

    const completion = await openai.chat.completions.create({
        messages: [
            {role: 'system', content: systemPrompt},
            {role: 'user', content:data}
        ],
        model: "gpt-4o",
        response_format: {type: 'json_object'},
   })


const flashcards = JSON.parse(completion.choices[0].message.content)

return NextResponse.json(flashcards.flashcards);

}