'use client';

import { useEffect, useState } from 'react';
import { auth, firestore } from '@/src/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const useAuthRedirect = (): boolean => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(firestore, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.role === 'admin') {
              router.push('/admin/');
            } else if (userData.role === 'member') {
              router.push('/member/');
            } else {
              console.warn('未知のユーザーロール:', userData.role);
            }
          } else {
            console.warn('ユーザードキュメントが存在しません。');
          }
        } catch (error) {
          console.error('ユーザーデータの取得エラー:', error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  return loading;
};

export default useAuthRedirect;
