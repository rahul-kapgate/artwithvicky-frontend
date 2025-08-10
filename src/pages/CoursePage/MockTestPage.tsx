import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Question {
  _id: string;
  questionNumber: number;
  question: string;
  options: string[];
  correctOption: string;
  img?: string; // Added optional img property to match JSON data
}

const MockTestPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [testStarted, setTestStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [showConfirm, setShowConfirm] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showTabSwitchWarning, setShowTabSwitchWarning] = useState(false);
  // 🚀 Added for 7-day rule
  const [canTakeTest, setCanTakeTest] = useState(false);
  const [nextAvailableDate, setNextAvailableDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          "https://artwithvicky-backend.onrender.com/api/mocktest/questions"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch questions");
        }
        const data: Question[] = await response.json();
        setQuestions(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load questions");
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  let userId = "";
  const userString = localStorage.getItem("user");

  if (userString) {
    const user = JSON.parse(userString);
    userId = user.userId;
    console.log("User ID:", userId);
  } else {
    console.log("No user found in localStorage");
  }
  // 🚀 Updated for strict 7-day rule with UTC sorting
  useEffect(() => {
    const fetchProfileForTest = async () => {
      if (!userId) {
        setCanTakeTest(false);
        return;
      }
      try {
        const response = await fetch(
          `https://artwithvicky-backend.onrender.com/api/users/profile/${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
        const data = await response.json();
        const mockTests = data.mockTests || [];
        if (mockTests.length === 0) {
          setCanTakeTest(true);
          return;
        }
        // Sort mockTests by dateOfTest in descending order to ensure latest test
        const sortedTests = mockTests.sort(
          (a: { dateOfTest: string }, b: { dateOfTest: string }) =>
            new Date(b.dateOfTest).getTime() - new Date(a.dateOfTest).getTime()
        );
        const lastTest = sortedTests[0];
        const lastDate = new Date(lastTest.dateOfTest);
        const nextDate = new Date(lastDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        setNextAvailableDate(nextDate);
        const today = new Date();
        // Normalize to UTC date-only for comparison
        const todayUTC = new Date(
          Date.UTC(
            today.getUTCFullYear(),
            today.getUTCMonth(),
            today.getUTCDate()
          )
        );
        const lastDateUTC = new Date(
          Date.UTC(
            lastDate.getUTCFullYear(),
            lastDate.getUTCMonth(),
            lastDate.getUTCDate()
          )
        );
        const nextDateUTC = new Date(
          Date.UTC(
            nextDate.getUTCFullYear(),
            nextDate.getUTCMonth(),
            nextDate.getUTCDate()
          )
        );
        // Allow test only if today is at least 7 days after last test and not on the same day
        setCanTakeTest(todayUTC >= nextDateUTC);
      } catch (err) {
        console.error(err);
        setCanTakeTest(false);
      }
    };
    fetchProfileForTest();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (testStarted && timeLeft > 0 && !submitted && !showConfirm) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setShowConfirm(true); // Show submission confirmation modal when time is up
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [testStarted, timeLeft, submitted, showConfirm]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (testStarted && !submitted) {
        e.preventDefault();
        e.returnValue =
          "You have an active test. Are you sure you want to leave? Your progress will not be saved.";
      }
    };

    const handleVisibilityChange = () => {
      if (
        document.hidden &&
        testStarted &&
        !submitted &&
        !showTabSwitchWarning
      ) {
        setShowTabSwitchWarning(true);
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      if (testStarted && !submitted && !showTabSwitchWarning) {
        if (e.clientY <= 0) {
          setShowTabSwitchWarning(true);
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [testStarted, submitted, showTabSwitchWarning]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleAnswerChange = (questionId: string, selectedOption: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: selectedOption }));
  };

  const handleSubmit = async () => {
    setShowConfirm(false);
    let correctCount = 0;
    questions.forEach((q) => {
      if (answers[q._id] === q.correctOption) {
        correctCount++;
      }
    });
    const totalMarks = questions.length;
    const obtainedMarks = correctCount;

    const payload = {
      user: userId,
      dateOfTest: new Date().toISOString(),
      totalMarks: totalMarks,
      obtainedMarks: obtainedMarks,
    };

    try {
      const response = await fetch(
        "https://artwithvicky-backend.onrender.com/api/mocktest/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      if (response.ok) {
        setScore(obtainedMarks);
        setSubmitted(true);
      } else {
        setError("Failed to submit test");
      }
    } catch (err) {
      setError("Failed to submit test");
    }
  };

  const handleSubmitClick = () => {
    setShowConfirm(true); // Show submission confirmation modal
  };

  const handleLeaveClick = () => {
    if (testStarted && !submitted) {
      setShowLeaveConfirm(true); // Show leave confirmation modal
    } else {
      window.history.back();
    }
  };

  const confirmLeave = () => {
    setShowLeaveConfirm(false);
    setShowTabSwitchWarning(false);
    window.history.back();
  };

  const handleReturnToTest = () => {
    setShowTabSwitchWarning(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 via-white to-white text-gray-800">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 via-white to-white text-gray-800">
        <p>{error}</p>
      </div>
    );
  }

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-white text-gray-800 scroll-smooth">
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Card className="rounded-2xl shadow-md">
              <CardContent className="p-6">
                <h2 className="text-3xl font-semibold mb-4">Mock Test</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Welcome to the Mock Test! You will have 1 hour to complete the
                  test. Click the button below to start.
                </p>
                {/* // 🚀 Added for 7-day rule */}
                {!canTakeTest && nextAvailableDate && (
                  <p className="text-lg text-red-600 mb-6">
                    ❌ You can only take one mock test per week. Next available
                    on{" "}
                    {nextAvailableDate
                      ? new Date(nextAvailableDate)
                          .toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                          .replace(/\//g, "-")
                      : ""}
                  </p>
                )}
                {canTakeTest ? (
                  <Button
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2"
                    onClick={() => setTestStarted(true)}
                  >
                    Start Test
                  </Button>
                ) : (
                  <Button
                    disabled
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2"
                  >
                    Start Test
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-white text-gray-800 scroll-smooth">
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Card className="rounded-2xl shadow-md">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">
                  Mock Test Submitted
                </h2>
                <p className="text-lg mb-6">
                  Your score: {score} out of {questions.length}
                </p>
                <Button
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2"
                  onClick={handleLeaveClick}
                >
                  Back to Courses
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
        <section className="py-10 px-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold mb-6 text-center">
              Review Your Answers
            </h3>
            <Card className="rounded-2xl shadow-md">
              <CardContent className="p-6">
                {questions.map((q, index) => {
                  const userAnswer = answers[q._id];
                  const correctAnswer = q.correctOption;
                  const isCorrect = userAnswer === correctAnswer;
                  return (
                    <div key={q._id} className="mb-8">
                      <p className="font-medium mb-2">
                        {index + 1}. {q.question}
                      </p>
                      {/* Display image if available */}
                      {q.img && (
                        <div className="mb-4">
                          <img
                            src={q.img}
                            alt="Question illustration"
                            className="max-w-full h-auto rounded-md shadow-sm"
                            style={{ maxHeight: "300px", objectFit: "contain" }}
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://via.placeholder.com/300?text=Image+Not+Found";
                              e.currentTarget.alt = "Image failed to load";
                            }}
                          />
                        </div>
                      )}
                      <div className="space-y-2">
                        {q.options.map((option, optIndex) => {
                          const optionLabel = String.fromCharCode(
                            65 + optIndex
                          ); // A, B, C, D
                          const isSelected = userAnswer === optionLabel;
                          const isCorrectOption = correctAnswer === optionLabel;
                          let optionClass = "p-2 rounded";
                          if (isSelected && isCorrect) {
                            optionClass += " bg-green-100 text-green-800";
                          } else if (isSelected && !isCorrect) {
                            optionClass += " bg-red-100 text-red-800";
                          } else if (isCorrectOption) {
                            optionClass += " bg-green-100 text-green-800";
                          }
                          return (
                            <div key={optIndex} className={optionClass}>
                              <span>
                                {optionLabel}. {option}
                              </span>
                              {isSelected && (
                                <span className="ml-2">
                                  {isCorrect ? "✅" : "❌"}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-white text-gray-800 scroll-smooth">
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold">Mock Test</h2>
            <div className="text-lg font-medium text-purple-600">
              Time Left: {formatTime(timeLeft)}
            </div>
          </div>
          <p className="text-gray-600 mb-6 text-center">
            Select the correct answer for each question and click Submit Test
            when finished.
          </p>
          <Card className="rounded-2xl shadow-md">
            <CardContent className="p-6">
              {questions.map((q, index) => (
                <div key={q._id} className="mb-6">
                  <p className="font-medium mb-2">
                    {index + 1}. {q.question}
                  </p>
                  {/* Display image if available */}
                  {q.img && (
                    <div className="mb-4">
                      <img
                        src={q.img}
                        alt="Question illustration"
                        className="max-w-full h-auto rounded-md shadow-sm"
                        style={{ maxHeight: "300px", objectFit: "contain" }}
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/300?text=Image+Not+Found";
                          e.currentTarget.alt = "Image failed to load";
                        }}
                      />
                    </div>
                  )}
                  {q.options.map((option, optIndex) => {
                    const optionLabel = String.fromCharCode(65 + optIndex); // A, B, C, D
                    return (
                      <div key={optIndex} className="flex items-center mb-1">
                        <input
                          type="radio"
                          id={`${q._id}-${optIndex}`}
                          name={q._id}
                          value={optionLabel}
                          onChange={() =>
                            handleAnswerChange(q._id, optionLabel)
                          }
                          className="mr-2"
                        />
                        <label htmlFor={`${q._id}-${optIndex}`}>
                          {optionLabel}. {option}
                        </label>
                      </div>
                    );
                  })}
                </div>
              ))}
              <div className="text-center mt-6 space-x-4">
                <Button
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2"
                  onClick={handleSubmitClick}
                >
                  Submit Test
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Custom Submission Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="rounded-2xl shadow-md bg-purple-50 max-w-md w-full mx-4">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-4">
                {timeLeft <= 0 ? "Time is up!" : "Confirm Submission"}
              </h3>
              <p className="text-gray-600 mb-6">
                {timeLeft <= 0
                  ? "Your test time has ended. Would you like to submit your answers now?"
                  : "Are you sure you want to submit your test?"}
              </p>
              <div className="flex justify-center space-x-4">
                <Button
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2"
                  onClick={handleSubmit}
                >
                  Confirm
                </Button>
                <Button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Custom Leave Confirmation Modal */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="rounded-2xl shadow-md bg-purple-50 max-w-md w-full mx-4">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-4">Leave Test?</h3>
              <p className="text-gray-600 mb-6">
                You have an active test. If you leave, your progress will not be
                saved. Are you sure you want to leave?
              </p>
              <div className="flex justify-center space-x-4">
                <Button
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2"
                  onClick={confirmLeave}
                >
                  Leave
                </Button>
                <Button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2"
                  onClick={() => setShowLeaveConfirm(false)}
                >
                  Stay
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Custom Tab Switch Warning Modal */}
      {showTabSwitchWarning && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="rounded-2xl shadow-md bg-purple-50 max-w-md w-full mx-4">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-4">
                Warning: Test Active
              </h3>
              <p className="text-gray-600 mb-6">
                Please do not switch tabs during the test. Your progress will
                not be saved if you leave. Return to the test to continue.
              </p>
              <div className="flex justify-center space-x-4">
                <Button
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2"
                  onClick={handleReturnToTest}
                >
                  Return to Test
                </Button>
                <Button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2"
                  onClick={confirmLeave}
                >
                  Leave Test
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MockTestPage;
