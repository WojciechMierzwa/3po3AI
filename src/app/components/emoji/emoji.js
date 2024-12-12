'use client';
import { useEffect } from 'react';
import styles from './emoji.module.css'; // Import CSS Module

export default function Emoji() {
  useEffect(() => {
    const eyeball = (event) => {
      const eyes = document.querySelectorAll(`.${styles.eye}`); // Use scoped class name
      eyes.forEach((eye) => {
        const x = eye.getBoundingClientRect().left + eye.clientWidth / 2;
        const y = eye.getBoundingClientRect().top + eye.clientHeight / 2;
        const radian = Math.atan2(event.pageX - x, event.pageY - y);
        const rot = radian * (180 / Math.PI) * -1 + 270;
        eye.style.transform = `rotate(${rot}deg)`;
      });
    };

    document.body.addEventListener('mousemove', eyeball);
    return () => {
      document.body.removeEventListener('mousemove', eyeball);
    };
  }, []);

  return (
    <div className={styles.face}> {/* Scoped class */}
      <div className={styles.eyes}> {/* Scoped class */}
        <div className={styles.eye}></div> {/* Scoped class */}
        <div className={styles.eye}></div> {/* Scoped class */}
      </div>
    </div>
  );
}
