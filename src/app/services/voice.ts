import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

@Injectable({
    providedIn: 'root'
})
export class VoiceService {
    private recognition: any;
    private isListeningSubject = new BehaviorSubject<boolean>(false);
    private transcriptSubject = new BehaviorSubject<string>('');
    private availableVoicesSubject = new BehaviorSubject<string[]>([]);
    private selectedVoiceNameSubject = new BehaviorSubject<string>('');
    private preferredVoiceName: string | null = null;
    private readonly forcedVoiceName = 'Google UK English Female';
    private readonly femaleVoiceHints = [
        'aria',
        'jenny',
        'samantha',
        'zira',
        'susan',
        'emma',
        'ava',
        'female',
        'woman',
    ];
    private readonly preferredFemaleVoiceNames = [
        'Google UK English Female',
        'Microsoft Zira - English (United States)',
        'Microsoft Aria Online (Natural) - English (United States)',
        'Microsoft Jenny Online (Natural) - English (United States)',
        'Microsoft Zira Desktop - English (United States)',
        'Samantha',
    ];
    private readonly maleVoiceHints = [
        'david',
        'guy',
        'male',
        'man',
        'mark',
        'john',
    ];

    isListening$: Observable<boolean> = this.isListeningSubject.asObservable();
    transcript$: Observable<string> = this.transcriptSubject.asObservable();
    availableVoices$: Observable<string[]> = this.availableVoicesSubject.asObservable();
    selectedVoiceName$: Observable<string> = this.selectedVoiceNameSubject.asObservable();

    constructor(private zone: NgZone) {
        this.initSpeechRecognition();
        this.initVoices();
    }

    private initVoices() {
        if (!('speechSynthesis' in window)) {
            return;
        }

        // Trigger voice list initialization in some browsers.
        window.speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = () => {
            this.preferredVoiceName = this.selectPreferredVoiceName();
            this.syncVoiceState();
        };

        this.preferredVoiceName = this.selectPreferredVoiceName();
        this.syncVoiceState();
    }

    private initSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            console.warn('Web Speech API is not supported in this browser.');
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false; // Stop listening after one phrase
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US'; // Change language code if needed (e.g., 'ur-PK')

        this.recognition.onstart = () => {
            this.zone.run(() => this.isListeningSubject.next(true));
        };

        this.recognition.onresult = (event: any) => {
            const text = event.results[0][0].transcript;
            this.zone.run(() => this.transcriptSubject.next(text));
        };

        this.recognition.onerror = (error: any) => {
            console.error('Speech recognition error:', error);
            this.zone.run(() => this.isListeningSubject.next(false));
        };

        this.recognition.onend = () => {
            this.zone.run(() => this.isListeningSubject.next(false));
        };
    }

    // --- Speech-to-Text Controls ---
    startListening() {
        if (this.recognition && !this.isListeningSubject.value) {
            this.recognition.start();
        }
    }

    stopListening() {
        if (this.recognition && this.isListeningSubject.value) {
            this.recognition.stop();
        }
    }

    // --- Text-to-Speech Control ---
    speak(text: string) {
        if (!('speechSynthesis' in window)) {
            console.warn('Text-to-speech is not supported in this browser.');
            return;
        }

        // Cancel any current speech output
        window.speechSynthesis.cancel();

        // Remove markdown symbols (like **, *, #) so the voice doesn't read them out loud
        const cleanText = text.replace(/[*#_`]/g, '');

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 0.95;
        utterance.pitch = 1.15;
        utterance.volume = 1.0;
        utterance.lang = 'en-US';

        const preferredVoice = this.getPreferredVoice();
        if (preferredVoice) {
            utterance.voice = preferredVoice;
            utterance.lang = preferredVoice.lang || utterance.lang;
        }

        window.speechSynthesis.speak(utterance);
    }

    logAvailableVoices() {
        if (!('speechSynthesis' in window)) {
            return;
        }

        const voices = window.speechSynthesis.getVoices();
        const summary = voices.map(v => ({
            name: v.name,
            lang: v.lang,
            default: v.default,
        }));

        console.table(summary);
    }

    setPreferredVoiceByName(voiceName: string) {
        if (!('speechSynthesis' in window)) {
            return;
        }

        const voices = window.speechSynthesis.getVoices();
        const selected = voices.find(v => v.name === voiceName);
        if (!selected) {
            return;
        }

        this.preferredVoiceName = selected.name;
        this.selectedVoiceNameSubject.next(selected.name);
    }

    private getPreferredVoice(): SpeechSynthesisVoice | null {
        if (!('speechSynthesis' in window)) {
            return null;
        }

        const voices = window.speechSynthesis.getVoices();
        if (!voices.length) {
            return null;
        }

        if (!this.preferredVoiceName) {
            this.preferredVoiceName = this.selectPreferredVoiceName();
        }

        if (this.preferredVoiceName) {
            const cachedVoice = voices.find(v => v.name === this.preferredVoiceName);
            if (cachedVoice) {
                return cachedVoice;
            }
        }

        const preferredName = this.selectPreferredVoiceName();
        const preferred = preferredName
            ? voices.find(v => v.name === preferredName) ?? null
            : null;

        this.preferredVoiceName = preferred?.name ?? null;
        return preferred;
    }

    private selectPreferredVoiceName(): string | null {
        if (!('speechSynthesis' in window)) {
            return null;
        }

        const voices = window.speechSynthesis.getVoices();
        if (!voices.length) {
            return null;
        }

        const forcedVoice = voices.find(v => v.name === this.forcedVoiceName);
        if (forcedVoice) {
            return forcedVoice.name;
        }

        const exactPriorityVoice = this.preferredFemaleVoiceNames
            .map(name => voices.find(v => v.name === name))
            .find((voice): voice is SpeechSynthesisVoice => Boolean(voice));
        if (exactPriorityVoice) {
            return exactPriorityVoice.name;
        }

        const femaleVoice = voices.find(v => this.matchesHints(v.name, this.femaleVoiceHints));
        if (femaleVoice) {
            return femaleVoice.name;
        }

        const nonMaleEnglishVoice = voices.find(v => {
            const lang = v.lang.toLowerCase();
            const isEnglish = lang.startsWith('en-us') || lang.startsWith('en');
            const looksMale = this.matchesHints(v.name, this.maleVoiceHints);
            return isEnglish && !looksMale;
        });

        if (nonMaleEnglishVoice) {
            return nonMaleEnglishVoice.name;
        }

        const englishVoice = voices.find(v => v.lang.toLowerCase().startsWith('en'));
        return englishVoice?.name ?? voices[0]?.name ?? null;
    }

    private matchesHints(value: string, hints: string[]): boolean {
        const lower = value.toLowerCase();
        return hints.some(hint => lower.includes(hint));
    }

    private syncVoiceState() {
        if (!('speechSynthesis' in window)) {
            return;
        }

        const voices = window.speechSynthesis.getVoices();
        const voiceNames = voices.map(v => v.name);
        this.availableVoicesSubject.next(voiceNames);

        const selectedName = this.preferredVoiceName ?? this.selectPreferredVoiceName() ?? '';
        this.selectedVoiceNameSubject.next(selectedName);
    }

    stopSpeaking() {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    }
}