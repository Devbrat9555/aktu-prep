import type { Faq } from '../types/Faq.ts';

export const faqs: Faq[] = [
    {
        question: 'What is AKTU Prep?',
        answer: [
            {
                type: 'text',
                content:
                    'AKTU Prep is a dedicated platform for students of Dr. A.P.J. Abdul Kalam Technical University. We provide easy access to 10 years of previous year papers, high-quality notes, and curated video lectures for B.Tech, MBA, and B.Pharma.',
            },
        ],
    },
    {
        question: 'Is it free to use?',
        answer: [
            {
                type: 'text',
                content:
                    'Yes, AKTU Prep is completely free. Our mission is to help students succeed without any financial barriers.',
            },
        ],
    },
    {
        question: 'Where can I find the papers?',
        answer: [
            {
                type: 'text',
                content:
                    'You can find them in the "Courses" section. Select your course (e.g., B.Tech), then your branch, year, and semester to see all available subjects and papers.',
            },
        ],
    },
    {
        question: 'How can I contribute study materials?',
        answer: [
            {
                type: 'text',
                content:
                    'If you have notes or previous year papers that are missing, you can contact the admin or use the support section to share them. Your contribution helps thousands of other students!',
            },
        ],
    },
    {
        question: 'Is there a mobile app?',
        answer: [
            {
                type: 'text',
                content:
                    'AKTU Prep is a Progressive Web App (PWA). You can install it on your Android or iOS device by selecting "Add to Home Screen" in your browser menu.',
            },
        ],
    },
    {
        question: 'What about my privacy?',
        answer: [
            {
                type: 'text',
                content:
                    'We take your privacy seriously. We only collect basic information like your name and college to personalize your experience. Your data is never shared with third parties.',
            },
        ],
    },
];
