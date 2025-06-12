"use client"
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#1B1519] flex flex-col">
      {/* Back to Chat Button */}
      <div className="absolute top-6 left-6">
        <Button
          type="button"
          variant="ghost"
          className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200 px-2 py-1"
          aria-label="Back to Chat"
          onClick={() => router.back()}
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back to Chat</span>
        </Button>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <section className="w-full max-w-md text-center" aria-label="Login">
          {/* Welcome Header */}
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">
              Welcome to{" "}
              <span className="bg-[#E2BAD1] bg-clip-text text-transparent">
                T3.chat
              </span>
            </h1>
            <p className="text-gray-300 text-lg">
              Sign in below (we'll increase your message limits if you do 😊)
            </p>
          </header>

          {/* Google Sign In Button */}
          <div className="mb-8">
            <Button
              type="button"
              onClick={() => signIn("google")}
              className="w-full bg-[#3F1426] hover:bg-[#3F1426]/80 p-8 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
              aria-label="Continue with Google"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
          </div>

          {/* Terms and Privacy */}
          <footer className="text-sm text-gray-400">
            By continuing, you agree to our{" "}
            <a
              href="#"
              className="text-gray-300 hover:text-white underline transition-colors duration-200"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-gray-300 hover:text-white underline transition-colors duration-200"
            >
              Privacy Policy
            </a>
          </footer>
        </section>
      </main>
    </div>
  );
}

export default LoginPage;