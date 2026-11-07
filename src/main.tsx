import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'motion/react';
import './index.css';
import App from './App';
import { getLocale, useLocale } from './i18n';

/** The whole app re-renders in the new language when the player changes it. */
function Root() {
  const locale = useLocale();
  return <App key={locale} />;
}

document.documentElement.lang = getLocale();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <Root />
    </MotionConfig>
  </StrictMode>,
);
