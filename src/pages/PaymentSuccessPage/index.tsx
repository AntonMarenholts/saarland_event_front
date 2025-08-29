import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function PaymentSuccessPage() {
    const { t } = useTranslation();

    return (
        <div className="text-center text-white py-20">
            <div className="bg-gray-800 inline-block p-10 rounded-lg shadow-lg">
                <svg className="w-24 h-24 text-green-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <h1 className="text-4xl font-bold mb-2">{t('payment_success_title')}</h1>
                <p className="text-gray-400 mb-8">{t('payment_success_message')}</p>
                <Link
                    to="/profile"
                    className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg transition-transform hover:scale-105"
                >
                    {t('back_to_profile_button')}
                </Link>
            </div>
        </div>
    );
}
