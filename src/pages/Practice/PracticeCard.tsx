// 1. Core and external library imports
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';

// 2. Custom hook imports (application logic)
import { useQuestionTimer } from '../../hooks/useQuestionTimer.js';
import { useQuestionState } from '../../hooks/useQuestionState.js';
import useQuestionNav from '../../hooks/useQuestionNav.js';
import useKeyboardShortcuts from '../../hooks/useKeyboardShortcuts.js';
import useAnswerFlow from '../../hooks/useAnswerFlow.js';

// 3. Utility and helper function imports
import { handleBookmark } from '../../utils/questionUtils.js';

// 4. Component imports (UI pieces)
import ModernLoader from '../../components/ui/ModernLoader.js';
import useAuth from '../../hooks/useAuth.js';
import useSettings from '../../hooks/useSettings.js';
import useQuestions from '../../hooks/useQuestions.ts';
import { usePeerBenchmark } from '@/hooks/usePeerBenchmark.ts';
import { toast } from 'sonner';
import ReportModal from '@/components/ReportModal.tsx';
import QuestionCard from '@/components/QuestionCard/QuestionCard.tsx';
import { supabase } from '@/utils/supabaseClient.ts';
import { useGoals } from '@/hooks/useGoals.ts';
import type { Question } from '@/types/storage.ts';

const PracticeCard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { subject, qid } = useParams();
    const { subjects } = useGoals();
    const qs = searchParams.toString();

    const subjectId = subjects.filter((s) => s.slug === subject)[0]?.id;
    const { questions: fetchedQuestions, isLoading: isQuestionsLoading } = useQuestions(
        subjectId,
        false,
    );

    const passed = location.state?.questions;
    let questions = Array.isArray(passed) && passed.length ? passed : fetchedQuestions;

    const [currentIndex, setCurrentIndex] = useState<string | number>(qid || 0);

    const currentQuestion = useMemo(() => {
        if (!questions || questions.length === 0) return null;
        return (
            questions.find((q: Question) => String(q.id) === String(currentIndex)) || questions[0]
        );
    }, [questions, currentIndex]);

    const safeQuestion =
        currentQuestion || ({ id: '0', options: [], correct_answer: [], subject: '' } as any);

    const { user, isLogin } = useAuth();
    const { settings } = useSettings();

    const {
        userAnswerIndex,
        selectedOptionIndices,
        numericalAnswer,
        showAnswer,
        setShowAnswer,
        result,
        setResult,
        resetState: resetQuestionState,
        handleOptionSelect,
        handleNumericalInputChange,
    } = useQuestionState(safeQuestion);

    const {
        time: timeTaken,
        minutes,
        seconds,
        isActive: isTimerActive,
        toggle: toggleTimer,
        stop: stop,
    } = useQuestionTimer(settings?.autoTimer, safeQuestion, showAnswer);

    const { handleShowAnswer, handleSubmit } = useAnswerFlow({
        currentQuestion: safeQuestion,
        selectedOptionIndices,
        numericalAnswer,
        timeTaken,
        user,
        isLogin,
        setShowAnswer,
        setResult,
        stop,
        showAnswer,
    });

    const { isFirst, isLast, handleNext, handlePrevious } = useQuestionNav({
        filteredQuestions: questions,
        subject,
        qs,
        currentIndex,
        setCurrentIndex,
        resetQuestionState,
        questionMode: 'practice',
    });

    const {
        benchmarkDetails,
        loading: statsLoading,
        message: statsMessage,
    } = usePeerBenchmark(safeQuestion.id);

    const onExplanationClick = () => {
        if (safeQuestion.source_url) {
            window.open(safeQuestion.source_url, '_blank');
        }
    };

    useKeyboardShortcuts(
        {
            onPrev: handlePrevious,
            onNext: handleNext,
            onShowAnswer: handleShowAnswer,
            onExplain: () => onExplanationClick(),
        },
        [safeQuestion],
    );

    const correctSoundRef = useRef<HTMLAudioElement | null>(null);
    const wrongSoundRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (settings?.sound) {
            correctSoundRef.current = new Audio('/correct.wav');
            wrongSoundRef.current = new Audio('/wrong.wav');
        }
    }, [settings?.sound]);

    useEffect(() => {
        if (showAnswer && settings?.sound && result !== 'unattempted') {
            if (result === 'correct') correctSoundRef.current?.play().catch((e) => console.warn(e));
            else if (result === 'incorrect')
                wrongSoundRef.current?.play().catch((e) => console.warn(e));
        }
    }, [showAnswer, result, settings?.sound]);

    const [showReportModal, setShowReportModal] = useState(false);
    const [reportSubmitting, setReportSubmitting] = useState(false);

    const handleReportSubmit = async (reportType: string, reportText: string) => {
        setReportSubmitting(true);
        const report = {
            user_id: user?.id,
            question_id: currentQuestion.id,
            report_type: reportType,
            report_text: reportText,
        };

        try {
            const { error } = await supabase.from('question_reports').insert([report]);
            if (error) {
                if (error.code === '23505') {
                    toast.error("Already reported by you, don't spam please");
                } else {
                    toast.error('There was an error in submitting the report.');
                }
                console.error('Error reporting question:', error);
                return;
            }
            toast.success('Thank you for making the platform great. ❤️');
            setShowReportModal(false);
        } catch (err) {
            console.error(err);
            toast.error('Unexpected error occurred.');
        } finally {
            setReportSubmitting(false);
        }
    };

    const onShareClick = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'AKTU Prep Question',
                    text: 'Try out this question:',
                    url: window.location.href,
                });
            } catch (err) {
                console.error('Share cancelled or failed.', err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(window.location.href);
                toast.message('Question link copied successfully.');
            } catch (err) {
                console.error(err);
            }
        }
    };

    const onToggleBookmark = () => {
        handleBookmark(isLogin, safeQuestion.id, safeQuestion.subject);
    };

    const handleBack = () => {
        navigate(`/practice/${subject}?${qs}`);
    };

    if (isQuestionsLoading || !currentQuestion) {
        return (
            <div className="flex items-center justify-center h-screen">
                <ModernLoader />
            </div>
        );
    }

    return (
        <>
            <QuestionCard
                question={currentQuestion}
                totalQuestions={questions.length}
                questionNumber={
                    questions.findIndex(
                        (q: Question) => String(q.id) === String(currentQuestion.id),
                    ) + 1
                }
                userAnswerIndex={userAnswerIndex}
                selectedOptionIndices={selectedOptionIndices}
                numericalAnswer={numericalAnswer}
                showAnswer={showAnswer}
                result={result}
                timer={{
                    minutes,
                    seconds,
                    isActive: isTimerActive,
                    onToggle: toggleTimer,
                }}
                peerStats={{
                    loading: statsLoading,
                    message: statsMessage,
                    data: benchmarkDetails,
                }}
                onOptionSelect={handleOptionSelect}
                onNumericalChange={handleNumericalInputChange}
                onShowAnswer={handleShowAnswer}
                handleSubmit={handleSubmit}
                onNext={handleNext}
                onPrev={handlePrevious}
                onReport={() => setShowReportModal(true)}
                onShare={onShareClick}
                onBookmark={onToggleBookmark}
                onExplanationClick={onExplanationClick}
                onBack={handleBack}
                isFirst={isFirst}
                isLast={isLast}
            />

            {showReportModal && (
                <ReportModal
                    show={showReportModal}
                    onClose={() => setShowReportModal(false)}
                    onSubmit={handleReportSubmit}
                    reportSubmitting={reportSubmitting}
                />
            )}
        </>
    );
};

export default PracticeCard;
