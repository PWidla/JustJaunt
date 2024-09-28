const PlanTripPage = () => {
  const searchCity = async () => {
    const [books, authors, shops] = await Promise.all([
      APIManager.fetchBooks(),
      APIManager.fetchAuthor(),
      APIManager.fetchShops(),
    ]);

    this.handleBooks(books);
    this.handleAuthors(authors);
    this.handleShops(shops);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-r from-dark-green to-light-green text-white w-full min-h-screen space-y-8 p-8 font-primaryRegular">
      <span className="font-primaryRegular text-center">
        Tell us the name of the city you plan to visit
      </span>
      <input type="text" name="" id="" className="" />
      <button
        type="button"
        className="mt-6 px-3 py-2 bg-gradient-to-r from-dark-brown to-light-brown text-white hover:text-dark-green rounded-3xl transition-colors duration-300 hover:font-primaryBold"
        onClick={searchCity}
      >
        Search
      </button>
    </div>
  );
};

export default PlanTripPage;
