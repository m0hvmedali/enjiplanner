
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Zap, Volume2, VolumeX, Brain } from 'lucide-react';

const FOCUS_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

const FocusMode: React.FC = () => {
    const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<'focus' | 'break'>('focus');
    const [isMuted, setIsMuted] = useState(true);
    const audioContextRef = useRef<AudioContext | null>(null);
    const noiseNodeRef = useRef<AudioWorkletNode | ScriptProcessorNode | null>(null);

    useEffect(() => {
        let interval: any = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            const nextMode = mode === 'focus' ? 'break' : 'focus';
            const nextTime = nextMode === 'focus' ? FOCUS_TIME : BREAK_TIME;
            setMode(nextMode);
            setTimeLeft(nextTime);
            setIsActive(false);

            // Notification
            if (Notification.permission === 'granted') {
                new Notification(nextMode === 'focus' ? 'حان وقت التركيز!' : 'وقت الاستراحة!');
            }
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, mode]);

    const toggleTimer = () => setIsActive(!isActive);
    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(mode === 'focus' ? FOCUS_TIME : BREAK_TIME);
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleNoiseToggle = () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        if (isMuted) {
            // Start Brown Noise (Deep focus)
            const bufferSize = 4096;
            let lastOut = 0.0;
            const node = audioContextRef.current.createScriptProcessor(bufferSize, 1, 1);
            node.onaudioprocess = (e) => {
                const output = e.outputBuffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    const white = Math.random() * 2 - 1;
                    output[i] = (lastOut + (0.02 * white)) / 1.02;
                    lastOut = output[i];
                    output[i] *= 3.5; // volume
                }
            };
            node.connect(audioContextRef.current.destination);
            noiseNodeRef.current = node;
        } else {
            if (noiseNodeRef.current) {
                noiseNodeRef.current.disconnect();
            }
        }
        setIsMuted(!isMuted);
    };

    const progress = (timeLeft / (mode === 'focus' ? FOCUS_TIME : BREAK_TIME)) * 100;

    return (
        <div className="max-w-xl mx-auto py-12 animate-fade-in text-center">
            <div className="mb-12">
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400 mb-2">
                    وضع التركيز العميق
                </h2>
                <p className="text-slate-500">تقنية بومودورو مع ضوضاء بنية لتحفيز الموجات الدماغية</p>
            </div>

            <div className={`glass-panel p-12 rounded-[50px] border-2 transition-all duration-700 relative overflow-hidden ${mode === 'focus' ? 'border-cine-accent/30 shadow-[0_0_50px_rgba(56,189,248,0.1)]' : 'border-emerald-500/20'
                }`}>

                {/* Background Pulse */}
                {isActive && (
                    <div className={`absolute inset-0 opacity-10 animate-pulse ${mode === 'focus' ? 'bg-cine-accent' : 'bg-emerald-500'}`}></div>
                )}

                <div className="relative z-10">
                    <div className="flex justify-center gap-4 mb-10">
                        <button
                            onClick={() => { setMode('focus'); setTimeLeft(FOCUS_TIME); setIsActive(false); }}
                            className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${mode === 'focus' ? 'bg-cine-accent text-black' : 'text-slate-500 hover:text-white'}`}
                        >
                            تركيز (٢٥ د)
                        </button>
                        <button
                            onClick={() => { setMode('break'); setTimeLeft(BREAK_TIME); setIsActive(false); }}
                            className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${mode === 'break' ? 'bg-emerald-500 text-black' : 'text-slate-500 hover:text-white'}`}
                        >
                            استراحة (٥ د)
                        </button>
                    </div>

                    <div className="relative inline-block mb-12">
                        <svg className="w-64 h-64 -rotate-90">
                            <circle cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                            <circle
                                cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="8" fill="transparent"
                                strokeDasharray={753.6}
                                strokeDashoffset={753.6 - (753.6 * progress) / 100}
                                strokeLinecap="round"
                                className={`transition-all duration-1000 ${mode === 'focus' ? 'text-cine-accent' : 'text-emerald-500'}`}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-6xl font-light text-white tracking-tighter tabular-nums">{formatTime(timeLeft)}</span>
                            <span className="text-xs uppercase tracking-[0.3em] text-slate-500 mt-2">{mode === 'focus' ? 'Session' : 'Rest'}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-6">
                        <button onClick={resetTimer} className="p-4 rounded-2xl bg-white/5 text-slate-400 hover:bg-white/10 transition-all">
                            <RotateCcw className="w-6 h-6" />
                        </button>

                        <button
                            onClick={toggleTimer}
                            className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all transform active:scale-90 shadow-2xl ${mode === 'focus'
                                    ? 'bg-cine-accent text-black shadow-cine-accent/20'
                                    : 'bg-emerald-500 text-black shadow-emerald-500/20'
                                }`}
                        >
                            {isActive ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current ml-1" />}
                        </button>

                        <button
                            onClick={handleNoiseToggle}
                            className={`p-4 rounded-2xl transition-all ${!isMuted ? 'bg-cine-accent/20 text-cine-accent animate-pulse' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                            title="Brown Noise for focus"
                        >
                            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-4">
                <div className="glass-panel p-4 rounded-2xl text-center">
                    <Brain className="w-5 h-5 text-cine-accent mx-auto mb-2" />
                    <div className="text-[10px] text-slate-500 uppercase">Alpha Waves</div>
                </div>
                <div className="glass-panel p-4 rounded-2xl text-center">
                    <Zap className="w-5 h-5 text-amber-500 mx-auto mb-2" />
                    <div className="text-[10px] text-slate-500 uppercase">No Distraction</div>
                </div>
                <div className="glass-panel p-4 rounded-2xl text-center">
                    <Coffee className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
                    <div className="text-[10px] text-slate-500 uppercase">Deep Rest</div>
                </div>
            </div>
        </div>
    );
};

export default FocusMode;
