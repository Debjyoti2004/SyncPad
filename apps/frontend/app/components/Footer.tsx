import Link from "next/link"
import { FaLinkedin, FaGithub, FaXTwitter, FaHashnode } from "react-icons/fa6"

export function Footer() {
    return (
        <footer className="bg-black text-white">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
                <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                    <div className="space-y-8 xl:col-span-1">
                        <Link href="/" className="text-2xl font-extrabold text-white hover:text-gray-300 transition-colors">
                            SyncPad
                        </Link>
                        <p className="text-gray-400 text-base">
                            Making the world a more creative place, one drawing at a time.
                        </p>
                        <div className="flex space-x-6 text-2xl">
                            <a
                                href="https://x.com/DebjyotiSh27921"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-transform transform hover:scale-125"
                            >
                                <FaXTwitter />
                            </a>
                            <a
                                href="https://github.com/Debjyoti2004"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-transform transform hover:scale-125"
                            >
                                <FaGithub />
                            </a>
                            <a
                                href="https://www.linkedin.com/in/debjyotishit/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-transform transform hover:scale-125"
                            >
                                <FaLinkedin />
                            </a>
                            <a
                                href="https://debjyoti27.hashnode.dev"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-transform transform hover:scale-125"
                            >
                                <FaHashnode />
                            </a>
                        </div>
                    </div>

                    <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                                    Product
                                </h3>
                                <ul role="list" className="mt-4 space-y-4">
                                    {["Features", "Tutorials", "Pricing", "Releases"].map((item) => (
                                        <li key={item}>
                                            <Link
                                                href="#"
                                                className="text-base text-gray-400 hover:text-white"
                                            >
                                                {item}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-12 md:mt-0">
                                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                                    Support
                                </h3>
                                <ul role="list" className="mt-4 space-y-4">
                                    {["Help Center", "API Documentation", "Community", "Contact Us"].map(
                                        (item) => (
                                            <li key={item}>
                                                <Link
                                                    href="#"
                                                    className="text-base text-gray-400 hover:text-white"
                                                >
                                                    {item}
                                                </Link>
                                            </li>
                                        ),
                                    )}
                                </ul>
                            </div>
                        </div>
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                                    Company
                                </h3>
                                <ul role="list" className="mt-4 space-y-4">
                                    {["About", "Blog", "Jobs", "Press"].map((item) => (
                                        <li key={item}>
                                            <Link
                                                href="#"
                                                className="text-base text-gray-400 hover:text-white"
                                            >
                                                {item}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-12 md:mt-0">
                                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                                    Legal
                                </h3>
                                <ul role="list" className="mt-4 space-y-4">
                                    {["Privacy", "Terms", "Cookie Policy", "Licensing"].map((item) => (
                                        <li key={item}>
                                            <Link
                                                href="#"
                                                className="text-base text-gray-400 hover:text-white"
                                            >
                                                {item}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 border-t border-gray-800 pt-8">
                    <p className="text-base text-gray-400 xl:text-center">
                        &copy; {new Date().getFullYear()} Debjyoti Shit. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}
