"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        router.push("/");
    };

    return (
        <nav className="w-full bg-transparent z-50 relative">
            <div className="flex items-center justify-between px-6 md:px-12 py-4">
                <Link href="/">
                    <p className="text-2xl font-bold text-white cursor-pointer">
                        Sync<span className="text-gray-400">Pad</span>
                    </p>
                </Link>

                <div className="md:hidden">
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="text-white focus:outline-none"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {menuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>

                <div className="hidden md:flex gap-4 items-center">
                    {isLoggedIn ? (
                        <div className="flex items-center gap-3">
                            <p className="text-white font-medium text-sm hidden lg:inline">Welcome!</p>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-1.5 rounded-md text-sm border border-white text-white hover:bg-white hover:text-black transition duration-200 font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link href="/auth/signup">
                                <button className="px-5 py-2 rounded-md border border-white text-white hover:bg-white hover:text-black transition duration-200 font-medium">
                                    Sign Up
                                </button>
                            </Link>
                            <Link href="/auth/signin">
                                <button className="px-5 py-2 rounded-md bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:opacity-90 transition duration-200 font-medium shadow-md">
                                    Sign In
                                </button>
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {menuOpen && (
                <div className="md:hidden px-6 pb-4 flex flex-col gap-3 bg-black/70 backdrop-blur-sm">
                    {isLoggedIn ? (
                        <>
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setMenuOpen(false);
                                }}
                                className="w-full text-left text-white py-2 hover:text-purple-400 transition"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/auth/signup">
                                <button
                                    onClick={() => setMenuOpen(false)}
                                    className="w-full text-left text-white py-2 hover:text-purple-400 transition"
                                >
                                    Sign Up
                                </button>
                            </Link>
                            <Link href="/auth/signin">
                                <button
                                    onClick={() => setMenuOpen(false)}
                                    className="w-full text-left text-white py-2 hover:text-purple-400 transition"
                                >
                                    Sign In
                                </button>
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};
