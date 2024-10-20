'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SpinnerIcon from '@/components/SpinnerIcon';
import { FaTimes, FaUser, FaUserPlus, FaSignInAlt } from 'react-icons/fa';
import { auth, firestore } from '@/src/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { FirebaseError } from 'firebase/app';
import useAuthRedirect from '@/src/hooks/useAuthRedirect';
import HomeButton from '@/components/common/HomeButton';

const AdminLoginForm = ({ closeModal }: { closeModal: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleAdminLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(firestore, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === 'admin') {
          closeModal();
          router.push('/admin/');
        } else {
          setError('管理者としての権限がありません。');
          await signOut(auth);
        }
      } else {
        setError('ユーザー情報が見つかりません。');
        await signOut(auth);
      }
    } catch (err: unknown) {
      const errorCode = (err as FirebaseError).code;
      const errorMessage = (err as FirebaseError).message;
      setError(`エラー (${errorCode}): ${errorMessage}`);
      console.error('エラー詳細:', err);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold mb-4 flex items-center text-pink-500">
        <FaUser className="mr-2" /> 管理者ログイン
      </h2>
      {error && <p className="text-rose-400">{error}</p>}
      <label className="flex flex-col text-pink-500">
        メールアドレス
        <input
          type="email"
          className="border border-pink-200 rounded px-3 py-2 w-full mt-1 focus:border-pink-300 focus:ring focus:ring-pink-100"
          placeholder="example@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label className="flex flex-col text-pink-500">
        パスワード
        <input
          type="password"
          className="border border-pink-200 rounded px-3 py-2 w-full mt-1 focus:border-pink-300 focus:ring focus:ring-pink-100"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button
        className="bg-pink-500 text-white px-6 py-3 rounded hover:bg-pink-600 transition-colors duration-300 mt-4 flex items-center justify-center"
        onClick={handleAdminLogin}
      >
        <FaSignInAlt className="mr-2" /> ログイン
      </button>
    </div>
  );
};

const MemberLoginForm = ({ closeModal }: { closeModal: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleMemberLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(firestore, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === 'member') {
          closeModal();
          router.push('/member/');
        } else {
          setError('メンバーとしての権限がありません。');
          await signOut(auth);
        }
      } else {
        setError('ユーザー情報が見つかりません。');
        await signOut(auth);
      }
    } catch (err: unknown) {
      const errorCode = (err as FirebaseError).code;
      const errorMessage = (err as FirebaseError).message;
      setError(`エラー (${errorCode}): ${errorMessage}`);
      console.error('エラー詳細:', err);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold mb-4 flex items-center text-sky-500">
        <FaUser className="mr-2" /> メンバーログイン
      </h2>
      {error && <p className="text-rose-400">{error}</p>}
      <label className="flex flex-col text-sky-500">
        メールアドレス
        <input
          type="email"
          className="border border-sky-200 rounded px-3 py-2 w-full mt-1 focus:border-sky-300 focus:ring focus:ring-sky-100"
          placeholder="example@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label className="flex flex-col text-sky-500">
        パスワード
        <input
          type="password"
          className="border border-sky-200 rounded px-3 py-2 w-full mt-1 focus:border-sky-300 focus:ring focus:ring-sky-100"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button
        className="bg-sky-400 text-white px-6 py-3 rounded hover:bg-sky-500 transition-colors duration-300 mt-4 flex items-center justify-center"
        onClick={handleMemberLogin}
      >
        <FaSignInAlt className="mr-2" /> ログイン
      </button>
    </div>
  );
};

