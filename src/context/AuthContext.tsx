// src/context/AuthContext.tsx

import { createContext } from 'react';

// 1. Определяем, как выглядят данные внутри нашего контекста
export interface AuthContextType {
  isAdmin: boolean;
  login: () => void;
  logout: () => void;
}

// 2. Создаем и экспортируем сам контекст. В этом файле больше нет компонентов.
export const AuthContext = createContext<AuthContextType | null>(null);