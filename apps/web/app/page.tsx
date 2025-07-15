"use client";

import { useRouter } from "next/navigation";
import Button from "./components/button";

export default function Home() {
  const router = useRouter();

  const handleSignupRedirect = () => router.push("/auth/signup");
  const handleSigninRedirect = () => router.push("/auth/signin");

  return (
    <div
      style={{
        padding: 40,
        maxWidth: 600,
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 30,
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <div style={{ display: "flex", gap: 15 }}>
        <Button
          label="Sign Up"
          style={{ width: "140px", backgroundColor: "#28a745" }}
          onClick={handleSignupRedirect}
        />
        <Button
          label="Sign In"
          style={{ width: "140px", backgroundColor: "#007bff" }}
          onClick={handleSigninRedirect}
        />
      </div>
      <Button
        label="Create Room"
        style={{ width: "140px", backgroundColor: "#ffc107" }}
        onClick={() => router.push("/room/create")}
      />
      <div className="text-cyan-400 text-6xl"> Hi there</div>
    </div>
  );
}
