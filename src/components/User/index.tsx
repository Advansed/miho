// index.tsx
import React, { useState, useCallback } from 'react';
import UserDashboard from './Dashboard';
import styles from './Styles.module.css';
import AddSessionModal from './NewSession';

export const UserForm: React.FC = () => {
  // Если состояние нужно для будущего функционала
  const [page, setPage] = useState<'main' | 'new'>('main');
  
  // Мемоизируем рендер
  const renderForm = useCallback(() => {
    switch (page) {
      case 'main':
        return <>
          <UserDashboard 
              onNew = { async()=> {  setPage('new') }}
          />;
        </>      
      case 'new':
        return <>
          <AddSessionModal 
              onSubmit  = { async( data ) => { console.log(data) } }
              onClose = { ()=> setPage('main') }
          />;
        </>      
      default:
        return null;
    }
  }, [page]);
  
  return renderForm();
};

// Или оборачиваем в React.memo для предотвращения лишних рендеров
export default React.memo(UserForm);