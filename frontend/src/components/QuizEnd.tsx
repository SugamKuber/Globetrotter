import React from 'react'
import { SubmissionResult } from '../types/quiz'

interface QuizEndProps {
    submissionResult: SubmissionResult
    score: number
    timeTaken: number
    wrongQuestions: number
    correctQuestions: number
    onRestartQuiz: () => void
}

const QuizEnd: React.FC<QuizEndProps> = ({ submissionResult, score, timeTaken, wrongQuestions, correctQuestions, onRestartQuiz }) => {
    return (
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-700 w-full max-w-2xl animate-fade-in">
            <div className="text-center mb-8">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                    Quiz Completed!
                </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-700/30 p-4 rounded-xl">
                    <p className={`text-2xl font-bold ${score > 0 ? 'text-green-400' :
                        score === 0 ? 'text-yellow-400' :
                            'text-red-400'
                        }`}>
                        {score}
                    </p>
                    <p className="text-sm text-gray-400">Total Score</p>
                </div>
                <div className="bg-gray-700/30 p-4 rounded-xl">
                    <p className="text-2xl font-bold text-blue-400">{timeTaken}s</p>
                    <p className="text-sm text-gray-400">Time Taken</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center justify-center gap-3 bg-green-500/10 p-4 rounded-xl border border-green-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-xl font-semibold text-green-400">{correctQuestions}</p>
                    <p className="text-sm text-green-200">Correct Answers</p>
                </div>
                <div className="flex items-center justify-center gap-3 bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>

                    <p className="text-xl font-semibold text-red-400">{wrongQuestions}</p>
                    <p className="text-sm text-red-200">Incorrect Answers</p>

                </div>
            </div>

            {submissionResult.message && (
                <div className="bg-purple-500/10 p-4 rounded-xl border border-purple-500/20 mb-6">
                    <p className="text-lg text-purple-300 italic">"{submissionResult.message}"</p>
                </div>
            )}

            <button
                onClick={onRestartQuiz}
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:from-green-600 hover:to-blue-700 hover:scale-[1.02] hover:shadow-lg"
            >
                Restart Quiz
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
    )
}
export default QuizEnd
