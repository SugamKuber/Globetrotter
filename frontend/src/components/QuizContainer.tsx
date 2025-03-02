import React from 'react';
import QuizQuestion from './QuizQuestion';
import QuizResult from './QuizResult';
import QuizEnd from './QuizEnd';
import { QuizData, SubmissionResult } from '../types/quiz';
import { FiClock } from 'react-icons/fi';

interface QuizContainerProps {
    userData: { fullname: string, highestScore: number } | null;
    profileError: string;
    quizData: QuizData | null;
    showResult: boolean;
    quizEnded: boolean;
    timeElapsed: number;
    isQuizActive: boolean
    isLoading: boolean;
    error: string;
    isNextLoading: boolean;
    selectedAnswer: string | null;
    score: number;
    submissionResult: SubmissionResult | null;
    timeTaken: number;
    operationFeedback: { message: string; type: 'success' | 'error' } | null;
    wrongQuestions: number;
    correctQuestions: number;
    handleStartQuiz: () => void;
    handleEndQuiz: () => void;
    handleSubmitAnswer: () => void;
    handleFetchNextQuestion: () => void;
    setSelectedAnswer: (answer: string | null) => void;
}

const QuizContainer: React.FC<QuizContainerProps> = ({
    userData,
    profileError,
    quizData,
    showResult,
    quizEnded,
    isLoading,
    error,
    isNextLoading,
    selectedAnswer,
    score,
    submissionResult,
    // timeTaken,
    wrongQuestions,
    correctQuestions,
    operationFeedback,
    timeElapsed,
    isQuizActive,
    handleStartQuiz,
    handleEndQuiz,
    handleSubmitAnswer,
    handleFetchNextQuestion,
    setSelectedAnswer,
}) => {
    return (
        <div className="text-center  w-full  max-w-2xl space-y-8 p-6 mt-8">
            {!isQuizActive && !quizEnded && userData && (
                <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-8 animate-fade-in-up">
                    Welcome to Globetrotter {userData.fullname}


                </h1>
            )}

            <div className="text-lg p-4 rounded-lg">
                <span className="font-semibold font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Your Highest Record:</span> {userData?.highestScore}
            </div>

            {isQuizActive && (
                <div className="flex items-center justify-center gap-2 text-xl text-blue-400 mb-8">
                    <FiClock className="text-2xl" />
                    <span className="font-mono">{timeElapsed}s</span>
                </div>
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
                    className={`bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg text-xl font-semibold transition-all duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:from-blue-600 hover:to-purple-700 hover:scale-105'
                        } shadow-lg mb-4`}
                >
                    {isLoading ? 'Starting...' : 'Start Quiz'}
                </button>
            )}
            {error && !isQuizActive && (
                <div className="mb-4 animate-fade-in">
                    <button
                        onClick={handleEndQuiz}
                        className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        End Past Quiz
                    </button>
                </div>
            )}

            {operationFeedback && (
                <div className={`${operationFeedback.type === 'success'
                    ? 'bg-green-500/20 text-green-300 border-green-500/50'
                    : 'bg-red-500/20 text-red-300 border-red-500/50'
                    } px-4 py-3 rounded-lg mb-4 border animate-fade-in`}>
                    {operationFeedback.message}
                </div>
            )}



            {/* {quizData && !showResult && (
                <QuizQuestion
                    quizData={quizData}
                    selectedAnswer={selectedAnswer}
                    setSelectedAnswer={setSelectedAnswer}
                    score={score}
                    onSubmitAnswer={handleSubmitAnswer}
                />
            )} */}
            {quizEnded ? (
                <QuizEnd
                    submissionResult={submissionResult!}
                    score={score}
                    timeTaken={timeElapsed}
                    wrongQuestions={wrongQuestions}
                    correctQuestions={correctQuestions}
                    onRestartQuiz={handleStartQuiz}
                />
            ) : showResult && submissionResult ? (
                <QuizResult
                    submissionResult={submissionResult}
                    onNextQuestion={handleFetchNextQuestion}
                    isNextLoading={isNextLoading}
                />
            ) : quizData ? (
                <QuizQuestion
                    quizData={quizData}
                    selectedAnswer={selectedAnswer}
                    setSelectedAnswer={setSelectedAnswer}
                    score={score}
                    onSubmitAnswer={handleSubmitAnswer}
                />
            ) : null}


            {isQuizActive && (
                <div className="animate-fade-in">
                    <div className="group relative">
                        <button
                            onDoubleClick={handleEndQuiz}
                            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            End Quiz
                        </button>
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            Double click to end the quiz
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuizContainer;
