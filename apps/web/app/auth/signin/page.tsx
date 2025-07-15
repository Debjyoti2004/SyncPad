"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SigninSchema } from "@repo/common/types";
import { postJSON } from "../../../lib/api";
import Button from "../../components/button";
import { BACKEND_URL } from "../../config";

export default function SigninPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    const parsed = SigninSchema.safeParse(formData);

    if (!parsed.success) {
      setError(
        "Invalid input: " +
          Object.values(parsed.error.flatten().fieldErrors).flat().join(", ")
      );
      setLoading(false);
      return;
    }

    try {
      const res = await postJSON(`${BACKEND_URL}/signin`, parsed.data);
      localStorage.setItem("token", res.token);
      localStorage.setItem("ownerId", res.user.id); 
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Signin failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 30, maxWidth: 400, margin: "auto" }}>
      <h2 style={{ marginBottom: 20 }}>Sign In</h2>

      {["email", "password"].map((field) => (
        <input
          key={field}
          type={field === "password" ? "password" : "text"}
          name={field}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          value={formData[field as keyof typeof formData]}
          onChange={handleChange}
          style={{
            width: "100%",
            marginBottom: 10,
            padding: 10,
            border: "1px solid #ccc",
            borderRadius: 6,
          }}
        />
      ))}

      {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}

      <Button
        label={loading ? "Signing in..." : "Sign In"}
        onClick={handleSubmit}
        disabled={loading}
        style={{ width: "100%", cursor: loading ? "not-allowed" : "pointer" }}
      />
    </div>
  );
}
