import React, { useState, useEffect } from 'react';
import { QuizData, SubmissionResult } from '../types/quiz';
import {
    startQuiz,
    endQuiz,
    submitAnswer,
    fetchNextQuestion,
} from '../services/quizService';
import InviteLink from '../components/InviteLink';
import Invitees from '../components/Invitees';
import QuizContainer from '../components/QuizContainer';
import LogoutButton from '../components/Logout';
import { useAuth } from '../contexts/AuthContext';
import { FiAlertCircle } from 'react-icons/fi';
import { API_URL } from '../config/config'

interface Invitee {
    id: string;
    name: string;
    highestScore: number;
}

const Home: React.FC = () => {
    const [userData, setUserData] = useState<{ fullname: string; username: string; inviteLink: string; highestScore: number } | null>(null);
    const [profileError, setProfileError] = useState('');
    const { accessToken, logout } = useAuth();
    const [inviteLink, setInviteLink] = useState('');
    const [invitees, setInvitees] = useState<Invitee[]>([]);
    const [loading, setLoading] = useState({ link: true, invitees: true });
    const [inviteError, setInviteError] = useState('');
    const [copySuccess, setCopySuccess] = useState('');
    const [quizData, setQuizData] = useState<QuizData | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [score, setScore] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
    const [showResult, setShowResult] = useState<boolean>(false);
    const [isNextLoading, setIsNextLoading] = useState<boolean>(false);
    const [quizEnded, setQuizEnded] = useState<boolean>(false);
    const [operationFeedback, setOperationFeedback] = useState<{ message: string; type: 'success' | 'error'; } | null>(null);
    const [timeTaken, setTimeTaken] = useState<number>(0);
    const [wrongQuestions, setWrongQuestions] = useState<number>(0);
    const [correctQuestions, setCorrectQuestions] = useState<number>(0);
    const [isQuizActive, setIsQuizActive] = useState(false);
    const [timeElapsed, setTimeElapsed] = useState(0);


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`${API_URL}/user/me`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                    setInviteLink(data.inviteLink);
                } else {
                    setProfileError('Failed to fetch profile');
                }
            } catch (err) {
                setProfileError('Error fetching profile');
            }
        };

        fetchProfile();
    }, [accessToken]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | undefined;
        if (quizData && !quizEnded) {
            interval = setInterval(() => {
                setTimeElapsed((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [quizData, quizEnded]);


    const handleStartQuiz = async () => {
        try {
            setTimeElapsed(0);
            setIsLoading(true);
            setError('');
            const data = await startQuiz(accessToken);
            setQuizData(data);
            setIsQuizActive(true);
            setScore(data.score);
            setSubmissionResult(null);
            setShowResult(false);
            setQuizEnded(false);
            setTimeTaken(0);
            setWrongQuestions(0);
            setCorrectQuestions(0);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEndQuiz = async () => {
        try {
            await endQuiz(accessToken);
            resetQuiz();
            setIsQuizActive(false);
            setOperationFeedback({
                message: 'Quiz successfully ended!',
                type: 'success'
            });
            setTimeout(() => setOperationFeedback(null), 3000);
        } catch (err: any) {
            setError('Failed to end quiz');
            setOperationFeedback({
                message: err.message || 'Failed to end quiz',
                type: 'error'
            });
        }
    };

    const handleSubmitAnswer = async () => {
        if (!selectedAnswer || !quizData) return;
        try {
            const result = await submitAnswer(quizData.questionId, selectedAnswer, accessToken);
            setSubmissionResult(result);
            setShowResult(true);
            setScore(result.score);
            if (result.status === 'correct') {
                setCorrectQuestions((prev) => prev + 1);
            } else {
                setWrongQuestions((prev) => prev + 1);
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleFetchNextQuestion = async () => {
        try {
            setIsNextLoading(true);
            const data = await fetchNextQuestion(accessToken);
            if (data.message && data.message === 'Quiz has ended') {
                setSubmissionResult({
                    message: data.message,
                    status: 'correct',
                    funFact: '',
                    trivia: '',
                    score: data.score,
                });
                setShowResult(true);
                setQuizEnded(true);
                setQuizData(null);
                setIsQuizActive(false);
            } else {
                setQuizData(data);
                setSelectedAnswer(null);
                setSubmissionResult(null);
                setShowResult(false);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsNextLoading(false);
        }
    };

    const resetQuiz = () => {
        setTimeElapsed(0);
        setQuizData(null);
        setSelectedAnswer(null);
        setSubmissionResult(null);
        setShowResult(false);
        setQuizEnded(false);
        setScore(0);
        setWrongQuestions(0);
        setCorrectQuestions(0);
    };

    useEffect(() => {
        const fetchInviteData = async () => {
            try {
                const inviteesResponse = await fetch(`${API_URL}/user/invitees`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
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

            <QuizContainer
                userData={userData}
                profileError={profileError}
                quizData={quizData}
                operationFeedback={operationFeedback}
                showResult={showResult}
                quizEnded={quizEnded}
                isLoading={isLoading}
                error={error}
                isNextLoading={isNextLoading}
                selectedAnswer={selectedAnswer}
                score={score}
                submissionResult={submissionResult}
                timeTaken={timeTaken}
                wrongQuestions={wrongQuestions}
                correctQuestions={correctQuestions}
                handleStartQuiz={handleStartQuiz}
                handleEndQuiz={handleEndQuiz}
                timeElapsed={timeElapsed}
                isQuizActive={isQuizActive}
                handleSubmitAnswer={handleSubmitAnswer}
                handleFetchNextQuestion={handleFetchNextQuestion}
                setSelectedAnswer={setSelectedAnswer}
            />
            {!isQuizActive && (
                <div className="space-y-8 w-full max-w-2xl">
                    {inviteError && (
                        <div className="mb-6 p-3 bg-red-500/20 text-red-300 rounded-lg flex items-center gap-2">
                            <FiAlertCircle className="flex-shrink-0" />
                            {inviteError}
                        </div>
                    )}
                    <InviteLink
                        inviteLink={inviteLink}
                        loading={loading.link}
                        copySuccess={copySuccess}
                        onCopy={handleCopyLink}
                    />
                    <Invitees invitees={invitees} loading={loading.invitees} error={inviteError} />
                </div>
            )}
            {!isQuizActive && (
                <div className="mt-8">
                    <LogoutButton onLogout={logout} />
                </div>
            )
            }
        </div>
    );
};

export default Home;
