import React, { useState, useEffect } from 'react'
import { QuizData, SubmissionResult } from '../types/quiz'
import {
    startQuiz,
    endQuiz,
    submitAnswer,
    fetchNextQuestion
} from '../services/quizService'
import QuizQuestion from '../components/QuizQuestion'
import QuizResult from '../components/QuizResult'
import QuizEnd from '../components/QuizEnd'
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {

    const [userData, setUserData] = useState<{ fullname: string } | null>(null);
    const [profileError, setProfileError] = useState('');
    const { accessToken, logout } = useAuth();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/user/me', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });


                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                } else {
                    setProfileError('Failed to fetch profile');
                }
            } catch (err) {
                setProfileError('Error fetching profile');
            }
        };

        fetchProfile();
    }, [accessToken]);

    const [quizData, setQuizData] = useState<QuizData | null>(null)
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
    const [score, setScore] = useState<number>(0)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('')
    const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null)
    const [showResult, setShowResult] = useState<boolean>(false)
    const [isNextLoading, setIsNextLoading] = useState<boolean>(false)
    const [quizEnded, setQuizEnded] = useState<boolean>(false)
    const [timeTaken, setTimeTaken] = useState<number>(0)
    const [wrongQuestions, setWrongQuestions] = useState<number>(0)
    const [correctQuestions, setCorrectQuestions] = useState<number>(0)

    const handleStartQuiz = async () => {
        try {
            setIsLoading(true)
            setError('')
            const data = await startQuiz()
            setQuizData(data)
            setScore(data.score)
            setSubmissionResult(null)
            setShowResult(false)
            setQuizEnded(false)
            setTimeTaken(0)
            setWrongQuestions(0)
            setCorrectQuestions(0)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleEndQuiz = async () => {
        try {
            await endQuiz()
            resetQuiz()
        } catch (err: any) {
            setError('Failed to end quiz')
        }
    }

    const handleSubmitAnswer = async () => {
        if (!selectedAnswer || !quizData) return

        try {
            const result = await submitAnswer(quizData.questionId, selectedAnswer)
            setSubmissionResult(result)
            setShowResult(true)
            setScore(result.score)
            if (result.status === 'correct') {
                setCorrectQuestions(prev => prev + 1)
            } else {
                setWrongQuestions(prev => prev + 1)
            }
        } catch (err: any) {
            setError(err.message)
        }
    }

    const handleFetchNextQuestion = async () => {
        try {
            setIsNextLoading(true)
            const data = await fetchNextQuestion()

            if (data.message && data.message === 'Quiz has ended') {
                setSubmissionResult({
                    message: '',
                    status: 'wrong',
                    funFact: '',
                    trivia: '',
                    score: data.score
                })
                setShowResult(true)
                setQuizEnded(true)
                setQuizData(null)
            } else {
                setQuizData(data)
                setSelectedAnswer(null)
                setSubmissionResult(null)
                setShowResult(false)
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsNextLoading(false)
        }
    }

    const resetQuiz = () => {
        setQuizData(null)
        setSelectedAnswer(null)
        setSubmissionResult(null)
        setShowResult(false)
        setError('')
        setQuizEnded(false)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center p-4">
            <nav className="w-full bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 fixed top-0">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex justify-between items-center">
                        <div className="flex space-x-6">
                            <Link
                                to="/invite"
                                className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                                </svg>
                                Invite Friends
                            </Link>
                        </div>
                        <button
                            onClick={logout}
                            className="bg-red-600/80 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 hover:scale-105 hover:shadow-red-500/20 hover:shadow-lg cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className="text-center max-w-2xl w-full space-y-6 mt-24">
                {userData && (
                    <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-8 animate-fade-in-up">
                        Welcome to Globetrotter {userData.fullname}

                    </h1>
                )}
                {error && (
                    <div className="bg-red-500/20 text-red-300 px-4 py-3 rounded-lg mb-4 border border-red-500/50">
                        {error}
                    </div>
                )}

                {/* Show start button if quiz is not active */}
                {!quizData && !showResult && !quizEnded && (
                    <button
                        onClick={handleStartQuiz}
                        disabled={isLoading}
                        className={`bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg text-xl font-semibold transition-all duration-300 ${isLoading
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:from-blue-600 hover:to-purple-700 hover:scale-105'
                            } shadow-lg mb-4`}
                    >
                        {isLoading ? 'Starting...' : 'Start Quiz'}
                    </button>
                )}

                {error && (
                    <div className="mb-4 animate-fade-in">
                        {/* <p className="text-red-400 mb-2">{error}</p> */}
                        <button
                            onClick={handleEndQuiz}
                            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            End Quiz
                        </button>
                    </div>
                )}

                {/* Render the quiz question */}
                {quizData && !showResult && (
                    <QuizQuestion
                        quizData={quizData}
                        selectedAnswer={selectedAnswer}
                        setSelectedAnswer={setSelectedAnswer}
                        score={score}
                        onSubmitAnswer={handleSubmitAnswer}
                    />
                )}

                {/* Render the submission result view */}
                {showResult && submissionResult && (
                    quizEnded ? (
                        <QuizEnd
                            submissionResult={submissionResult}
                            score={score}
                            timeTaken={timeTaken}
                            wrongQuestions={wrongQuestions}
                            correctQuestions={correctQuestions}
                            onRestartQuiz={handleStartQuiz}
                        />
                    ) : (
                        <QuizResult
                            submissionResult={submissionResult}
                            score={score}
                            onEndQuiz={handleEndQuiz}
                            onNextQuestion={handleFetchNextQuestion}
                            isNextLoading={isNextLoading}
                        />
                    )
                )}
            </div>
        </div>
    )
}

export default Home
