import React, { useEffect } from 'react'
import { QuizData } from '../types/quiz'

interface QuizQuestionProps {
    quizData: QuizData
    selectedAnswer: string | null
    setSelectedAnswer: (answer: string) => void
    score: number
    onSubmitAnswer: () => void
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
    quizData,
    selectedAnswer,
    setSelectedAnswer,
    score,
    onSubmitAnswer
}) => {
    {
        useEffect(() => {
            const handleKeyDown = (event: KeyboardEvent) => {
                const index = parseInt(event.key) - 1
                if (index >= 0 && index < quizData.options.length) {
                    setSelectedAnswer(quizData.options[index].id)
                }
            }

            window.addEventListener('keydown', handleKeyDown)
            return () => {
                window.removeEventListener('keydown', handleKeyDown)
            }
        }, [quizData.options, setSelectedAnswer])
    }

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter' && selectedAnswer) {
                onSubmitAnswer()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [selectedAnswer, onSubmitAnswer])

    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl animate-slide-up">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-4">Clues</h2>
                {quizData.clues.map((clue, index) => (
                    <p key={index} className="text-gray-300 mb-2">
                        {clue}
                    </p>
                ))}
            </div>

            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-4">Options</h2>
                <div className="space-y-3">
                    {quizData.options.map((option, index) => (
                        <label
                            key={option.id}
                            className={`block p-4 rounded-lg cursor-pointer transition-all duration-200 ${selectedAnswer === option.id
                                ? 'bg-blue-600 scale-[1.02]'
                                : 'bg-gray-700 hover:bg-gray-600'
                                }`}
                        >
                            <input
                                type="radio"
                                name="quiz-option"
                                value={option.id}
                                checked={selectedAnswer === option.id}
                                onChange={() => setSelectedAnswer(option.id)}
                                className="hidden"
                            />
                            <div className="font-medium text-white">{option.city}</div>
                            <div className="text-sm text-gray-300">{option.country}</div>
                        </label>
                    ))}
                </div>
            </div>


            <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-white">Score: {score}</span>
                <button
                    onClick={onSubmitAnswer}
                    disabled={!selectedAnswer}
                    className={`px-6 py-3 rounded-lg font-semibold ${selectedAnswer ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 cursor-not-allowed'
                        } text-white transition-colors`}
                >
                    Submit Answer
                </button>
            </div>
        </div>
    )
}

export default QuizQuestion
