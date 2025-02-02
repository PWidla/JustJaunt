import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

const LandingPage = () => {
  const { isLoggedIn } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-r from-dark-green to-light-green text-white w-full h-screen space-y-32 font-primaryRegular">
      <div className="text-center mb-10 w-full">
        <h1 className="text-4xl font-primaryBold">Welcome to Just Jaunt</h1>
        <p className="mt-4">Plan your dream trip with us!</p>
        {!isLoggedIn && (
          <>
            <Link to="/login">
              <button
                type="button"
                className="mt-6 px-8 py-5 bg-gradient-to-r from-dark-brown to-light-brown text-white hover:text-dark-green rounded-3xl transition-colors duration-300 hover:font-primaryBold"
              >
                Log in
              </button>
            </Link>
          </>
        )}
      </div>
      <section className="text-center mb-10 w-full">
        <h2 className="text-2xl">Why Choose Us?</h2>
        <ul className="list-disc list-inside mt-4">
          <li>Easy trip planning</li>
          <li>24/7 support</li>
          <li>Free access</li>
        </ul>
      </section>
      <section className="text-center w-full">
        <h2 className="text-2xl">User Testimonials</h2>
        <blockquote className="mt-4 italic ">
          "The best app for planning trips!" - John D.
        </blockquote>
      </section>
    </div>
  );
};

export default LandingPage;
