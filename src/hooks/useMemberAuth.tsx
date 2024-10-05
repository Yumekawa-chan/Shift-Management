import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, firestore } from '@/src/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface MemberAuthResult {
  loading: boolean;
  leader: string | null;
}

const useMemberAuth = (): MemberAuthResult => {
  const [loading, setLoading] = useState(true);
  const [leader, setLeader] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.role === 'member') {
            setLeader(userData.leader || null);
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

  return { loading, leader };
};

export default useMemberAuth;
