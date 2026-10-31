import React, { useRef, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Gamepad2,
  Trophy,
  Volume2,
  VolumeX,
  RotateCcw,
  Copy,
  Check,
  ArrowLeft,
  MessageSquareX,
  Sparkles,
  Ticket,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import contentData from '../data/contentData.json';

interface GameSectionProps {
  onBackToHome: () => void;
  onOpenEndDialog: () => void;
}

// Configuration constants per specifications (easy to modify at top of file)
const WIN_SCORE = 20;
const GRAVITY = 0.34;
const JUMP_FORCE = -6.4;
const PIPE_SPEED = 2.2;
const PIPE_GAP = 175;
const VOUCHER_TEXT = 'Voucher 2 lít xăng';
const BRAND_NAME = 'VietinBank';
const GAME_TITLE = 'Chờ vui – Chơi hay – Nhận quà liền tay';

interface Pipe {
  x: number;
  topHeight: number;
  bottomY: number;
  passed: boolean;
}

export const GameSection: React.FC<GameSectionProps> = ({
  onBackToHome,
  onOpenEndDialog,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const requestRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Game state
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover' | 'won'>('idle');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [voucherCode, setVoucherCode] = useState<string>('');
  const [lastVoucher, setLastVoucher] = useState<{ code: string; date: string } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [isShaking, setIsShaking] = useState<boolean>(false);

  // Game internal physics & entities ref
  const birdRef = useRef<{
    x: number;
    y: number;
    velocity: number;
    width: number;
    height: number;
    rotation: number;
  }>({
    x: 80,
    y: 200,
    velocity: 0,
    width: 44,
    height: 30,
    rotation: 0,
  });

  const pipesRef = useRef<Pipe[]>([]);
  const frameCountRef = useRef<number>(0);
  const scoreRef = useRef<number>(0);
  const isWonRef = useRef<boolean>(false);

  // Initialize data from localStorage
  useEffect(() => {
    try {
      const savedHigh = localStorage.getItem('vb_flappy_high_score');
      if (savedHigh) setHighScore(parseInt(savedHigh, 10));

      const savedVoucher = localStorage.getItem('vb_flappy_last_voucher');
      if (savedVoucher) {
        setLastVoucher(JSON.parse(savedVoucher));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Web Audio synthesizer for cheerful retro feedback
  const playBeep = useCallback((freq: number, duration: number, type: OscillatorType = 'sine') => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio not supported or blocked
    }
  }, [soundEnabled]);

  // Encouragement text calculation
  const getEncouragement = (currentScore: number) => {
    if (currentScore < 5) return 'Khởi động nhẹ nhàng!';
    if (currentScore < 10) return 'Tốt lắm, tiếp tục nào!';
    if (currentScore < 15) return 'Một nửa chặng đường rồi!';
    if (currentScore < 20) return 'Sắp nhận quà rồi!';
    return 'Xuất sắc!';
  };

  // 1. Generate Voucher Code VB-XXXXXX
  const generateVoucherCode = useCallback((): string => {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    return `VB-${randomDigits}`;
  }, []);

  // 2. Win Game Callback and State
  const winGame = useCallback(() => {
    isWonRef.current = true;
    setGameState('won');

    const newCode = generateVoucherCode();
    setVoucherCode(newCode);

    const nowIso = new Date().toISOString();
    const voucherData = { code: newCode, date: new Date().toLocaleDateString('vi-VN') };
    setLastVoucher(voucherData);

    try {
      localStorage.setItem('vb_flappy_high_score', '20');
      localStorage.setItem('vb_flappy_last_voucher', JSON.stringify(voucherData));
      setHighScore(20);
    } catch {
      // LocalStorage fallback
    }

    // Call external callback if defined
    if (typeof window.onFlappyVoucherWin === 'function') {
      window.onFlappyVoucherWin({
        score: WIN_SCORE,
        voucherCode: newCode,
        reward: VOUCHER_TEXT,
        timestamp: nowIso,
      });
    }

    // Sound effect
    playBeep(523, 0.15, 'triangle');
    setTimeout(() => playBeep(659, 0.15, 'triangle'), 150);
    setTimeout(() => playBeep(784, 0.3, 'triangle'), 300);

    // Celebration Confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00529C', '#DA251C', '#FFD700', '#00A859'],
      });
    } catch {
      // Confetti fallback
    }
  }, [generateVoucherCode, playBeep]);

  // 3. End Game (Collision / Loss)
  const endGame = useCallback((finalScore: number) => {
    setGameState('gameover');
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 450);

    // Haptic vibration if supported
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(200);
      } catch {
        // Ignore vibration errors
      }
    }

    // Sound effect
    playBeep(180, 0.25, 'sawtooth');

    try {
      if (finalScore > highScore) {
        localStorage.setItem('vb_flappy_high_score', finalScore.toString());
        setHighScore(finalScore);
      }
    } catch {
      // Ignore
    }

    // Callback
    if (typeof window.onFlappyVoucherLose === 'function') {
      window.onFlappyVoucherLose({
        score: finalScore,
        timestamp: new Date().toISOString(),
      });
    }
  }, [highScore, playBeep]);

  // 4. Reset Game
  const resetGame = useCallback(() => {
    birdRef.current = {
      x: 80,
      y: 200,
      velocity: 0,
      width: 44,
      height: 30,
      rotation: 0,
    };
    pipesRef.current = [];
    frameCountRef.current = 0;
    scoreRef.current = 0;
    isWonRef.current = false;
    setScore(0);
  }, []);

  // 5. Start Game
  const startGame = useCallback(() => {
    resetGame();
    setGameState('playing');
    playBeep(440, 0.1, 'sine');
  }, [resetGame, playBeep]);

  // 6. Bird Jump Action
  const jump = useCallback(() => {
    if (gameState !== 'playing') {
      if (gameState === 'idle') {
        startGame();
      }
      return;
    }
    birdRef.current.velocity = JUMP_FORCE;
    playBeep(600, 0.08, 'sine');
  }, [gameState, startGame, playBeep]);

  // 7. Copy Voucher Code
  const copyVoucherCode = useCallback(() => {
    const codeToCopy = voucherCode || lastVoucher?.code;
    if (!codeToCopy) return;
    navigator.clipboard.writeText(codeToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [voucherCode, lastVoucher]);

  // Handle Keyboard (Space to jump)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jump]);

  // Main Canvas Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // 1. Clear & Background Gradient (VietinBank aesthetic sky)
      const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
      skyGradient.addColorStop(0, '#00529C'); // VietinBank primary blue
      skyGradient.addColorStop(0.65, '#3b82f6');
      skyGradient.addColorStop(1, '#93c5fd');
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, width, height);

      // Clouds & city buildings background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.arc(70, 70, 40, 0, Math.PI * 2);
      ctx.arc(110, 60, 50, 0, Math.PI * 2);
      ctx.arc(150, 70, 40, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(width - 100, 90, 35, 0, Math.PI * 2);
      ctx.arc(width - 65, 80, 45, 0, Math.PI * 2);
      ctx.arc(width - 30, 90, 35, 0, Math.PI * 2);
      ctx.fill();

      // Skyline silhouette
      ctx.fillStyle = 'rgba(0, 45, 95, 0.25)';
      ctx.fillRect(40, height - 90, 45, 90);
      ctx.fillRect(110, height - 120, 60, 120);
      ctx.fillRect(190, height - 75, 40, 75);
      ctx.fillRect(250, height - 140, 70, 140);
      ctx.fillRect(340, height - 100, 50, 100);
      ctx.fillRect(410, height - 130, 60, 130);

      // Ground / grass banner
      const groundHeight = 55;
      const groundY = height - groundHeight;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, groundY, width, groundHeight);
      ctx.fillStyle = '#DA251C'; // VietinBank Red Accent Strip
      ctx.fillRect(0, groundY, width, 5);

      if (gameState === 'playing') {
        frameCountRef.current += 1;

        // Spawn Pipes
        if (frameCountRef.current % 95 === 0) {
          const minPipe = 60;
          const maxPipe = height - groundHeight - PIPE_GAP - minPipe;
          const topHeight = Math.floor(minPipe + Math.random() * (maxPipe - minPipe));
          pipesRef.current.push({
            x: width,
            topHeight,
            bottomY: topHeight + PIPE_GAP,
            passed: false,
          });
        }

        // Update Bird
        const bird = birdRef.current;
        bird.velocity += GRAVITY;
        bird.y += bird.velocity;
        bird.rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, bird.velocity * 0.08));

        // Ground and ceiling collision
        if (bird.y + bird.height / 2 >= groundY) {
          endGame(scoreRef.current);
          return;
        }
        if (bird.y - bird.height / 2 <= 0) {
          bird.y = bird.height / 2;
          bird.velocity = 0;
        }

        // Update Pipes & Check Collision
        const pipes = pipesRef.current;
        const pipeWidth = 54;

        for (let i = pipes.length - 1; i >= 0; i--) {
          const pipe = pipes[i];
          pipe.x -= PIPE_SPEED;

          // Draw Top Pipe
          const topGrad = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipeWidth, 0);
          topGrad.addColorStop(0, '#1e3a8a');
          topGrad.addColorStop(0.5, '#3b82f6');
          topGrad.addColorStop(1, '#1d4ed8');
          ctx.fillStyle = topGrad;
          ctx.beginPath();
          ctx.roundRect(pipe.x, 0, pipeWidth, pipe.topHeight, [0, 0, 10, 10]);
          ctx.fill();

          // Pipe Cap Top
          ctx.fillStyle = '#DA251C';
          ctx.fillRect(pipe.x - 3, pipe.topHeight - 12, pipeWidth + 6, 12);

          // Draw Bottom Pipe
          const bottomHeight = groundY - pipe.bottomY;
          const botGrad = ctx.createLinearGradient(pipe.x, pipe.bottomY, pipe.x + pipeWidth, pipe.bottomY);
          botGrad.addColorStop(0, '#1e3a8a');
          botGrad.addColorStop(0.5, '#3b82f6');
          botGrad.addColorStop(1, '#1d4ed8');
          ctx.fillStyle = botGrad;
          ctx.beginPath();
          ctx.roundRect(pipe.x, pipe.bottomY, pipeWidth, bottomHeight, [10, 10, 0, 0]);
          ctx.fill();

          // Pipe Cap Bottom
          ctx.fillStyle = '#DA251C';
          ctx.fillRect(pipe.x - 3, pipe.bottomY, pipeWidth + 6, 12);

          // Collision detection with generous hitbox (anti-frustration for kiosk users)
          const birdBox = {
            left: bird.x - bird.width / 2 + 5,
            right: bird.x + bird.width / 2 - 5,
            top: bird.y - bird.height / 2 + 4,
            bottom: bird.y + bird.height / 2 - 4,
          };

          if (birdBox.right > pipe.x && birdBox.left < pipe.x + pipeWidth) {
            if (birdBox.top < pipe.topHeight || birdBox.bottom > pipe.bottomY) {
              endGame(scoreRef.current);
              return;
            }
          }

          // Score check
          if (!pipe.passed && bird.x > pipe.x + pipeWidth) {
            pipe.passed = true;
            scoreRef.current += 1;
            setScore(scoreRef.current);
            playBeep(880, 0.08, 'triangle');

            // Win Condition
            if (scoreRef.current >= WIN_SCORE && !isWonRef.current) {
              winGame();
              return;
            }
          }

          // Remove offscreen pipes
          if (pipe.x + pipeWidth < 0) {
            pipes.splice(i, 1);
          }
        }
      }

      // Draw Mascot / Flying VietinBank Card Character
      const bird = birdRef.current;
      ctx.save();
      ctx.translate(bird.x, bird.y);
      ctx.rotate(bird.rotation);

      // Card body (VietinBank Credit/Debit Card look)
      const cardW = bird.width;
      const cardH = bird.height;
      
      // Card Gradient
      const cardGrad = ctx.createLinearGradient(-cardW / 2, -cardH / 2, cardW / 2, cardH / 2);
      cardGrad.addColorStop(0, '#00529c');
      cardGrad.addColorStop(0.7, '#0284c7');
      cardGrad.addColorStop(1, '#da251c');

      ctx.fillStyle = cardGrad;
      ctx.beginPath();
      ctx.roundRect(-cardW / 2, -cardH / 2, cardW, cardH, 5);
      ctx.fill();

      // Card Gold EMV Chip
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.roundRect(-cardW / 2 + 5, -3, 8, 7, 2);
      ctx.fill();

      // Card decorative logo line
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-cardW / 2 + 18, 5);
      ctx.lineTo(cardW / 2 - 6, 5);
      ctx.stroke();

      // Wing animation
      const wingFlap = Math.sin(frameCountRef.current * 0.35) * 8;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(-5, wingFlap, 11, 6, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Cute Mascot Eye
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cardW / 2 - 8, -4, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(cardW / 2 - 7, -4, 2.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Loop only if playing
      if (gameState === 'playing') {
        animationId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [gameState, endGame, winGame, playBeep]);

  // Adjust canvas size to fit container width cleanly
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const rect = container.getBoundingClientRect();
      const targetWidth = Math.min(rect.width, 580);
      canvas.width = targetWidth;
      canvas.height = Math.min(window.innerHeight * 0.65, 520);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      id="flappy-voucher-game"
      className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-fadeIn select-none"
    >
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-blue-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200 hover:border-blue-300 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Về menu chính
        </button>

        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled((prev) => !prev)}
            className={`p-2 rounded-lg border transition ${
              soundEnabled
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
            }`}
            title={soundEnabled ? 'Đang bật âm thanh' : 'Đang tắt âm thanh (mặc định)'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5" />
            Kỷ lục: {highScore}/20
          </span>
        </div>
      </div>

      {/* Game Title Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
          <Gamepad2 className="w-4 h-4 text-amber-600" />
          {BRAND_NAME} Mini Game
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {GAME_TITLE}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Vượt qua 20 thử thách để nhận {VOUCHER_TEXT} ngay tại quầy giao dịch!
        </p>
      </div>

      {/* Main Game Card */}
      <div
        ref={containerRef}
        className={`relative mx-auto max-w-[580px] rounded-3xl overflow-hidden shadow-xl border-4 border-slate-800 bg-slate-900 flex flex-col items-center ${
          isShaking ? 'animate-shake' : ''
        }`}
      >
        {/* Live HUD Header (when playing) */}
        <div className="w-full bg-slate-950/80 backdrop-blur-xs text-white px-4 py-2.5 flex items-center justify-between border-b border-slate-800 text-xs sm:text-sm z-20">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-400">Điểm: {score}/{WIN_SCORE}</span>
            <span className="text-slate-400">|</span>
            <span className="text-xs text-cyan-300 font-medium">
              {getEncouragement(score)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-24 sm:w-32 bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full transition-all duration-300"
                style={{ width: `${Math.min(100, (score / WIN_SCORE) * 100)}%` }}
              ></div>
            </div>
            <span className="text-[11px] text-slate-300 font-mono">
              {Math.round((score / WIN_SCORE) * 100)}%
            </span>
          </div>
        </div>

        {/* The HTML5 Canvas */}
        <canvas
          ref={canvasRef}
          onClick={jump}
          onTouchStart={(e) => {
            e.preventDefault();
            jump();
          }}
          className="cursor-pointer block touch-none"
        />

        {/* Overlay Screen: IDLE / START */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white z-30 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center shadow-lg transform hover:scale-105 transition">
              <Gamepad2 className="w-9 h-9" />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-amber-400">
              {GAME_TITLE}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-sm">
              Vượt qua 20 chướng ngại vật để nhận voucher 2 lít xăng miễn phí từ VietinBank.
            </p>

            <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-cyan-300 max-w-xs">
              👉 Chạm màn hình hoặc nhấn phím Space để bay
            </div>

            <button
              onClick={startGame}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm sm:text-base shadow-lg transition active:scale-95 flex items-center gap-2"
            >
              <span>Bắt đầu chơi</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Overlay Screen: GAMEOVER */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white z-30 space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-rose-600/20 border border-rose-500/40 text-rose-400 flex items-center justify-center text-2xl font-black">
              !
            </div>

            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Rất tiếc, bạn đã vượt qua {score}/{WIN_SCORE} thử thách
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Chỉ còn một chút nữa thôi, hãy thử lại nhé!
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={startGame}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md transition active:scale-95 flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Chơi lại</span>
              </button>

              <button
                onClick={onBackToHome}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm border border-slate-700 transition"
              >
                Về màn hình chính
              </button>
            </div>
          </div>
        )}

        {/* Overlay Screen: WINNER */}
        {gameState === 'won' && (
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/95 to-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white z-30 space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center shadow-lg animate-bounce">
              <Trophy className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-400">
                Chúc mừng!
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 max-w-sm">
                Bạn đã vượt qua 20 thử thách và đủ điều kiện nhận {VOUCHER_TEXT}.
              </p>
            </div>

            {/* Voucher Box */}
            <div className="bg-white/10 border-2 border-amber-400/80 rounded-2xl p-4 sm:p-5 w-full max-w-xs space-y-2">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-amber-300">
                Mã quà tặng của bạn
              </span>
              <div className="font-mono text-2xl sm:text-3xl font-black text-amber-400 tracking-wider">
                {voucherCode}
              </div>
              <p className="text-[11px] text-slate-300">
                Vui lòng chụp màn hình hoặc đưa mã này cho nhân viên để nhận quà.
              </p>

              <button
                onClick={copyVoucherCode}
                className="w-full mt-2 py-2 px-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-amber-950 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-800" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Đã sao chép mã!' : 'Sao chép mã'}</span>
              </button>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={startGame}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Chơi lại</span>
              </button>
              <button
                onClick={onBackToHome}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs sm:text-sm border border-slate-700 transition"
              >
                Về menu chính
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Persistent "Mã gần nhất" Display (Per PDF 4/LocalStorage anti-cheat specs) */}
      {lastVoucher && (
        <div className="max-w-[580px] mx-auto bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-amber-700 font-bold uppercase">
                Mã voucher gần nhất của bạn
              </div>
              <div className="font-mono font-bold text-slate-900 text-sm sm:text-base">
                {lastVoucher.code} ({VOUCHER_TEXT})
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              navigator.clipboard.writeText(lastVoucher.code);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="px-3 py-1.5 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-900 text-xs font-semibold flex items-center gap-1 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
          </button>
        </div>
      )}

      {/* Bottom Kiosk Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <button
          onClick={onBackToHome}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-sm transition"
        >
          Quay lại menu chính
        </button>
        <button
          onClick={onOpenEndDialog}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-sm transition flex items-center justify-center gap-1.5"
        >
          <MessageSquareX className="w-4 h-4 text-rose-600" />
          Kết thúc cuộc trò chuyện
        </button>
      </div>
    </div>
  );
};
