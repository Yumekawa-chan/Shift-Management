import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, firestore } from '@/src/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface AdminAuthResult {
  loading: boolean;
  adminUid: string | null;
}

const useAdminAuth = (): AdminAuthResult => {
  const [loading, setLoading] = useState(true);
  const [adminUid, setAdminUid] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.role === 'admin') {
            setAdminUid(user.uid);
          } else {
            router.push('/');
          }
        } else {
          router.push('/');
        }
      } else {
        router.push('/');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  return { loading, adminUid };
};

export default useAdminAuth;
