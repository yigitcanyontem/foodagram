import {AuthService} from "../services/auth-service.ts";
import {AuthenticationRequest} from "../models/auth/AuthenticationRequest.ts";
import React, {useState} from "react";
import {AuthenticationResponse} from "../models/auth/AuthenticationResponse.ts";
import { toast } from "sonner"
import {Link, useNavigate} from "react-router-dom";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../components/ui/card.tsx";
import {Input} from "../components/ui/input.tsx";
import {Label} from "../components/ui/label.tsx";
import {Button} from "../components/ui/button.tsx";

const Login = () => {


    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [response, setResponse] = useState<AuthenticationResponse | null>(null);
    const navigate = useNavigate();

    // Handle form submission
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const request: AuthenticationRequest = {username, password};

        try {
            // Call the AuthService to authenticate
            const result = await AuthService.authenticate(request);
            toast("Login successful")
            setResponse(result);
            setError(null);
            navigate('/');
        } catch (err) {
            toast("Error while logging in");
            setError('Login failed. Please check your credentials.');
            setResponse(null);
        }
    };

    return (
        <div className={'main_container login_main_container'}>
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Login to your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="mt-1"
                            />
                        </div>
                        {error && <p className="text-red-500">{error}</p>}
                        <Button type="submit" className="w-full mt-4">Login</Button>
                    </form>
                    <div className={'text-center mt-3'}>
                        <Label>
                            Don't have an account?
                            <Link to={'/register'}>
                                <Label className={'cursor-pointer text-blue-500'}>
                                    &nbsp;&nbsp;Create account
                                </Label>
                            </Link>
                        </Label>
                    </div>
                </CardContent>
            </Card>
        </div>

    );
}

export default Login;
