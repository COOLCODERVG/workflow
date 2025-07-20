import React from 'react';
import ReactDOM from 'react-dom/client';
import SignupForm from './Login.tsx';
import Home from './home.tsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TaskPage from './tasks.tsx';
import TaskPage2 from './yourtasks.tsx';
import Management from './management.tsx';
import ForgotPasssword from './forgotPasssword.tsx';
import ResetPassword from './resetPassword.tsx';

import './index.css';
import { ThemeProvider } from '@/components/theme-provider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SignupForm />} />
            <Route path="/home" element={<Home />} />
            <Route path="/department" element={<TaskPage />} />
            <Route path="/tasks" element={<TaskPage2 />} />
            <Route path="/management" element={<Management />} />
            <Route path="/forgot-password/" element={<ForgotPasssword />} />
            <Route path="/reset-password-form/:resetId" element={<ResetPassword />} />
            <Route path="*" element={<div>Not Found</div>} />
          </Routes>
        </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);