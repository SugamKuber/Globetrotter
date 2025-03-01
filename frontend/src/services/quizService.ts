import { QuizData, SubmissionResult } from '../types/quiz'
import { API_URL, TOKEN } from '../config/config'

export const startQuiz = async (): Promise<QuizData> => {
    const response = await fetch(`${API_URL}/quiz/start`, {
        headers: { Authorization: `Bearer ${TOKEN}` }
    })
    if (!response.ok) throw new Error('Failed to start quiz')
    return await response.json()
}

export const endQuiz = async (): Promise<void> => {
    const response = await fetch(`${API_URL}/quiz/end`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${TOKEN}` }
    })
    if (!response.ok) throw new Error('Failed to end quiz')
}

export const submitAnswer = async (
    questionId: string,
    answerId: string
): Promise<SubmissionResult> => {
    const response = await fetch(`${API_URL}/quiz/submit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`
        },
        body: JSON.stringify({ questionId, answerId })
    })
    if (!response.ok) throw new Error('Submission failed')
    return await response.json()
}

export const fetchNextQuestion = async (): Promise<QuizData> => {
    const response = await fetch(`${API_URL}/quiz/next`, {
        headers: { Authorization: `Bearer ${TOKEN}` }
    })
    if (!response.ok) throw new Error('Failed to fetch next question')
    return await response.json()
}
