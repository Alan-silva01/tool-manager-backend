
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAdminAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Verificar se há uma sessão ativa no Supabase
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsLoggedIn(!!session);
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
        setIsLoggedIn(false);
      } finally {
        setIsInitialized(true);
      }
    };

    checkSession();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setIsLoggedIn(!!session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async () => {
    try {
      // Para fins temporários, vamos criar uma sessão anônima
      // Em produção, isso deveria ser substituído por login real
      const { data, error } = await supabase.auth.signInAnonymously();
      
      if (error) {
        console.error('Erro no login anônimo:', error);
        // Fallback para cliente-side apenas
        setIsLoggedIn(true);
      } else {
        console.log('Login anônimo bem-sucedido:', data);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      // Fallback para cliente-side apenas
      setIsLoggedIn(true);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      setIsLoggedIn(false);
    }
  };

  return {
    isLoggedIn,
    isInitialized,
    login,
    logout
  };
};
