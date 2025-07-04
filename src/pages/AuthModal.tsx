import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

interface AuthModalProps {
  mode: "login" | "signup";
  onClose: () => void;
  onSwitchMode: (newMode: "login" | "signup") => void;
  onLoginSuccess?: () => void;
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
    confirmPassword: "",
    otp: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    mobile: "",
    email: "",
    emailOrMobile: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  const [step, setStep] = useState<"form" | "otp">("form");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const { login } = useAuth();

  const calculatePasswordStrength = (password: string): number => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[\W_]/.test(password)) score++;
    return score;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));

    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }
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
        newErrors.mobile = "Valid 10-digit Mobile Number is required";
        valid = false;
      }
      if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Valid Email is required";
        valid = false;
      }

      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
      if (!formData.password) {
        newErrors.password = "Password is required";
        valid = false;
      } else if (!passwordRegex.test(formData.password)) {
        newErrors.password =
          "Password must be 8+ chars, include uppercase, number & special char";
        valid = false;
      }

      if (
        !formData.confirmPassword ||
        formData.confirmPassword !== formData.password
      ) {
        newErrors.confirmPassword = "Passwords do not match";
        valid = false;
      }
    } else if (mode === "login") {
      if (!formData.emailOrMobile) {
        newErrors.emailOrMobile = "Email or Mobile is required";
        valid = false;
      }
      if (!formData.password || formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
        valid = false;
      }
    }

    if (step === "otp" && (!formData.otp || formData.otp.length !== 6)) {
      newErrors.otp = "Enter a valid 6-digit OTP";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const loginHandler = async (emailOrMobile: string, password: string) => {
    try {
      const isEmail = /\S+@\S+\.\S+/.test(emailOrMobile);
      const payload = isEmail
        ? { email: emailOrMobile, password }
        : { mobile: emailOrMobile, password };

      const res = await fetch(
        "https://artwithvicky-backend.onrender.com/api/users/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        login(
          {
            userId: data.userId,
            fullName: data.fullName,
            email: data.email,
            role: data.role,
            authorizedCourses: data.authorizedCourses,
          },
          {
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          }
        );

        toast.success("Login successful!");

        if (data.role === "admin") {
          toast.success("Welcome Admin!");
        } else {
          onLoginSuccess?.();
        }

        onClose();
      } else {
        const errorMsg = data.message || "Invalid credentials";
        toast.error(errorMsg);
        setErrors((prev) => ({
          ...prev,
          emailOrMobile: errorMsg,
        }));
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Network error, please try again");
      setErrors((prev) => ({
        ...prev,
        emailOrMobile: "Network error, please try again",
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      if (mode === "signup") {
        if (step === "form") {
          const res = await fetch(
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
          if (res.ok) {
            setStep("otp");
            toast.info("OTP sent to your email");
          } else {
            const data = await res.json();
            const errorMsg = data.message || "Signup initiation failed";
            toast.error(errorMsg);
          }
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
            toast.success("Signup successful! Please log in.");
            onSwitchMode("login");
            setStep("form");
            setFormData({
              fullName: "",
              mobile: "",
              email: "",
              emailOrMobile: "",
              password: "",
              confirmPassword: "",
              otp: "",
            });
            setErrors({
              fullName: "",
              mobile: "",
              email: "",
              emailOrMobile: "",
              password: "",
              confirmPassword: "",
              otp: "",
            });
            setPasswordStrength(0);
          } else {
            const data = await res.json();
            const errorMsg = data.message || "OTP verification failed";
            toast.error(errorMsg);
            setErrors((prev) => ({ ...prev, otp: errorMsg }));
          }
        }
      } else {
        await loginHandler(formData.emailOrMobile, formData.password);
      }
    } catch (err) {
      toast.error("Network error, please try again later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-purple-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-purple-600 mb-6 text-center">
          {mode === "login"
            ? "Login to Artistic Vicky"
            : step === "form"
            ? "Sign Up for Artistic Vicky"
            : "Verify OTP"}
        </h2>

        <div className="space-y-4">
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
                placeholder="Mobile Number"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
              {errors.mobile && (
                <p className="text-red-500 text-sm">{errors.mobile}</p>
              )}

              <input
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}

              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 pr-12 border rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
              {formData.password && (
                <>
                  <div className="w-full h-1 rounded bg-gray-200">
                    <div
                      className={`h-full rounded transition-all duration-300 ${
                        passwordStrength <= 2
                          ? "bg-red-500 w-1/3"
                          : passwordStrength <= 4
                          ? "bg-yellow-500 w-2/3"
                          : "bg-green-500 w-full"
                      }`}
                    ></div>
                  </div>
                  <p className="text-sm font-medium text-gray-600">
                    {passwordStrength <= 2
                      ? "Weak"
                      : passwordStrength <= 4
                      ? "Medium"
                      : "Strong"}
                  </p>
                </>
              )}

              <input
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </>
          )}

          {mode === "login" && step === "form" && (
            <>
              <input
                name="emailOrMobile"
                placeholder="Email or Mobile Number"
                value={formData.emailOrMobile}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
              {errors.emailOrMobile && (
                <p className="text-red-500 text-sm">{errors.emailOrMobile}</p>
              )}

              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 pr-12 border rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </>
          )}

          {step === "otp" && (
            <input
              name="otp"
              placeholder="Enter 6-digit OTP"
              value={formData.otp}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg text-center tracking-widest"
              maxLength={6}
            />
          )}
          {errors.otp && (
            <p className="text-red-500 text-sm">{errors.otp}</p>
          )}

          <Button
            onClick={handleSubmit}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg"
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
        </div>

        {step === "form" && (
          <p className="mt-4 text-center text-gray-600">
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}
            <button
              onClick={() => {
                setStep("form");
                onSwitchMode(mode === "login" ? "signup" : "login");
                setFormData({
                  fullName: "",
                  mobile: "",
                  email: "",
                  emailOrMobile: "",
                  password: "",
                  confirmPassword: "",
                  otp: "",
                });
                setErrors({
                  fullName: "",
                  mobile: "",
                  email: "",
                  emailOrMobile: "",
                  password: "",
                  confirmPassword: "",
                  otp: "",
                });
                setPasswordStrength(0);
              }}
              className="text-purple-600 hover:underline ml-1 font-medium"
            >
              {mode === "login" ? "Sign Up" : "Login"}
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
