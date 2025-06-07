import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface AuthModalProps {
  mode: "login" | "signup";
  onClose: () => void;
  onSwitchMode: (newMode: "login" | "signup") => void;
}

export default function AuthModal({
  mode,
  onClose,
  onSwitchMode,
}: AuthModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: mode === "login" ? "" : "",
    emailOrMobile: mode === "login" ? "" : "",
    password: "",
  });
  const [errors, setErrors] = useState({
    fullName: "",
    mobile: "",
    email: "",
    emailOrMobile: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    const newErrors = {
      fullName: "",
      mobile: "",
      email: "",
      emailOrMobile: "",
      password: "",
    };

    if (mode === "signup") {
      if (!formData.fullName) {
        newErrors.fullName = "Full Name is required";
        valid = false;
      }
      if (!formData.mobile) {
        newErrors.mobile = "Mobile Number is required";
        valid = false;
      } else if (!/^\d{10}$/.test(formData.mobile)) {
        newErrors.mobile = "Mobile Number must be 10 digits";
        valid = false;
      }
      if (!formData.email) {
        newErrors.email = "Email is required";
        valid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Invalid email format";
        valid = false;
      }
    } else {
      if (!formData.emailOrMobile) {
        newErrors.emailOrMobile = "Email or Mobile is required";
        valid = false;
      }
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      // Handle form submission (e.g., API call)
      console.log(`${mode} submitted:`, formData);
      onClose(); // Close modal on successful submission
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
            : "Sign Up for Artistic Vicky"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <>
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="mobile"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mobile Number
                </label>
                <input
                  type="text"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Enter your mobile number"
                />
                {errors.mobile && (
                  <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
            </>
          )}
          {mode === "login" && (
            <div>
              <label
                htmlFor="emailOrMobile"
                className="block text-sm font-medium text-gray-700"
              >
                Email or Mobile
              </label>
              <input
                type="text"
                id="emailOrMobile"
                name="emailOrMobile"
                value={formData.emailOrMobile}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                placeholder="Enter email or mobile number"
              />
              {errors.emailOrMobile && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.emailOrMobile}
                </p>
              )}
            </div>
          )}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2"
          >
            {mode === "login" ? "Login" : "Sign Up"}
          </Button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <button
            onClick={() => onSwitchMode(mode === "login" ? "signup" : "login")}
            className="text-pink-600 hover:underline"
          >
            {mode === "login" ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
