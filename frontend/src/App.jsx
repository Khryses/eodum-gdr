import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterModal from './components/RegisterModal';
import DocumentationModal from './components/DocumentationModal';
import LoginModal from './components/LoginModal';
import ForgotPasswordModal from './components/ForgotPasswordModal';
import Navbar from './components/Navbar';
import Land from './pages/Land';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const [modals, setModals] = useState({
    register: { visible: false, position: { x: 100, y: 100 } },
    documentation: { visible: false, position: { x: 150, y: 150 } },
    login: { visible: false, position: { x: 200, y: 120 } },
    forgotPassword: { visible: false, position: { x: 250, y: 140 } }
  });

  const [zIndexes, setZIndexes] = useState({
    register: 10,
    documentation: 9,
    login: 8,
    forgotPassword: 11
  });

  const [drag, setDrag] = useState({
    active: null,
    offset: { x: 0, y: 0 }
  });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (drag.active) {
        setModals(prev => ({
          ...prev,
          [drag.active]: {
            ...prev[drag.active],
            position: {
              x: e.clientX - drag.offset.x,
              y: e.clientY - drag.offset.y
            }
          }
        }));
      }
    };

    const handleMouseUp = () => {
      setDrag({ active: null, offset: { x: 0, y: 0 } });
    };

    if (drag.active) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [drag]);

  const handleFocus = (modalKey) => {
    const maxZ = Math.max(...Object.values(zIndexes));
    setZIndexes({ ...zIndexes, [modalKey]: maxZ + 1 });
  };

  const openDocumentation = (sectionId) => {
    setModals((prev) => ({
      ...prev,
      documentation: { ...prev.documentation, visible: true }
    }));
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const bringModalsBehind = () => {
    document.activeElement.blur();
  };

  const closeModal = (modalName) => {
    setModals(prev => ({
      ...prev,
      [modalName]: { ...prev[modalName], visible: false }
    }));
  };

  const openModal = (modalName) => {
    setModals(prev => ({
      ...prev,
      [modalName]: { ...prev[modalName], visible: true }
    }));
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="h-screen w-screen bg-gray-950 text-white overflow-hidden relative flex flex-col">
            <Navbar 
              onOpenDocumenti={() => openModal('documentation')} 
            />

            <div className="flex-1">
              <HomePage
                onOpenRegister={() => openModal('register')}
                onOpenLogin={() => openModal('login')}
                bringModalsBehind={bringModalsBehind}
              />
            </div>

            {/* Modal Registrazione */}
            {modals.register.visible && (
              <RegisterModal
                position={modals.register.position}
                isDragging={drag.active}
                dragOffset={drag.offset}
                setIsDragging={(key) => setDrag((d) => ({ ...d, active: key }))}
                setDragOffset={(offset) => setDrag((d) => ({ ...d, offset }))}
                zIndex={zIndexes.register}
                onFocus={() => handleFocus('register')}
                onClose={() => closeModal('register')}
                onOpenDocumentation={openDocumentation}
              />
            )}

            {/* Modal Documentazione */}
            {modals.documentation.visible && (
              <DocumentationModal
                position={modals.documentation.position}
                isDragging={drag.active}
                dragOffset={drag.offset}
                setIsDragging={(key) => setDrag((d) => ({ ...d, active: key }))}
                setDragOffset={(offset) => setDrag((d) => ({ ...d, offset }))}
                zIndex={zIndexes.documentation}
                onFocus={() => handleFocus('documentation')}
                onClose={() => closeModal('documentation')}
              />
            )}

            {/* Modal Login */}
            {modals.login.visible && (
              <LoginModal
                position={modals.login.position}
                isDragging={drag.active}
                dragOffset={drag.offset}
                setIsDragging={(key) => setDrag((d) => ({ ...d, active: key }))}
                setDragOffset={(offset) => setDrag((d) => ({ ...d, offset }))}
                zIndex={zIndexes.login}
                onFocus={() => handleFocus('login')}
                onClose={() => closeModal('login')}
                onOpenForgotPassword={() => {
                  openModal('forgotPassword');
                }}
              />
            )}

            {/* Modal Password Dimenticata */}
            {modals.forgotPassword.visible && (
              <ForgotPasswordModal
                position={modals.forgotPassword.position}
                isDragging={drag.active}
                dragOffset={drag.offset}
                setIsDragging={(key) => setDrag((d) => ({ ...d, active: key }))}
                setDragOffset={(offset) => setDrag((d) => ({ ...d, offset }))}
                zIndex={zIndexes.forgotPassword}
                onFocus={() => handleFocus('forgotPassword')}
                onClose={() => closeModal('forgotPassword')}
              />
            )}
          </div>
        }
      />
      
      {/* Rotta protetta per la Land */}
      <Route 
        path="/land" 
        element={
          <PrivateRoute>
            <Land />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
}

export default App;