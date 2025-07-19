import Button from "../components/ui/button";
import Link from "next/link";

export const Navbar = () => {
  return (
    <div className="flex items-center justify-between w-full h-16 px-12 py-2 bg-transparent">    
      <div>
        <p className="font-extrabold text-black">
          Sync<span className="text-gray-500">Pad</span>
        </p>
      </div>

      <div className="flex gap-4">
        <Link href={"/auth/signup"}>
          <Button 
            label="Sign Up" 
            variant="secondary" 
            onClick={() => {}} 
          />
        </Link>
        <Link href={"/auth/signin"}>
          <Button 
            label="Sign In" 
            onClick={() => {}} 
          />
        </Link>
      </div>
    </div>
  );
};
