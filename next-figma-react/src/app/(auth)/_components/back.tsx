import useI18n from "@/hooks/useI18n";
import { useShowButton } from "./showBackButtonContext";
import { useRouter } from "next/navigation";

const Back = () => {
    const { t } = useI18n();
    const router = useRouter();
    const { showButton } = useShowButton();
    if (!showButton) {
        return null; // Dynamically hide based on context
    }

    return <div className="layout-navbar-back">
        <button
            className="navbar-back-button cursor-pointer flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors duration-200"
            onClick={() => router.back()}
        >
            <img src="/arrow-left.svg" alt="Back" className="back-icon w-3 h-3 rotate-180" />
            <span className="back-text text-sm font-medium">{t('auth.layout.back')}</span>
        </button>
    </div>
};

export default Back;