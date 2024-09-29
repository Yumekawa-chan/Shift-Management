import Header from '@/components/Header';
import Footer from '@/components/Footer';

const TitleSection = () => {
  return <p className="text-xl font-semibold mb-6">ログイン</p>;
};

const ButtonSection = () => {
  return (
    <div className="flex flex-col items-center gap-4">
      <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
        管理者としてログイン
      </button>
      <button className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
        メンバーとしてログイン
      </button>
      <button className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600">
        メンバー登録
      </button>
    </div>
  );
};

const HomeMain = () => {
  return (
    <main className="flex flex-col items-center justify-center flex-grow">
      <TitleSection />
      <ButtonSection />
    </main>
  );
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header showExtras={false} />
      <HomeMain />
      <Footer />
    </div>
  );
}
