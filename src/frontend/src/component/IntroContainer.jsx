import React, { useEffect, useState } from 'react';
import { logo } from '../assets/images.js';

const IntroContainer = () => {

  const [introVisible, setIntroVisible] = useState(() => {
    const alreadyShown = sessionStorage.getItem('introShown');
    if (!alreadyShown) {
      setTimeout(() => {
        sessionStorage.setItem('introShown', 'true');
      }, 3000);
      return true;
    }
    return false;
  });

  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (introVisible) {
      const timer1 = setTimeout(() => {
        setFadeOut(true);
      }, 3000);

      const timer2 = setTimeout(() => {
        setIntroVisible(false); // 페이드아웃 후 컴포넌트 제거
      }, 4000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [introVisible]);

  return (
    introVisible && (
      <div className={`intro-container ${fadeOut ? 'hidden' : ''}`}>
        <h1>
          <object data={String(logo)} type="image/svg+xml" aria-label="It Dictionary" />
        </h1>
      </div>
    )
  );
};

export default IntroContainer;
