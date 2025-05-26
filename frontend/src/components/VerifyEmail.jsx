import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../utils/api";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("Verifying...");
  const hasVerified = useRef(false); // Prevent double run in dev mode

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get("token");
      console.log("Verification token:", token);

      if (!token) {
        setStatus("Invalid or missing token.");
        return;
      }

      try {
        const res = await api.get(`/user/verify/?token=${token}`);
        console.log("Verification response:", res);
        setStatus(res.data.message || "Email verified successfully!");
      } catch (err) {
        console.error("Verification error:", err);
        setStatus(err.response?.data?.message || "Verification failed.");
      }
    };

    if (!hasVerified.current) {
      hasVerified.current = true;
      verifyToken();
    }
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">{status}</h1>
    </div>
  );
};

export default VerifyEmail;
