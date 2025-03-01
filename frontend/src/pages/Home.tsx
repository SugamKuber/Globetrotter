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
import { FiAlertCircle, FiCheckCircle, FiCopy, FiLink, FiLoader, FiUser, FiUsers } from 'react-icons/fi'

const Home: React.FC = () => {

    const [userData, setUserData] = useState<{ fullname: string, username: string, inviteLink: string, highestScore: number } | null>(null);
    const [profileError, setProfileError] = useState('');
    const { accessToken, logout } = useAuth();
    const [inviteLink, setInviteLink] = useState('');
    const [invitees, setInvitees] = useState<Invitee[]>([]);
    const [loading, setLoading] = useState({ link: true, invitees: true });
    const [inviteError, setInviteError] = useState('');
    const [copySuccess, setCopySuccess] = useState('');
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
                    setInviteLink(data.inviteLink)
                } else {
                    setProfileError('Failed to fetch profile');
                }
            } catch (err) {
                setProfileError('Error fetching profile');
            }
        };

        fetchProfile();
    }, [accessToken]);



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

    interface Invitee {
        id: string;
        name: string;
        highestScore: number;
    }

    useEffect(() => {
        const fetchInviteData = async () => {
            try {
                const inviteesResponse = await fetch('http://localhost:5000/api/user/invitees', {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });

                if (!inviteesResponse.ok) throw new Error('Failed to fetch invitees');
                const { inviteDetails } = await inviteesResponse.json();
                setInvitees(inviteDetails);
            } catch (err) {
                setInviteError(err instanceof Error ? err.message : 'Failed to load data');
            } finally {
                setLoading({ link: false, invitees: false });
            }
        };

        fetchInviteData();
    }, [accessToken]);

    const handleCopyLink = async () => {
        if (!inviteLink) return;

        try {
            await navigator.clipboard.writeText(inviteLink);
            setCopySuccess('Copied to clipboard!');
            setTimeout(() => setCopySuccess(''), 2000);
        } catch (err) {
            setCopySuccess('Failed to copy!');
        }
    };

    return (
        <div className="text-white min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center p-4">
            {inviteError && (
                <div className="mb-6 p-3 bg-red-500/20 text-red-300 rounded-lg flex items-center gap-2">
                    <FiAlertCircle className="flex-shrink-0" />
                    {inviteError}
                </div>
            )}

            <div className="space-y-8">
                <div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600">
                    <div className="flex items-center gap-3 mb-4 justify-between">
                        <div className='flex gap-3'>
                            <FiLink className="text-2xl" />
                            <h3 className="text-xl font-semibold">Your Invite Link</h3>

                        </div>
                        <button
                            onClick={handleCopyLink}
                            disabled={!inviteLink}
                            className="bg-blue-500/20 hover:bg-blue-500/30 px-4 py-2 rounded-lg border border-blue-500/50 flex items-center gap-2 transition-colors cursor-pointer"
                        >
                            <FiCopy className="text-blue-400" />
                            <span>Copy</span>
                        </button>
                    </div>

                    {loading.link ? (
                        <div className="flex items-center justify-center gap-2 text-gray-400">
                            <FiLoader className="animate-spin" />
                            Generating invite link...
                        </div>
                    ) : (
                        <div className="flex gap-4 items-center">
                            <input
                                type="text"
                                value={inviteLink}
                                readOnly
                                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 truncate"
                            />

                        </div>
                    )}

                    {copySuccess && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-green-400">
                            <FiCheckCircle />
                            {copySuccess}
                        </div>
                    )}
                </div>

                <div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600">
                    <div className="flex items-center gap-3 mb-4">
                        <FiUsers className="text-2xl text-blue-400" />
                        <h3 className="text-xl font-semibold">Your Invitees</h3>
                    </div>

                    {loading.invitees ? (
                        <div className="flex items-center justify-center gap-2 text-gray-400">
                            <FiLoader className="animate-spin" />
                            Loading invitees...
                        </div>
                    ) : invitees.length === 0 ? (
                        <p className="text-gray-400 text-center py-4">No invitees yet</p>
                    ) : (
                        <div className="space-y-3">
                            {invitees.map((invitee) => (
                                <div
                                    key={invitee.id}
                                    className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg border border-gray-700"
                                >
                                    <div className="flex items-center gap-3">
                                        <FiUser className="text-gray-400" />
                                        <span className="font-medium">{invitee.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-400">High Score:</span>
                                        <span className="font-mono text-purple-400">{invitee.highestScore}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="text-center max-w-2xl w-full space-y-6 mt-24">
                {userData && (
                    <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-8 animate-fade-in-up">
                        Welcome to Globetrotter {userData.fullname}

                    </h1>
                )}
                {profileError && (
                    <div className="bg-red-500/20 text-red-300 px-4 py-3 rounded-lg mb-4 border border-red-500/50">
                        {profileError}
                    </div>
                )}

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
                        <button
                            onClick={handleEndQuiz}
                            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            End Quiz
                        </button>
                    </div>
                )}

                {quizData && !showResult && (
                    <QuizQuestion
                        quizData={quizData}
                        selectedAnswer={selectedAnswer}
                        setSelectedAnswer={setSelectedAnswer}
                        score={score}
                        onSubmitAnswer={handleSubmitAnswer}
                    />
                )}

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

            <button
                onDoubleClick={logout}
                className="relative bg-red-600/80 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 hover:scale-105 hover:shadow-red-500/20 hover:shadow-lg cursor-pointer group"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
                Logout
                <span className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2">
                    Double-click to logout
                </span>
            </button>

        </div>
    )
}

export default Home
