import confetti from 'canvas-confetti';

export const triggerHabitConfetti = () => {
  // Fire Batman Yellow & Hello Kitty Pink confetti burst!
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#FF69B4', '#F4D03F', '#9B51E0', '#FFB6C1', '#00E5FF'],
    shapes: ['star', 'circle'],
  });
};

export const triggerLevelUpConfetti = () => {
  const duration = 2.5 * 1000;
  const animationEnd = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#FF69B4', '#F4D03F', '#9B51E0'],
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#FF69B4', '#F4D03F', '#00E5FF'],
    });

    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame);
    }
  };
  frame();
};
