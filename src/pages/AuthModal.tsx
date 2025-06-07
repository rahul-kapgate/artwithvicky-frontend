import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { toast } from "react-toastify";

interface User {
  userId: string;
  fullName: string;
  email: string;
}

interface AuthModalProps {
  mode: "login" | "signup";
  onClose: () => void;
  onSwitchMode: (newMode: "login" | "signup") => void;
  onLoginSuccess: (user: User) => void;
}

export default function AuthModal({
  mode,
  onClose,
  onSwitchMode,
  onLoginSuccess,
}: AuthModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    emailOrMobile: "",
    password: "",
    otp: "",
  });
  const [errors, setErrors] = useState({
    fullName: "",
    mobile: "",
    email: "",
    emailOrMobile: "",
    password: "",
    otp: "",
  });
  const [step, setStep] = useState<"form" | "otp">("form");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    let valid = true;
    const newErrors = { ...errors };
    Object.keys(newErrors).forEach(
      (key) => (newErrors[key as keyof typeof newErrors] = "")
    );

    if (mode === "signup" && step === "form") {
      if (!formData.fullName) {
        newErrors.fullName = "Full Name is required";
        valid = false;
      }
      if (!formData.mobile || !/^\d{10}$/.test(formData.mobile)) {
        newErrors.mobile = "Valid Mobile Number is required";
        valid = false;
      }
      if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Valid Email is required";
        valid = false;
      }
    } else if (mode === "login") {
      if (!formData.emailOrMobile) {
        newErrors.emailOrMobile = "Email or Mobile is required";
        valid = false;
      }
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    if (step === "otp" && (!formData.otp || formData.otp.length !== 6)) {
      newErrors.otp = "Enter a valid 6-digit OTP";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const loginHandler = async (emailOrMobile: string, password: string) => {
    const res = await fetch(
      "https://artwithvicky-backend.onrender.com/api/users/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailOrMobile,
          password,
        }),
      }
    );
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      onLoginSuccess({
        userId: data.userId,
        fullName: data.fullName,
        email: data.email,
      });
      toast.success("Login successful!", { position: "top-right" });
      onClose();
    } else {
      toast.error(data.message || "Login failed", { position: "top-right" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      if (mode === "signup") {
        if (step === "form") {
          await fetch(
            "https://artwithvicky-backend.onrender.com/api/users/signup/initiate",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                fullName: formData.fullName,
                mobile: formData.mobile,
                email: formData.email,
                password: formData.password,
              }),
            }
          );
          setStep("otp");
        } else {
          const res = await fetch(
            "https://artwithvicky-backend.onrender.com/api/users/signup/verify",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: formData.email,
                otp: formData.otp,
              }),
            }
          );
          if (res.ok) {
            toast.success("Signup successful! Please log in.", {
              position: "top-right",
            });
            // Switch to login mode and reset form
            onSwitchMode("login");
            setStep("form");
            setFormData({
              fullName: "",
              mobile: "",
              email: "",
              emailOrMobile: "",
              password: "",
              otp: "",
            });
            setErrors({
              fullName: "",
              mobile: "",
              email: "",
              emailOrMobile: "",
              password: "",
              otp: "",
            });
          } else {
            toast.error("OTP verification failed", { position: "top-right" });
          }
        }
      } else {
        await loginHandler(formData.emailOrMobile, formData.password);
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error("Network error, please try again later.", {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-pink-600"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-pink-600 mb-6 text-center">
          {mode === "login"
            ? "Login to Artistic Vicky"
            : step === "form"
            ? "Sign Up for Artistic Vicky"
            : "Verify OTP"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && step === "form" && (
            <>
              <input
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm">{errors.fullName}</p>
              )}
              <input
                name="mobile"
                placeholder="Mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
              {errors.mobile && (
                <p className="text-red-500 text-sm">{errors.mobile}</p>
              )}
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </>
          )}
          {mode === "login" && (
            <>
              <input
                name="emailOrMobile"
                placeholder="Email or Mobile"
                value={formData.emailOrMobile}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
              {errors.emailOrMobile && (
                <p className="text-red-500 text-sm">{errors.emailOrMobile}</p>
              )}
            </>
          )}
          {step === "otp" && (
            <>
              <input
                name="otp"
                placeholder="Enter OTP"
                value={formData.otp}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
              {errors.otp && (
                <p className="text-red-500 text-sm">{errors.otp}</p>
              )}
            </>
          )}
          

          <Button
            type="submit"
            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : step === "otp"
              ? "Verify OTP"
              : mode === "login"
              ? "Login"
              : "Sign Up"}
          </Button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}
          <button
            onClick={() => {
              setStep("form");
              onSwitchMode(mode === "login" ? "signup" : "login");
            }}
            className="text-pink-600 hover:underline ml-1"
          >
            {mode === "login" ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
