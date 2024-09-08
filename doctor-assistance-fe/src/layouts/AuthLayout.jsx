import authImage from "@/assets/images/webp/authImage.webp"
import { Navigate } from "react-router-dom"
import { useAuthContext } from '@/contexts/AuthContext';

export default function AuthLayout({ children }) {

    const { user } = useAuthContext();

    if (user) {
      return <Navigate to={`/${user.role}`} replace />;
    }

    return (
        <div className="w-full lg:grid lg:min-h-[100vh] lg:grid-cols-2 xl:min-h-[100vh] p-3 lg:p-0">
            <div className="hidden bg-muted lg:block">
                <img
                    src={authImage}
                    alt="AuthImage"
                    className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    {children}
                </div>
            </div>
        </div>
    )
}
