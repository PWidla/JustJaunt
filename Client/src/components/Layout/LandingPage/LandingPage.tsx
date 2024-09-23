import { useAuth } from "../../../context/AuthProvider";

const LandingPage = () => {
  const { isLoggedIn, signup } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center bg-dark-green text-white w-full h-screen space-y-32 font-primaryRegular">
      <div className="text-center mb-10 w-full">
        <h1 className="text-4xl font-primaryBold">Welcome to Just Jaunt</h1>
        <p className="mt-4">Plan your dream trip with us!</p>
        {!isLoggedIn && (
          <>
            <button
              className="mt-6 px-8 py-5 bg-gradient-to-r from-dark-brown to-light-orange text-white hover:bg-white hover:text-dark-green rounded-3xl"
              onClick={signup}
            >
              Sign Up
            </button>
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
