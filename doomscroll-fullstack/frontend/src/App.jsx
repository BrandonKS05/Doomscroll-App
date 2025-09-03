import Feed from "./components/Feed.jsx";
import Composer from "./components/Composer.jsx";

export default function App(){
  return (
    <>
      <header className="header"><h1>doomscroll</h1></header>
      <main className="app">
        <div className="stack">
          <Composer/>
          <Feed/>
        </div>
      </main>
    </>
  );
}
