import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 text-gray-900">

      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">

        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 opacity-90"></div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 text-white">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Find Your Perfect <br /> Roommate Effortlessly
          </h1>

          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Smart Hostel & Roommate Matching System designed to connect students
            based on lifestyle, preferences, and compatibility.
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate("/register")}
              className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition"
            >
              Get Started
            </button>

            <button
              onClick={() => document.getElementById("features").scrollIntoView({ behavior: "smooth" })}
              className="border border-white px-6 py-3 rounded-xl hover:bg-white hover:text-indigo-600 transition"
            >
              Explore
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-20 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose Our System?
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-3">Smart Matching</h3>
            <p>
              Matches roommates based on lifestyle preferences like sleep,
              cleanliness, and study habits.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-3">Easy Room Booking</h3>
            <p>
              Browse available rooms and request them instantly with real-time
              updates.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-3">User-Friendly</h3>
            <p>
              Clean and modern interface designed for a smooth student
              experience.
            </p>
          </div>

        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-indigo-600 text-white text-center py-16">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Find Your Perfect Roommate?
        </h2>

        <p className="mb-6">
          Join now and experience smart hostel living.
        </p>

        <button
          onClick={() => navigate("/register")}
          className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition"
        >
          Sign Up Now
        </button>
      </section>

    </div>
  );
}

export default Home;