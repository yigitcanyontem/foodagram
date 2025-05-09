import { AuthService } from "../services/auth-service.ts";
import { AuthenticationRequest } from "../models/auth/AuthenticationRequest.ts";
import React, { useState, useEffect } from "react";
import { AuthenticationResponse } from "../models/auth/AuthenticationResponse.ts";
import { toast } from "sonner";
import {Link, useNavigate} from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card.tsx";
import { Input } from "../components/ui/input.tsx";
import { Label } from "../components/ui/label.tsx";
import { Button } from "../components/ui/button.tsx";
import { Eye, EyeOff, LogIn } from "lucide-react";
import knifeLogo from '@/assets/knife-logo.png'; // LogoPath

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [response, setResponse] = useState<AuthenticationResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear()); // For Footer Year
    const navigate = useNavigate();

    useEffect(() => {
        setCurrentYear(new Date().getFullYear());
    }, []);


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        const request: AuthenticationRequest = { username, password };

        try {
            // Call the AuthService to authenticate
            const result = await AuthService.authenticate(request);
            toast.success("Login successful! Redirecting...");
            setResponse(result);
            navigate('/');
        } catch (err) {
            toast.error("Login Failed");
            setError('Invalid credentials. Please try again.');
            setResponse(null);
        } finally {
            setIsLoading(false);
        }
    };

    // LogoRecolored
    const redLogoFilterStyle = {
        filter: 'brightness(0) saturate(100%) invert(25%) sepia(70%) saturate(5000%) hue-rotate(340deg) brightness(100%) contrast(100%)'
    };


    return (
        <div className="flex flex-col items-center justify-between min-h-screen p-4 bg-slate-100 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800">
            <div className="flex-grow flex items-center justify-center w-full">
                <Card className="w-full max-w-md shadow-xl rounded-lg border dark:border-slate-700 bg-card">
                    <CardHeader className="text-center space-y-4 pt-8 pb-6">
                        <img
                            src={knifeLogo}
                            alt="Foodagram Knife Logo"
                            className="mx-auto h-20 w-20 md:h-24 md:w-24 object-contain"
                            style={redLogoFilterStyle}
                        />
                        <CardTitle className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                            Welcome Back!
                        </CardTitle>
                        <CardDescription className="text-slate-600 dark:text-slate-400 px-4">
                            Enter your administrator credentials to continue.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 px-6 pb-8 sm:px-8">
                        <form onSubmit={handleLogin} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">Email or Username</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@example.com"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="bg-slate-50 dark:bg-slate-800/60 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary/80 focus:border-primary dark:focus:border-primary placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="bg-slate-50 dark:bg-slate-800/60 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary/80 focus:border-primary dark:focus:border-primary pr-10 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                        disabled={isLoading}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        disabled={isLoading}
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </Button>
                                </div>
                            </div>

                            {error && <p className="text-sm text-red-600 dark:text-red-500 text-center font-medium pt-1">{error}</p>}

                            <Button type="submit" className="w-full font-semibold py-3 mt-3 text-base bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-150" disabled={isLoading}>
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Authenticating...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center">
                                        <LogIn className="mr-2 h-5 w-5" />
                                        <span>Login</span>
                                    </div>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            <footer className="w-full py-8 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                    <img
                        src={knifeLogo}
                        alt="Foodagram Logo"
                        className="h-5 w-5 object-contain" // Smaller Logo
                        style={redLogoFilterStyle}
                    />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Foodagram</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    &copy; {currentYear} Foodagram. All rights reserved.
                </p>
            </footer>
        </div>
    );
}

export default Login;