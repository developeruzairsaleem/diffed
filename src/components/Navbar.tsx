import NavButtons from "./NavButtons";

export default function Navbar() {
  return (
    <div className="flex justify-between max-w-8xl py-8 w-full px-6 mx-auto">
      <img src="/logo/logo.png" alt="Logo image" />

      <div className="main_buttons flex">
        <ul className="main_nav uppercase mt-3 text-lg  flex gap-10 mr-16">
          <li>Home</li>
          <li>Games</li>
          <li>Features</li>
          <li>Customer Reviews</li>
          <li>About</li>
        </ul>
        <NavButtons />
      </div>
    </div>
  );
}
