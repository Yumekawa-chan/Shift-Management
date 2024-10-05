// TODO: リファクタリング

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
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <FaUser className="mr-2" /> 管理者ログイン
      </h2>
      {error && <p className="text-red-500">{error}</p>}
      <label className="flex flex-col">
        メールアドレス
        <input
          type="email"
          className="border rounded px-3 py-2 w-full mt-1"
          placeholder="example@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label className="flex flex-col">
        パスワード
        <input
          type="password"
          className="border rounded px-3 py-2 w-full mt-1"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors duration-300 mt-4 flex items-center justify-center"
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
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <FaUser className="mr-2" /> メンバーログイン
      </h2>
      {error && <p className="text-red-500">{error}</p>}
      <label className="flex flex-col">
        メールアドレス
        <input
          type="email"
          className="border rounded px-3 py-2 w-full mt-1"
          placeholder="example@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label className="flex flex-col">
        パスワード
        <input
          type="password"
          className="border rounded px-3 py-2 w-full mt-1"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button
        className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition-colors duration-300 mt-4 flex items-center justify-center"
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
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <FaUserPlus className="mr-2" /> メンバー登録
      </h2>
      {error && <p className="text-red-500">{error}</p>}
      <label className="flex flex-col">
        姓
        <input
          type="text"
          className="border rounded px-3 py-2 w-full mt-1"
          placeholder="山田"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </label>
      <label className="flex flex-col">
        名
        <input
          type="text"
          className="border rounded px-3 py-2 w-full mt-1"
          placeholder="太郎"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </label>
      <label className="flex flex-col">
        学年
        <select
          className="border rounded px-3 py-2 w-full mt-1"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
        >
          <option value="B3">B3</option>
          <option value="B4">B4</option>
          <option value="M1">M1</option>
          <option value="M2">M2</option>
        </select>
      </label>
      <label className="flex flex-col">
        メールアドレス
        <input
          type="email"
          className="border rounded px-3 py-2 w-full mt-1"
          placeholder="example@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label className="flex flex-col">
        パスワード
        <input
          type="password"
          className="border rounded px-3 py-2 w-full mt-1"
          placeholder="6文字以上"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <label className="flex flex-col">
        パスワード（確認）
        <input
          type="password"
          className="border rounded px-3 py-2 w-full mt-1"
          placeholder="もう一度入力"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </label>
      <label className="flex flex-col">
        リーダー選択
        <select
          className="border rounded px-3 py-2 w-full mt-1"
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
        className="bg-gray-600 text-white px-6 py-3 rounded hover:bg-gray-700 transition-colors duration-300 mt-4 flex items-center justify-center"
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
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Hyperionix</h1>
        <p className="text-lg text-gray-600">ログインまたは登録してください。</p>
      </div>
      <div className="flex flex-col items-center gap-4">
        <button
          className="bg-blue-600 text-white px-4 py-3 rounded hover:bg-blue-700 transition-colors duration-300 flex items-center"
          onClick={() => openModal(<AdminLoginForm closeModal={closeModal} />)}
        >
          <FaUser className="mr-2" />
          管理者としてログイン
        </button>
        <button
          className="bg-green-600 text-white px-4 py-3 rounded hover:bg-green-700 transition-colors duration-300 flex items-center"
          onClick={() => openModal(<MemberLoginForm closeModal={closeModal} />)}
        >
          <FaUser className="mr-2" />
          メンバーとしてログイン
        </button>
        <button
          className="bg-gray-600 text-white px-5 py-3 rounded hover:bg-gray-700 transition-colors duration-300 flex items-center"
          onClick={() => openModal(<MemberRegistrationForm closeModal={closeModal} />)}
        >
          <FaUserPlus className="mr-2" />
          メンバー登録
        </button>
      </div>

      {modalIsOpen && (
        <div
          className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
            modalVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className={`bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative transform transition-transform duration-300 ${
              modalVisible ? 'scale-100' : 'scale-90'
            }`}
          >
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
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
