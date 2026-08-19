import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRegister } from "@/hooks/api/use-auth";
import { useAuthStore } from "@/stores/auth-store";
import { UserPlus, Loader2, Mail, LogOut } from "lucide-react";
import { SignUpButton, useAuth } from "@clerk/tanstack-react-start";
import { Eye, EyeOff } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/spinner";

const GoogleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const register = useRegister();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const { isSignedIn, isLoaded: clerkLoaded, signOut } = useAuth();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const isReady = clerkLoaded && hasHydrated;
  const isAuthenticated = isSignedIn || !!token;

  useEffect(() => {
    if (!isReady) return;
    if (isAuthenticated) {
      navigate({ to: "/dashboard", replace: true });
    }
  }, [isReady, isAuthenticated, navigate]);

  if (!isReady) return <LoadingSpinner className="min-h-screen" size={40} />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return;
    }
    register.mutate({ email, password, fullName });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#d9d9d9]/20 px-4 dark:bg-[#353535]">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-[#353535] dark:text-white">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-[#353535]/70 dark:text-[#d9d9d9]/70">
            Start applying smarter with Crawler
          </p>
        </div>

        {/* Will fix Oauth Later */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Continue with Google</CardTitle>
            <CardDescription>
              Quick registration with your Google account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignUpButton mode="modal">
              <Button variant="outline" className="w-full gap-2">
                <GoogleIcon className="h-4 w-4" />
                Sign up with Google
              </Button>
            </SignUpButton>
          </CardContent>
        </Card> */}

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[#d9d9d9] dark:border-[#353535]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#d9d9d9]/20 px-2 text-[#353535]/50 dark:bg-[#353535] dark:text-[#d9d9d9]/50">
              Or register with email
            </span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Email & Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#353535]/50 hover:text-[#353535] dark:text-[#d9d9d9]/50 dark:hover:text-white transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#353535]/50 hover:text-[#353535] dark:text-[#d9d9d9]/50 dark:hover:text-white transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full gap-2"
                disabled={register.isPending}
              >
                {register.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <UserPlus className="h-4 w-4" />
                )}
                {register.isPending ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-[#353535]/70 dark:text-[#d9d9d9]/70">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-[#3c6e71] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
