import React, { useEffect } from 'react'
import { SubmissionResult } from '../types/quiz'

interface QuizResultProps {
    submissionResult: SubmissionResult
    onNextQuestion: () => void
    isNextLoading: boolean
}

const QuizResult: React.FC<QuizResultProps> = ({
    submissionResult,
    onNextQuestion,
    isNextLoading
}) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter' && !isNextLoading) {
                onNextQuestion()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [isNextLoading, onNextQuestion])

    return (
        <div className="bg-gray-800 p-8 rounded-xl shadow-xl animate-fade-in">
            <div
                className={`text-center mb-6 p-4 rounded-lg ${submissionResult.status === 'correct' ? 'bg-green-900/30' : 'bg-red-900/30'
                    }`}
            >
                <h2
                    className={`text-3xl font-bold mb-2 ${submissionResult.status === 'correct' ? 'text-green-400' : 'text-red-400'
                        }`}
                >
                    {submissionResult.status === 'correct' ? 'Correct!' : 'Wrong!'}
                </h2>
                <p className="text-xl text-white">Current Score: {submissionResult.score}</p>
            </div>

            <div className="space-y-6 mb-8">
                <div className="bg-gray-700/30 p-4 rounded-lg">
                    <h3 className="text-sm font-semibold text-purple-400 mb-2">Did you know?</h3>
                    <p className="text-white">{submissionResult.funFact}</p>
                </div>

                <div className="bg-gray-700/30 p-4 rounded-lg">
                    <h3 className="text-sm font-semibold text-blue-400 mb-2">Interesting Trivia</h3>
                    <p className="text-white">{submissionResult.trivia}</p>
                </div>
            </div>

            <div className="flex justify-center gap-4">
                <button
                    onClick={onNextQuestion}
                    disabled={isNextLoading}
                    className={`bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold ${isNextLoading ? 'opacity-50 cursor-not-allowed' : 'hover:from-blue-600 hover:to-purple-700'
                        } transition-all duration-300`}
                >
                    {isNextLoading ? 'Loading...' : 'Next Question'}
                </button>
            </div>
        </div>
    )
}

export default QuizResult
