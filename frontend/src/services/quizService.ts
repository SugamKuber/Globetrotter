import { QuizData, SubmissionResult } from '../types/quiz'
import { API_URL } from '../config/config'

export const startQuiz = async (accessToken: string | null): Promise<QuizData> => {
    const response = await fetch(`${API_URL}/quiz/start`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    })
    if (!response.ok) throw new Error('Failed to start quiz')
    return await response.json()
}

export const endQuiz = async (accessToken: string | null): Promise<void> => {
    const response = await fetch(`${API_URL}/quiz/end`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}` }
    })
    if (!response.ok) throw new Error('Failed to end quiz')
}

export const submitAnswer = async (
    questionId: string,
    answerId: string,
    accessToken: string | null
): Promise<SubmissionResult> => {
    const response = await fetch(`${API_URL}/quiz/submit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({ questionId, answerId })
    })
    if (!response.ok) throw new Error('Submission failed')
    return await response.json()
}

export const fetchNextQuestion = async (accessToken: string | null): Promise<QuizData> => {
    const response = await fetch(`${API_URL}/quiz/next`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    })
    if (!response.ok) throw new Error('Failed to fetch next question')
    return await response.json()
}
