export interface Option {
    id: string
    city: string
    country: string
}

export interface QuizData {
    questionId: string
    clues: string[]
    options: Option[]
    score: number
    message?: string
}

export interface SubmissionResult {
    message: string
    status: 'correct' | 'wrong'
    score: number
    funFact: string
    trivia: string
}

