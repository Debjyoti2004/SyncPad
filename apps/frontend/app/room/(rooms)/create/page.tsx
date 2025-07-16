"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreateRoomSchema } from "@repo/common/types";
import { postWithAuthJSON } from "../../../../lib/api";
import { BACKEND_URL } from "../../../config";
import OwnerRooms from "../../owner/page";
import JoinRoomPage from "../join/page";

export default function CreateRoomPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPublic: true,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const inputValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: inputValue,
    }));
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    const parsed = CreateRoomSchema.safeParse(formData);
    if (!parsed.success) {
      setError(
        "Validation Error: " +
          Object.values(parsed.error.flatten().fieldErrors).flat().join(", ")
      );
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token not found. Please sign in.");
      setLoading(false);
      return;
    }

    try {
      const res = await postWithAuthJSON(
        `${BACKEND_URL}/rooms`,
        parsed.data,
        token
      );

      // Save slug to localStorage for later use
      localStorage.setItem("latestSlug", res.room.slug);

      // Redirect to chat room
      router.push(`/chat/${res.room.id}`);
    } catch (err: any) {
      setError(err.message || "Room creation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 30, maxWidth: 600, margin: "auto" }}>
      <h2 style={{ marginBottom: 20 }}>Create Room</h2>

      <input
        type="text"
        name="name"
        placeholder="Room Name"
        value={formData.name}
        onChange={handleChange}
        style={{
          width: "100%",
          marginBottom: 10,
          padding: 10,
          border: "1px solid #ccc",
          borderRadius: 6,
        }}
      />

      <textarea
        name="description"
        placeholder="Description (optional)"
        value={formData.description}
        onChange={handleChange}
        style={{
          width: "100%",
          marginBottom: 10,
          padding: 10,
          border: "1px solid #ccc",
          borderRadius: 6,
        }}
      />

      <label style={{ display: "block", marginBottom: 10 }}>
        <input
          type="checkbox"
          name="isPublic"
          checked={formData.isPublic}
          onChange={handleChange}
          style={{ marginRight: 8 }}
        />
        Public Room
      </label>

      {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          width: "100%",
          padding: 12,
          background: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Creating..." : "Create Room"}
      </button>

      <JoinRoomPage />

      <hr style={{ margin: "40px 0" }} />

      <OwnerRooms />
    </div>
  );
}