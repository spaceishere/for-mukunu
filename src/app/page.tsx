"use client";

import { useState } from "react";
import {
  Heart,
  Coffee,
  Utensils,
  Film,
  Mail,
  ArrowLeft,
  ArrowRight,
  Sparkles,
} from "lucide-react";

// Simulated images - replace with your actual images
const ImagePlaceholder = ({
  type,
  className = "",
  src,
  alt,
}: {
  type: string;
  className?: string;
  src?: string;
  alt?: string;
}) =>
  src ? (
    <img src={src} alt={alt || type} className={`rounded-xl ${className}`} />
  ) : (
    <div
      className={`bg-gradient-to-br from-pink-200 to-rose-300 rounded-xl flex items-center justify-center ${className}`}
    >
      <Heart className="w-20 h-20 text-white opacity-50" />
    </div>
  );

export default function RomanticProposal() {
  const [currentView, setCurrentView] = useState<
    "initial" | "confirm" | "rejected" | "success"
  >("initial");
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    dateType: "",
    favColor: "",
    movie: "",
    email: "",
    customMovie: "",
  });
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const gifMap: Record<string, string> = {
    love: "/love.png",
    cute: "/cute.gif",
    sad: "/bat.gif",
    yes: "/yes.gif",
  };

  const colors = [
    { hex: "#ef4444", name: "Улаан" },
    { hex: "#f97316", name: "Улбар шар" },
    { hex: "#eab308", name: "Шар" },
    { hex: "#22c55e", name: "Ногоон" },
    { hex: "#3b82f6", name: "Цэнхэр" },
    { hex: "#a855f7", name: "Нил ягаан" },
    { hex: "#ec4899", name: "Ягаан" },
    { hex: "#14b8a6", name: "Хөх ногоон" },
    { hex: "#6b7280", name: "Саарал" },
    { hex: "#000000", name: "Хар" },
  ];

  const movies = [
    "Чөтгөрийн Үдэш",
    "Тэг Цэг Үйлдэл",
    "Demon Slayer: Infinity Castle",
    "Эцсийн Зогсоол 2",
    "Хажуу Өрөө",
  ];

  // movies жагсаалтын доор байгаа movieImages-аа ингэж солиорой
  const movieImages: Record<string, string> = {
    "Чөтгөрийн Үдэш":
      "https://www.tengis.mn/_next/image?url=https%3A%2F%2Fwww.tengis.mn%2Fresource%2Ftengis-v2%2Fmovies%2Fposters%2FKVf0A-29teXqxWTzuIWWQ-0001001075%2Fvertical.jpg&w=384&q=75",
    "Тэг Цэг Үйлдэл":
      "https://www.tengis.mn/_next/image?url=https%3A%2F%2Fwww.tengis.mn%2Fresource%2Ftengis-v2%2Fmovies%2Fposters%2FKVf0A-29teXqxWTzuIWWQ-0001001064%2Fvertical.png&w=384&q=75",
    "Demon Slayer: Infinity Castle":
      "https://www.tengis.mn/_next/image?url=https%3A%2F%2Fwww.tengis.mn%2Fresource%2Ftengis-v2%2Fmovies%2Fposters%2FKVf0A-29teXqxWTzuIWWQ-0001001013%2Fvertical.jpg&w=384&q=75",
    "Эцсийн Зогсоол 2":
      "https://www.tengis.mn/_next/image?url=https%3A%2F%2Fwww.tengis.mn%2Fresource%2Ftengis-v2%2Fmovies%2Fposters%2FKVf0A-29teXqxWTzuIWWQ-0001001033%2Fvertical.jpg&w=384&q=75",
    "Хажуу Өрөө":
      "https://www.tengis.mn/_next/image?url=https%3A%2F%2Fwww.tengis.mn%2Fresource%2Ftengis-v2%2Fmovies%2Fposters%2FKVf0A-29teXqxWTzuIWWQ-0001001074%2Fvertical.jpg&w=384&q=75",
  };

  const handleSubmit = async () => {
    if (step === 0 && !formData.dateType) {
      setError("Сонголтоо хийгээрэй");
      return;
    }
    if (step === 1 && !formData.favColor) {
      setError("Өнгөө сонгоорой");
      return;
    }
    if (step === 2) {
      if (!formData.movie && !formData.customMovie) {
        setError("Кино сонгоорой");
        return;
      }
      if (!formData.movie && formData.customMovie) {
        setFormData({ ...formData, movie: formData.customMovie });
      }
    }
    if (step === 3) {
      if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
        setError("Зөв имэйл оруулна уу");
        return;
      }
      try {
        setSending(true);
        setError("");
        const dateTypeLabel =
          formData.dateType === "coffee"
            ? "Кофе"
            : formData.dateType === "meal"
            ? "Хоол"
            : formData.dateType;
        const movieTitle = formData.movie || formData.customMovie;
        const res = await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: formData.email,
            subject: "Болзоо баталгаажлаа",
            text: `Сайн байна уу!\nТаны сонголт:\n- Болзоо: ${dateTypeLabel}\n- Кино: ${movieTitle}\n\nУдахгүй уулзъя! 💕`,
          }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.error || "Имэйл илгээхэд алдаа гарлаа");
        }
        setSending(false);
        setShowModal(false);
        setCurrentView("success");
        setShowConfetti(true);
      } catch (e: unknown) {
        setSending(false);
        const message = e instanceof Error ? e.message : "Имэйл илгээж чадсангүй";
        setError(message);
      }
      return;
    }
    setError("");
    setStep(step + 1);
  };

  const ConfettiEffect = () => (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-fall"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-${Math.random() * 20}px`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        >
          <Heart
            className="text-pink-500"
            style={{ width: `${10 + Math.random() * 10}px` }}
          />
        </div>
      ))}
      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall linear forwards;
        }
      `}</style>
    </div>
  );

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 p-4 overflow-hidden">
      {/* Animated background hearts */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        {[...Array(20)].map((_, i) => (
          <Heart
            key={i}
            className="absolute text-pink-400 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${20 + Math.random() * 40}px`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {showConfetti && <ConfettiEffect />}

      {/* Initial View */}
      {currentView === "initial" && (
        <div className="relative max-w-lg w-full">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10">
            <Sparkles className="w-12 h-12 text-yellow-400 animate-pulse" />
          </div>
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-10 space-y-6 transform hover:scale-[1.02] transition-all duration-300">
            <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Dedicated to Mukunuu 💕
            </h1>

            <div className="relative group">
              <ImagePlaceholder
                type="love"
                src={gifMap.love}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <p className="text-2xl text-center text-gray-700 font-medium">
              Надтай болзохуу? 💝
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowModal(true);
                  setStep(0);
                }}
                className="flex-1 group relative overflow-hidden px-6 py-4 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 text-white font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Heart className="w-5 h-5" />
                  Тийм
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>

              <button
                onClick={() => setCurrentView("confirm")}
                className="flex-1 px-6 py-4 rounded-xl bg-white/80 border-2 border-gray-200 text-gray-700 font-semibold shadow-md hover:shadow-lg hover:bg-white transition-all duration-300 hover:scale-105 hover:border-gray-300"
              >
                Үгүй
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation View */}
      {currentView === "confirm" && (
        <div className="max-w-lg w-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-10 space-y-6">
          <ImagePlaceholder
            type="cute"
            src={gifMap.cute}
            className="w-full h-64 object-cover"
          />

          <p className="text-xl text-center text-gray-700 leading-relaxed">
            Үнэхээр итгэлтэй байна уу? 🥺
            <br />
            <span className="text-pink-500 font-medium">
              Дахиад нэг бодоод үзэх үү?
            </span>
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => {
                setShowModal(true);
                setStep(0);
              }}
              className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Зза тэгье даа 💕
            </button>

            <button
              onClick={() => setCurrentView("rejected")}
              className="flex-1 px-6 py-4 rounded-xl bg-white/80 border-2 border-gray-200 text-gray-700 font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Үгүй ээ үгүй
            </button>
          </div>
        </div>
      )}

      {/* Rejected View */}
      {currentView === "rejected" && (
        <div className="max-w-lg w-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-10 space-y-6">
          <ImagePlaceholder
            type="sad"
            src={gifMap.sad}
            className="w-full h-64 object-cover"
          />

          <p className="text-xl text-center text-gray-700 font-medium">
            Би заавал буцаж ирнээ амлаж байна. 🦇💔
          </p>
        </div>
      )}

      {/* Success View */}
      {currentView === "success" && (
        <div className="max-w-lg w-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-10 space-y-6">
          <ImagePlaceholder
            type="yes"
            src={gifMap.yes}
            className="w-full h-64 object-cover"
          />

          <p className="text-2xl text-center text-gray-700 font-medium">
            Маш зөв сонголт хийж зөвшөөрсөнд баярлалаа! 🎉💕
          </p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 space-y-6 transform animate-scale-in">
            {/* Step 0: Date Type */}
            {step === 0 && (
              <>
                <h2 className="text-2xl font-bold text-center text-gray-800">
                  Юу хийж болзох вэ? ☕🍽️
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: "coffee", label: "Кофе", icon: Coffee },
                    { value: "meal", label: "Хоол", icon: Utensils },
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() =>
                        setFormData({ ...formData, dateType: value })
                      }
                      className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                        formData.dateType === value
                          ? "border-rose-500 bg-rose-50 scale-105 shadow-lg"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:scale-105"
                      }`}
                    >
                      <Icon
                        className={`w-12 h-12 mx-auto mb-2 ${
                          formData.dateType === value
                            ? "text-rose-500"
                            : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`font-semibold ${
                          formData.dateType === value
                            ? "text-rose-500"
                            : "text-gray-700"
                        }`}
                      >
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Step 1: Favorite Color */}
            {step === 1 && (
              <>
                <h2 className="text-2xl font-bold text-center text-gray-800">
                  Дуртай өнгөө сонгоорой 🎨
                </h2>
                <div className="grid grid-cols-5 gap-3">
                  {colors.map(({ hex, name }) => (
                    <button
                      key={hex}
                      onClick={() =>
                        setFormData({ ...formData, favColor: hex })
                      }
                      className={`aspect-square rounded-xl transition-all duration-300 ${
                        formData.favColor === hex
                          ? "ring-4 ring-rose-400 scale-110 shadow-lg"
                          : "hover:scale-110 shadow-md"
                      }`}
                      style={{ backgroundColor: hex }}
                      title={name}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Step 2: Movie */}
            {step === 2 && (
              <>
                <h2 className="text-2xl font-bold text-center text-gray-800 flex items-center justify-center gap-2">
                  <Film className="w-7 h-7" />
                  Кино сонгоорой
                </h2>
                <div className="space-y-3">
                  {movies.map((movie) => (
                    <button
                      key={movie}
                      onClick={() => setFormData({ ...formData, movie })}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                        formData.movie === movie
                          ? "border-rose-500 bg-rose-50 scale-105 shadow-lg"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:scale-105"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {movieImages[movie] && (
                          <img
                            src={movieImages[movie]}
                            alt={movie}
                            className="w-12 h-12 rounded-lg object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        )}
                        <span
                          className={`font-medium ${
                            formData.movie === movie
                              ? "text-rose-500"
                              : "text-gray-700"
                          }`}
                        >
                          {movie}
                        </span>
                      </div>
                    </button>
                  ))}
                  <div className="pt-2">
                    <input
                      type="text"
                      placeholder="Өөр кино санал болгох..."
                      value={formData.customMovie}
                      onChange={(e) =>
                        setFormData({ ...formData, customMovie: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all duration-300"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Step 3: Email */}
            {step === 3 && (
              <>
                <h2 className="text-2xl font-bold text-center text-gray-800 flex items-center justify-center gap-2">
                  <Mail className="w-7 h-7" />
                  Имэйл хаягаа оруулна уу
                </h2>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all duration-300"
                />
              </>
            )}

            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-center font-medium">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => {
                  if (step > 0) {
                    setStep(step - 1);
                    setError("");
                  } else {
                    setShowModal(false);
                    setError("");
                  }
                }}
                disabled={sending}
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-all duration-300 disabled:opacity-50"
              >
                <ArrowLeft className="w-5 h-5" />
                {step > 0 ? "Буцах" : "Болих"}
              </button>

              <button
                onClick={handleSubmit}
                disabled={sending}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:scale-100"
              >
                {step < 3 ? (
                  <>
                    Дараах
                    <ArrowRight className="w-5 h-5" />
                  </>
                ) : sending ? (
                  "Илгээж байна..."
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    Илгээх
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
