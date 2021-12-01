export default function Screen() {
  return (
    <div className="relative bg-gray-50 overflow-hidden h-full">
      <div className="relative pt-16 pb-16 sm:pb-24">
        <main className="mt-16 mx-auto max-w-7xl px-4 sm:mt-24">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block xl:inline">Your Markdown</span>{" "}
              <span className="block text-indigo-600 xl:inline">
                notes on the Internet
              </span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              A fully native app that allows you to publish your notes on the
              internet instantly. Plus an API and much more.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
