import { useState, useEffect } from "react";
import "./App.css";
import ThemeToggle from "./components/ThemeToggle";
import Login from "./components/Login";
import Signup from "./components/Signup";

const SliderInput = ({ label, min, max, step, value, onChange, unit = "" }) => (
  <div className="input-group">
    <div className="input-header">
      <label className="input-label">{label}</label>
      <span className="input-value">
        {value}
        {unit}
      </span>
    </div>
    <div className="slider-container">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </div>
  </div>
);

const ToggleInput = ({ label, checked, onChange }) => (
  <div className="toggle-item">
    <span className="input-label">{label}</span>
    <label className="switch">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="slider-toggle"></span>
    </label>
  </div>
);
function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authView, setAuthView] = useState("login"); // 'login' or 'signup'
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [vitals, setVitals] = useState({
    sleepHours: 6.5,
    physicalActivity: 4,
    caffeine: 200,
    alcohol: 2,
    smoking: false,
    familyHistoryAnxiety: false,
    dizziness: false,
    medication: false,
    recentLifeEvent: false,
    stressLevel: 7,
    heartRate: 78,
    breathingRate: 18,
    sweatingLevel: 3,
    therapySessions: 1,
    dietQuality: 6,
  });

  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [userDecision, setUserDecision] = useState(null); // 'yes' or 'no'

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("vitalSenseCurrentUser");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("vitalSenseCurrentUser");
      }
    }
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleSignup = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("vitalSenseCurrentUser");
    setCurrentUser(null);
    setIsAuthenticated(false);
    handleReset();
  };

  const updateVital = (key, value) => {
    setVitals((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setPrediction(null);
    setUserDecision(null);
    setVitals({
      sleepHours: 6.5,
      physicalActivity: 4,
      caffeine: 200,
      alcohol: 2,
      smoking: false,
      familyHistoryAnxiety: false,
      dizziness: false,
      medication: false,
      recentLifeEvent: false,
      stressLevel: 7,
      heartRate: 78,
      breathingRate: 18,
      sweatingLevel: 3,
      therapySessions: 1,
      dietQuality: 6,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setPrediction(null);
    setUserDecision(null);

    const apiInput = {
      Sleep_Hours: vitals.sleepHours,
      Physical_Activity_hrs_per_week: vitals.physicalActivity,
      Caffeine_Intake_mg_per_day: vitals.caffeine,
      Alcohol_Consumption_drinks_per_week: vitals.alcohol,
      Smoking: vitals.smoking ? "Yes" : "No",
      Family_History_of_Anxiety: vitals.familyHistoryAnxiety ? "Yes" : "No",
      Stress_Level_1_10: vitals.stressLevel,
      Heart_Rate_bpm: vitals.heartRate,
      Breathing_Rate_breaths_per_min: vitals.breathingRate,
      Sweating_Level_1_5: vitals.sweatingLevel,
      Dizziness: vitals.dizziness ? "Yes" : "No",
      Medication: vitals.medication ? "Yes" : "No",
      Therapy_Sessions_per_month: vitals.therapySessions,
      Recent_Major_Life_Event: vitals.recentLifeEvent ? "Yes" : "No",
      Diet_Quality_1_10: vitals.dietQuality,
    };

    try {
      const response = await fetch(
        "https://parvez-synthetic-anxiety-01-api.onrender.com/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiInput),
        },
      );

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();
      setPrediction(data);
    } catch (error) {
      console.error("Error making prediction:", error);
      alert("Failed to get prediction from the API. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show auth screens if not authenticated
  if (!isAuthenticated) {
    if (authView === "login") {
      return (
        <Login
          onLogin={handleLogin}
          onSwitchToSignup={() => setAuthView("signup")}
        />
      );
    } else {
      return (
        <Signup
          onSignup={handleSignup}
          onSwitchToLogin={() => setAuthView("login")}
        />
      );
    }
  }

  return (
    <div className="app-container">
      <nav className="navbar animate-fade-in">
        <div className="logo-section">
          <div className="logo-icon"></div>
          <span className="logo-text">
            VitalSense<span className="highlight-text">Diagnostics</span>
          </span>
        </div>
        <div className="nav-links">
          {currentUser && (
            <span
              style={{ marginRight: "1rem", color: "#495057", fontWeight: 500 }}
            >
              Welcome, {currentUser.name}
            </span>
          )}
          {prediction && (
            <button className="btn-secondary" onClick={handleReset}>
              Start New Assessment
            </button>
          )}
          <ThemeToggle />
          <button className="btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {!prediction && !loading && (
        <main className="hero-section animate-fade-in">
          <h1 className="hero-title">
            Clinical Health <span className="highlight-text">Assessment</span>
          </h1>
          <p className="hero-subtitle">
            Monitor your health metrics with precision. All data is processed
            locally for your privacy.
          </p>
        </main>
      )}

      {prediction && (
        <section className="glass-card results-section animate-fade-in">
          <span className="prediction-label">Prediction Result</span>
          {/* <span className="prediction-value highlight-text">
            Score:{" "}
            {prediction.predicted_anxiety_level?.toFixed(2) ||
              prediction.prediction}
          </span> */}

          <div className="prediction-details">
            {prediction.predicted_anxiety_level < 5 ? (
              <>
                <p>
                  <b className="big-font">
                    Low anxiety detected, no need for further analysis.
                  </b>
                  <br />
                  Keep up the good work!
                </p>
                {userDecision === null ? (
                  <div className="recommendation-actions">
                    <p>Do you want to see some tips anyway?</p>
                    <button
                      className="btn-primary"
                      onClick={() => setUserDecision("yes")}
                    >
                      Yes
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={() => setUserDecision("no")}
                    >
                      No
                    </button>
                  </div>
                ) : userDecision === "yes" ? (
                  <div className="animate-fade-in">
                    <ul className="recommendations-list">
                      <li>Maintain a consistent sleep schedule (7-9 hours).</li>
                      <li>Engage in regular physical activity or walking.</li>
                      <li>Try journaling your thoughts before sleep.</li>
                      <li>Stay hydrated and eat balanced meals.</li>
                    </ul>
                  </div>
                ) : (
                  <p>Thank you for using VitalSense Diagnostics!</p>
                )}
              </>
            ) : (
              <>
                <p>
                  <p>
                    <b className="big-font">Anxiety stress detected</b>
                  </p>
                  Do you want to go for further analysis?
                </p>

                {userDecision === null ? (
                  <div className="recommendation-actions">
                    <button
                      className="btn-primary"
                      onClick={() => {
                        setUserDecision("yes");
                        window.location.href =
                          "https://interview-platform-1-s86t.onrender.com";
                      }}
                    >
                      Yes
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={() => setUserDecision("no")}
                    >
                      No
                    </button>
                  </div>
                ) : userDecision === "no" ? (
                  <div className="animate-fade-in">
                    <p>
                      Thank you for your time. Here are some pointers for
                      reducing anxiety:
                    </p>
                    <ul className="recommendations-list">
                      <li>Practice mindful deep breathing exercises daily.</li>
                      <li>Maintain a consistent sleep schedule (7-9 hours).</li>
                      <li>Reduce caffeine and alcohol intake.</li>
                      <li>Engage in regular physical activity or walking.</li>
                      <li>Try journaling your thoughts before sleep.</li>
                    </ul>
                  </div>
                ) : null}
              </>
            )}
          </div>
          <div style={{ marginTop: "3rem" }}>
            <button className="btn-secondary" onClick={handleReset}>
              Reset & Try Again
            </button>
          </div>
        </section>
      )}

      {loading && (
        <section className="glass-card results-section animate-fade-in">
          <div className="loading-spinner"></div>
          <span className="prediction-label">Analyzing your data...</span>
        </section>
      )}

      {!prediction && !loading && (
        <div className="vitals-form">
          {/* Sleep & Activity */}
          <section
            className="glass-card form-section animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            <h2>💤 Sleep & Activity</h2>
            <SliderInput
              label="Sleep Hours"
              min={2.3}
              max={11.3}
              step={0.1}
              value={vitals.sleepHours}
              onChange={(val) => updateVital("sleepHours", val)}
              unit=" hrs"
            />
            <SliderInput
              label="Physical Activity"
              min={0}
              max={10}
              step={0.1}
              value={vitals.physicalActivity}
              onChange={(val) => updateVital("physicalActivity", val)}
              unit=" hrs/wk"
            />
          </section>

          {/* Substances */}
          <section
            className="glass-card form-section animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <h2>☕ Substances</h2>
            <SliderInput
              label="Caffeine Intake"
              min={0}
              max={599}
              step={5}
              value={vitals.caffeine}
              onChange={(val) => updateVital("caffeine", val)}
              unit=" mg/day"
            />
            <SliderInput
              label="Alcohol Consumption"
              min={0}
              max={19}
              step={1}
              value={vitals.alcohol}
              onChange={(val) => updateVital("alcohol", val)}
              unit=" drinks/wk"
            />
          </section>

          {/* Health History */}
          <section
            className="glass-card form-section animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <h2>🚬 Health History</h2>
            <div className="binary-grid">
              <ToggleInput
                label="Smoking"
                checked={vitals.smoking}
                onChange={(val) => updateVital("smoking", val)}
              />
              <ToggleInput
                label="Family History of Anxiety"
                checked={vitals.familyHistoryAnxiety}
                onChange={(val) => updateVital("familyHistoryAnxiety", val)}
              />
              <ToggleInput
                label="Dizziness"
                checked={vitals.dizziness}
                onChange={(val) => updateVital("dizziness", val)}
              />
              <ToggleInput
                label="Medication"
                checked={vitals.medication}
                onChange={(val) => updateVital("medication", val)}
              />
              <ToggleInput
                label="Recent Major Life Event"
                checked={vitals.recentLifeEvent}
                onChange={(val) => updateVital("recentLifeEvent", val)}
              />
            </div>
          </section>

          {/* Stress & Vitals */}
          <section
            className="glass-card form-section animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            <h2>🧠 Stress & Vitals</h2>
            <SliderInput
              label="Stress Level (1-10)"
              min={1}
              max={10}
              step={1}
              value={vitals.stressLevel}
              onChange={(val) => updateVital("stressLevel", val)}
            />
            <SliderInput
              label="Heart Rate"
              min={60}
              max={119}
              step={1}
              value={vitals.heartRate}
              onChange={(val) => updateVital("heartRate", val)}
              unit=" bpm"
            />
            <SliderInput
              label="Breathing Rate"
              min={12}
              max={29}
              step={1}
              value={vitals.breathingRate}
              onChange={(val) => updateVital("breathingRate", val)}
              unit=" breaths/min"
            />
            <SliderInput
              label="Sweating Level (1-5)"
              min={1}
              max={5}
              step={1}
              value={vitals.sweatingLevel}
              onChange={(val) => updateVital("sweatingLevel", val)}
            />
          </section>

          {/* Therapy & Diet */}
          <section
            className="glass-card form-section animate-fade-in"
            style={{ animationDelay: "0.5s" }}
          >
            <h2>🩺 Therapy & Diet</h2>
            <SliderInput
              label="Therapy Sessions"
              min={0}
              max={12}
              step={1}
              value={vitals.therapySessions}
              onChange={(val) => updateVital("therapySessions", val)}
              unit=" /mo"
            />
            <SliderInput
              label="Diet Quality (1-10)"
              min={1}
              max={10}
              step={1}
              value={vitals.dietQuality}
              onChange={(val) => updateVital("dietQuality", val)}
            />
          </section>
          {/* Submit Section */}
          <div
            className="form-submit-container animate-fade-in"
            style={{ animationDelay: "0.6s" }}
          >
            <button
              className="btn-primary submit-vitals-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Submit Assessment"}
            </button>
            {/* <p className="privacy-note">
              Your data is processed locally before submission.
            </p> */}
          </div>
        </div>
      )}

      <footer className="footer animate-fade-in">
        <p>&copy; 2026 VitalSense Diagnostics. Premium Assessment UI.</p>
      </footer>
    </div>
  );
}

export default App;
