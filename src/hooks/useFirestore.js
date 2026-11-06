import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export function useFirestore(key, initialValue, userId) {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Wipe data immediately when the user changes (fixes cross-account bleed)
    setStoredValue(initialValue);
    setIsLoaded(false);

    if (!userId) {
      setIsLoaded(true);
      return;
    }

    let isMounted = true;

    const fetchData = async () => {
      try {
        const docRef = doc(db, 'users', userId, 'ledger', key);
        const docSnap = await getDoc(docRef);
        
        if (isMounted) {
          if (docSnap.exists()) {
            setStoredValue(docSnap.data().value);
          } else {
            setStoredValue(initialValue);
          }
          setIsLoaded(true);
        }
      } catch (e) {
        console.error("Error fetching document:", e);
        if (isMounted) setIsLoaded(true);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [key, userId]); // Removed initialValue from dependencies to prevent loops

  const setValue = async (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (userId) {
        const docRef = doc(db, 'users', userId, 'ledger', key);
        await setDoc(docRef, { value: valueToStore }, { merge: true });
      }
    } catch (e) {
      console.error("Error saving document:", e);
    }
  };

  return [storedValue, setValue, isLoaded];
}