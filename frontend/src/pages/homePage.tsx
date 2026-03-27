import { Header } from '../components//Header/Header';
import { Footer } from '../components/Footer/Footer';
import { Post } from '../components/Post/Post';

export default function HomePage() {
  return (
    <div className="home-layout">
      <Header />

      <main className="feed-container">
        <Post />
        <Post />
      </main>
      <Footer />
    </div>
  );
}