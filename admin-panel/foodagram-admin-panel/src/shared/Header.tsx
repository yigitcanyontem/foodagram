import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthService } from "../services/auth-service.ts";
import { toast } from "sonner";
import { Button } from "../components/ui/button.tsx";
import { Input } from "../components/ui/input.tsx";
import { Label } from "../components/ui/label.tsx";
import { Menu, X, Search } from "lucide-react";

const Header = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setIsAuthenticated(AuthService.isAuthenticated());
    }, [location]); // Re-check authentication when location changes

    useEffect(() => {
        //Prevent page scroll when mobile menu is open
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const Logout = () => {
        AuthService.logout();
        toast.success("Logged out successfully");
        setIsAuthenticated(false);
        setIsMobileMenuOpen(false);
        navigate("/");
    };

    const goTo = (path: string) => {
        setIsMobileMenuOpen(false);
        navigate(`/${path}`);
    };

    const navLinks = [
        { label: 'Users', path: 'users' },
        { label: 'Posts', path: 'posts' },
        { label: 'Reports', path: 'reports' },
        { label: 'Profile', path: 'profile' },
    ];

    return (
        <header className="w-full bg-background/80 dark:bg-background/80 backdrop-blur-lg sticky top-0 z-50 border-b fg-page justify-between flex">
            <div className=" grow flex items-center justify-between py-3 ">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                    <Label className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-pink-900 cursor-pointer">
                        Foodagram
                    </Label>
                </Link>


                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-2">
                    {isAuthenticated ? (
                        <>
                            {navLinks.map(link => (
                                <Button
                                    key={link.label}
                                    variant="ghost"
                                    onClick={() => goTo(link.path)}
                                >
                                    {link.label}
                                </Button>
                            ))}
                            <Button
                                variant="outline"
                                onClick={Logout}
                                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white dark:border-red-600 dark:text-red-600 dark:hover:bg-red-600 dark:hover:text-white"
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="ghost" onClick={() => goTo('login')}>
                                Login
                            </Button>
                        </>
                    )}
                </nav>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 w-full bg-background/95 backdrop-blur-md shadow-xl border-t pb-4">
                    <nav className="flex flex-col space-y-2 px-4 pt-4">
                        <div className="sm:hidden mb-4">
                            <div className="relative w-full">
                                <Input
                                    type="search"
                                    placeholder="Search..."
                                    className="w-full pl-4 pr-10 py-2 rounded-full bg-muted/50 border-border focus:ring-primary focus:border-primary transition-shadow"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground">
                                    <Search className="h-5 w-5" />
                                </div>
                            </div>
                        </div>
                        {isAuthenticated ? (
                            <>
                                {navLinks.map(link => (
                                    <Button
                                        key={link.label}
                                        variant="ghost"
                                        className="w-full justify-start"
                                        onClick={() => goTo(link.path)}
                                    >
                                        {link.label}
                                    </Button>
                                ))}
                                <Button
                                    variant="outline"
                                    className="w-full justify-start border-red-500 text-red-500 hover:bg-red-500 hover:text-white dark:border-red-600 dark:text-red-600 dark:hover:bg-red-600 dark:hover:text-white"
                                    onClick={Logout}
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="ghost" className="w-full justify-start" onClick={() => goTo('login')}>
                                    Login
                                </Button>
                                <Button variant="default" className="w-full justify-start" onClick={() => goTo('register')}>
                                    Register
                                </Button>
                            </>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