const MemberRegistrationForm = ({ closeModal }: { closeModal: () => void }) => {
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [grade, setGrade] = useState('B3');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [leader, setLeader] = useState('');
  const [adminUsers, setAdminUsers] = useState<{ uid: string; lastName: string; firstName: string }[]>([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchAdminUsers = async () => {
      try {
        const q = query(collection(firestore, 'users'), where('role', '==', 'admin'));
        const querySnapshot = await getDocs(q);
        const admins = querySnapshot.docs.map((doc) => ({
          uid: doc.id,
          lastName: doc.data().lastName,
          firstName: doc.data().firstName,
        }));
        setAdminUsers(admins);
      } catch (err) {
        console.error('管理者ユーザーの取得に失敗しました:', err);
        setError('管理者ユーザーの取得に失敗しました。');
      }
    };

    fetchAdminUsers();
  }, []);

  const handleMemberRegistration = async () => {
    if (password !== confirmPassword) {
      setError('パスワードが一致しません。');
      return;
    }
    if (password.length < 6) {
      setError('パスワードは6文字以上である必要があります。');
      return;
    }
    if (!leader) {
      setError('リーダーを選択してください。');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(firestore, 'users', user.uid), {
        lastName,
        firstName,
        grade,
        email,
        leader, 
        role: 'member',
        createdAt: new Date(),
      });

      closeModal();
      router.push('/member/');
    } catch (err: unknown) {
      const errorCode = (err as FirebaseError).code;
      const errorMessage = (err as FirebaseError).message;
      setError(`エラー (${errorCode}): ${errorMessage}`);
      console.error('エラー詳細:', err);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold mb-4 flex items-center text-purple-500">
        <FaUserPlus className="mr-2" /> メンバー登録
      </h2>
      {error && <p className="text-rose-400">{error}</p>}
      <label className="flex flex-col text-purple-500">
        姓
        <input
          type="text"
          className="border border-purple-200 rounded px-3 py-2 w-full mt-1 focus:border-purple-300 focus:ring focus:ring-purple-100"
          placeholder="山田"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </label>
      <label className="flex flex-col text-purple-500">
        名
        <input
          type="text"
          className="border border-purple-200 rounded px-3 py-2 w-full mt-1 focus:border-purple-300 focus:ring focus:ring-purple-100"
          placeholder="太郎"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </label>
      <label className="flex flex-col text-purple-500">
        学年
        <select
          className="border border-purple-200 rounded px-3 py-2 w-full mt-1 focus:border-purple-300 focus:ring focus:ring-purple-100"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
        >
          <option value="B3">B3</option>
          <option value="B4">B4</option>
          <option value="M1">M1</option>
          <option value="M2">M2</option>
        </select>
      </label>
      <label className="flex flex-col text-purple-500">
        メールアドレス
        <input
          type="email"
          className="border border-purple-200 rounded px-3 py-2 w-full mt-1 focus:border-purple-300 focus:ring focus:ring-purple-100"
          placeholder="example@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label className="flex flex-col text-purple-500">
        パスワード
        <input
          type="password"
          className="border border-purple-200 rounded px-3 py-2 w-full mt-1 focus:border-purple-300 focus:ring focus:ring-purple-100"
          placeholder="6文字以上"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <label className="flex flex-col text-purple-500">
        パスワード（確認）
        <input
          type="password"
          className="border border-purple-200 rounded px-3 py-2 w-full mt-1 focus:border-purple-300 focus:ring focus:ring-purple-100"
          placeholder="もう一度入力"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </label>
      <label className="flex flex-col text-purple-500">
        リーダー選択
        <select
          className="border border-purple-200 rounded px-3 py-2 w-full mt-1 focus:border-purple-300 focus:ring focus:ring-purple-100"
          value={leader}
          onChange={(e) => setLeader(e.target.value)}
        >
          <option value="">リーダーを選択してください</option>
          {adminUsers.map((admin) => (
            <option key={admin.uid} value={admin.uid}>
              {admin.lastName} {admin.firstName}
            </option>
          ))}
        </select>
      </label>
      <button
        className="bg-purple-500 text-white px-6 py-3 rounded hover:bg-purple-600 transition-colors duration-300 mt-4 flex items-center justify-center"
        onClick={handleMemberRegistration}
      >
        登録する
      </button>
    </div>
  );
};

const HomeMain = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const loading = useAuthRedirect(); 

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <SpinnerIcon /> 
      </div>
    );
  }

  const openModal = (content: JSX.Element) => {
    setModalContent(content);
    setModalIsOpen(true);
    setTimeout(() => setModalVisible(true), 10);
  };

  const closeModal = () => {
    setModalVisible(false);
    setTimeout(() => {
      setModalIsOpen(false);
      setModalContent(null);
    }, 300);
  };

  return (
    <main className="flex flex-col items-center justify-center flex-grow bg-gradient-to-b from-blue-100 to-white">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-indigo-500 mb-4">Yumekawa Management</h1>
        <p className="text-lg text-indigo-500">ログインまたは登録してください。</p>
      </div>
      <div className="flex flex-col items-center gap-4">
      <HomeButton
        color="bg-pink-400"
        hoverColor="bg-pink-500"
        icon={<FaUser />}
        text="管理者ログイン"
        onClick={() => openModal(<AdminLoginForm closeModal={closeModal} />)}
      />
      <HomeButton
        color="bg-sky-400"
        hoverColor="bg-sky-500"
        icon={<FaUser />}
        text="メンバーログイン"
        onClick={() => openModal(<MemberLoginForm closeModal={closeModal} />)}
      />
      <HomeButton
        color="bg-purple-400"
        hoverColor="bg-purple-500"
        icon={<FaUserPlus />}
        text="メンバー登録"
        onClick={() => openModal(<MemberRegistrationForm closeModal={closeModal} />)}
      />
    </div>

    {modalIsOpen && (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50 transition-opacity duration-300 ${
        modalVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 border border-purple-200 rounded-2xl shadow-2xl max-w-md w-full p-6 relative transform transition-transform duration-300 ${
          modalVisible ? 'scale-100' : 'scale-90'
        }`}
      >
        <button
          className="absolute top-3 right-3 text-purple-400 hover:text-purple-600 transition-colors duration-200"
          onClick={closeModal}
        >
          <FaTimes size={24} />
        </button>
        {modalContent}
      </div>
    </div>
  )}
    </main>
  );
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <HomeMain />
      <Footer />
    </div>
  );
}