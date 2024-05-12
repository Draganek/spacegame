import { useState, useEffect } from 'react';

type StorageType = 'localStorage' | 'sessionStorage';

function useStorage<T>(key: string, initialValue: T, storageType: StorageType = 'localStorage'): [T, (value: T) => void] {
    // Pobieranie wartości z pamięci lokalnej przy montowaniu komponentu
    const getInitialValue = (): T => {
        const storedValue = window[storageType].getItem(key);
        return storedValue ? JSON.parse(storedValue) : initialValue;
    };

    const [value, setValue] = useState<T>(getInitialValue);

    // Zapisywanie wartości w pamięci lokalnej przy zmianie stanu
    const updateStorageValue = (newValue: T) => {
        setValue(newValue);
        window[storageType].setItem(key, JSON.stringify(newValue));
    };

    useEffect(() => {
        // Aktualizacja stanu na podstawie wartości w pamięci lokalnej (jeśli została zmieniona w innym miejscu)
        const handleStorageChange = (event: StorageEvent) => {
            if (event.storageArea === window[storageType] && event.key === key) {
                setValue(getInitialValue());
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [key, storageType]);

    return [value, updateStorageValue];
}

export default useStorage;
