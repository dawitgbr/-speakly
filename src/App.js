import React, { useState, useEffect, useCallback, useRef } from "react";

const AudioEngine = {
  ctx: null,
  getCtx() {
    if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    return this.ctx;
  },
  beep(freq = 440, duration = 0.15, type = "sine", vol = 0.3, delay = 0) {
    try {
      const ctx = this.getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = type; osc.frequency.value = freq;
      const start = ctx.currentTime + delay;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(vol, start + 0.01);
      gain.gain.linearRampToValueAtTime(0, start + duration);
      osc.start(start); osc.stop(start + duration + 0.05);
    } catch (e) {}
  },
  click() { this.beep(800, 0.06, "sine", 0.15); },
  step()  { this.beep(523, 0.1,  "sine", 0.2);  },
  celebrate() {
    [523,659,784,1047].forEach((n,i) => this.beep(n, 0.18, "sine", 0.25, i*0.12));
    setTimeout(() => [784,988,1175,1568].forEach((n,i) => this.beep(n,0.15,"sine",0.2,i*0.1)), 600);
  },
  complete() {
    [523,587,659,698,784,880,988,1047].forEach((n,i) => this.beep(n,0.2,"sine",0.28,i*0.09));
  },
};

const Speech = {
  supported: typeof window !== "undefined" && "speechSynthesis" in window,
  voices: [],
  init() {
    if (!this.supported) return;
    const load = () => { this.voices = window.speechSynthesis.getVoices(); };
    load();
    window.speechSynthesis.onvoiceschanged = load;
  },
  getBestVoice(lang = "en") {
    const preferred = ["Samantha","Karen","Daniel","Google US English","Google UK English Female","Microsoft Zira","Alex"];
    for (const name of preferred) {
      const v = this.voices.find(v => v.name.includes(name));
      if (v) return v;
    }
    return this.voices.find(v => v.lang.startsWith(lang)) || null;
  },
  speak(text, rate = 0.88, pitch = 1.05, onEnd) {
    if (!this.supported) { onEnd && onEnd(); return; }
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = rate; utt.pitch = pitch; utt.volume = 1;
    const voice = this.getBestVoice();
    if (voice) utt.voice = voice;
    if (onEnd) utt.onend = onEnd;
    window.speechSynthesis.speak(utt);
  },
  stop() { if (this.supported) window.speechSynthesis.cancel(); },
};
Speech.init();

const AGE_GROUPS = [
  { id:"early",     label:"0–3 yrs",  color:"#7C3AED", light:"#EDE9FE", description:"Early Intervention", mascot:"🐣", speechRate:0.75, speechPitch:1.1  },
  { id:"preschool", label:"4–7 yrs",  color:"#059669", light:"#D1FAE5", description:"Pre-school",         mascot:"🦊", speechRate:0.80, speechPitch:1.08 },
  { id:"school",    label:"8–12 yrs", color:"#D97706", light:"#FDE68A", description:"School Age",         mascot:"🦉", speechRate:0.88, speechPitch:1.0  },
  { id:"teen",      label:"13+ yrs",  color:"#DC2626", light:"#FECACA", description:"Adolescent & Adult", mascot:"🦅", speechRate:0.92, speechPitch:0.97 },
];

const THERAPY_TYPES = [
  { id:"articulation", label:"Sounds",  icon:"🔤", desc:"Correct sound production" },
  { id:"fluency",      label:"Fluency", icon:"🌊", desc:"Smooth, flowing speech"   },
  { id:"vocabulary",   label:"Words",   icon:"💬", desc:"Building vocabulary"       },
  { id:"narrative",    label:"Stories", icon:"📖", desc:"Telling stories clearly"   },
];

const EXERCISES = {
  early: {
    articulation: [
      { title:"Mama & Dada Sounds", targetSound:"m, d sounds", instruction:"Sit face-to-face with your baby and practise these special sounds together!", steps:["Make eye contact with your baby and smile warmly","Say ma-ma-ma slowly — watch their eyes light up!","Pause for 5 seconds and wait for baby to respond","Celebrate any sound they make with big smiles and clapping"], practiceWords:["mama","dada","more","me","mud"], hint:"Do this during diaper changes when baby is calm and focused on you", praise:"You are doing an amazing job!" },
      { title:"Animal Sound Party", targetSound:"oo, ee, ah vowels", instruction:"Use animal toys to model fun sounds and encourage your baby to join in!", steps:["Hold up a cow toy and moo loudly — moooooo!","Hold a cat and say meee-ow with a big smile","Make a duck say quack quack quack!","Wait after each one — repeat any sound baby makes back to them"], practiceWords:["moo","meow","quack","woof","baa"], hint:"Use real objects or clear photos — babies respond better than cartoons", praise:"What a superstar little communicator!" },
    ],
    fluency: [
      { title:"Slow Motion Talking", targetSound:"Slow, clear speech rhythm", instruction:"Model slow, calm, rhythmic speech for your baby during play", steps:["Pick up a ball and say very slowly — baaall","Roll it and say roooll the baaall","Pause between each word naturally","Wait and watch — respond to any vocalisation baby makes"], practiceWords:["ball","cup","spoon","book","shoe"], hint:"Your slow speech teaches baby the rhythm of language — no rushing!", praise:"Beautiful slow and clear modelling!" },
    ],
    vocabulary: [
      { title:"Name That Thing", targetSound:"First nouns and labels", instruction:"Build baby's first vocabulary by naming everything around them clearly!", steps:["Hold up a cup and say clearly — cup, that's a CUP","Let baby touch it while you say the word again","Put it down and hold up a spoon — spoon!","Go around the room naming 5 everyday objects"], practiceWords:["cup","spoon","book","door","shoe"], hint:"Use the same words consistently — routine vocabulary builds fastest", praise:"Every word you say is a gift to your baby's brain!" },
      { title:"Body Parts Boogie", targetSound:"Body part vocabulary", instruction:"Touch and name body parts in a fun, musical routine!", steps:["Touch baby's nose and say NOSE with a smile","Touch their tummy — tummy tummy tummy!","Clap their hands together — HANDS!","Wiggle their toes — one two three four five TOES!"], practiceWords:["nose","tummy","hands","feet","eyes"], hint:"Repeat this during bath time or getting dressed for natural learning", praise:"Your baby is learning so much from you!" },
    ],
    narrative: [
      { title:"Picture Book Talk", targetSound:"Early narrative and language", instruction:"Use a simple picture book to build early story understanding", steps:["Open a simple board book together","Point to pictures and name them — dog, look, a DOG!","Make the animal or object sound — woof woof!","Turn pages slowly and wait for baby to point or vocalise"], practiceWords:["dog","cat","bird","fish","bear"], hint:"Choose books with one clear image per page and bright colours", praise:"Reading together is the best gift for speech!" },
    ],
  },
  preschool: {
    articulation: [
      { title:"Snake Sound Safari", targetSound:"/s/ sound", instruction:"Pretend to be snakes slithering through the jungle making the sneaky S sound!", steps:["Put your teeth gently together","Blow air out slowly — sssssssss like a snake!","Now say each word below out loud","Make up a silly sentence using your favourite S word!"], practiceWords:["sun","snake","sock","soup","sand","sea","star","smile"], hint:"Teeth together, tongue behind them, air blows out — sssss!", praise:"AMAZING! You are a super snake speaker!" },
      { title:"Rocket Ship R Launch", targetSound:"/r/ sound", instruction:"Blast off into space practising the tricky but awesome R sound!", steps:["Curl your tongue tip back slightly — do not touch the roof","Make your voice rumble like a rocket — rrrrrr!","Say each word below nice and slowly","Say your favourite R word three times fast!"], practiceWords:["red","run","rain","race","rainbow","rabbit","rocket","river"], hint:"Your tongue curls back — it should feel a little like saying er", praise:"3-2-1 BLASTOFF! Amazing R sounds!" },
      { title:"Lion's Loud L", targetSound:"/l/ sound", instruction:"Roar like a lion and practise the lovely L sound together!", steps:["Put the tip of your tongue behind your top teeth","Let your voice out — llllll like a purring lion","Say each word below and feel your tongue position","Roar a sentence using two L words together!"], practiceWords:["leg","lip","lamp","lemon","lollipop","lion","lake","leaf"], hint:"Tongue tip touches just behind your top front teeth — feel it there?", praise:"ROAR! What a brilliant L sound!" },
      { title:"Bunny Hop B Game", targetSound:"/b/ sound", instruction:"Hop like a bunny every time you say a B word — ready? HOP!", steps:["Press lips together tightly — hold them...","Pop them open with your voice — BUH!","Say each word below and hop as you say it","Hop along singing: bouncy bouncy bunny BOO!"], practiceWords:["ball","bear","boat","bird","butterfly","bus","bed","baby"], hint:"Lips pressed together first, then pop open with a voice — BUH!", praise:"Hop hop hooray — incredible B sounds!" },
    ],
    fluency: [
      { title:"Turtle Talking", targetSound:"Slow smooth speech", instruction:"Turtles are the BEST slow talkers — let us talk like turtles today!", steps:["Move your hands in slow motion like a slow turtle","Say each word below as slowly as a turtle walks","Keep your voice smooth and calm like a gentle stream","Tell me one slow turtle sentence about your favourite animal"], practiceWords:["slowly","gently","smoothly","softly","calmly"], hint:"Slow is smooth and smooth is powerful — turtles WIN!", praise:"Beautiful slow turtle talking — you are amazing!" },
    ],
    vocabulary: [
      { title:"Feelings Word Party", targetSound:"Emotion vocabulary", instruction:"Let us learn the best feelings words and make funny faces for each one!", steps:["Make a HAPPY face and say the word out loud","Make a SAD face and say that word","Make an ANGRY face — say it with feeling!","Make a SURPRISED face — say it with big eyes!"], practiceWords:["happy","sad","angry","surprised","excited","scared","proud","silly"], hint:"The funnier your face the better you will remember the word!", praise:"What an amazing feelings word superstar!" },
      { title:"Opposites Game", targetSound:"Antonym vocabulary", instruction:"I say one word — you shout the OPPOSITE as fast as you can!", steps:["Say the opposite of each word below out loud","Shout it as fast and loud as you can!","Then use both words in one sentence","Make up your own pair of opposite words!"], practiceWords:["hot","big","fast","up","happy","loud","dark","soft"], hint:"Think of things that are totally different from each other", praise:"Opposite word champion right here!" },
    ],
    narrative: [
      { title:"Story Sandwich", targetSound:"Story structure: beginning, middle, end", instruction:"Every great story is like a sandwich — it has three layers!", steps:["BEGINNING — say: Once there was a...","MIDDLE — say: One day something happened...","END — say: And in the end...","Now tell YOUR story about a dragon who lost their fire!"], practiceWords:["once","then","next","finally","because","suddenly","after","before"], hint:"Beginning equals who and where. Middle equals the problem. End equals what happened!", praise:"That story sandwich was DELICIOUS!" },
    ],
  },
  school: {
    articulation: [
      { title:"Fluency Reading Challenge", targetSound:"Articulation in connected speech", instruction:"Read each practice word slowly and clearly, hitting every sound perfectly", steps:["Look at each word carefully before saying it","Say it slowly first — then at normal speed","Listen to the word, then say it back accurately","Record yourself — listen back and score your clarity out of 10!"], practiceWords:["butterfly","brilliant","rhythm","strength","through","clothes","splash","scratch"], hint:"Slow down for tricky sounds — accuracy beats speed every time", praise:"Excellent articulation precision — you nailed it!" },
      { title:"Minimal Pair Master", targetSound:"Sound discrimination and production", instruction:"These word pairs sound almost the same — hear and say each one clearly", steps:["Say the first word slowly and carefully","Now say the second word — feel the difference?","Say them alternately: word one, word two, word one","Make up a sentence using both words!"], practiceWords:["ship","chip","van","ban","thin","sin","three","free","vine","wine"], hint:"Focus on where your tongue and lips are for each sound", praise:"Sound discrimination superstar! Your ear is incredible!" },
    ],
    fluency: [
      { title:"Easy Onset Practice", targetSound:"Fluency — easy onset technique", instruction:"Start every word as gently as a feather landing — no rushing or tension!", steps:["Take a calm breath before you begin","Start your first sound very gently — almost a whisper","Build your voice gradually like a dimmer switch","Say each word below using easy onset — feather light start"], practiceWords:["every","I","open","always","under","over","only","able"], hint:"Imagine your voice is a feather — light, gentle, never forced", praise:"Beautifully smooth easy onset — that was brilliant!" },
      { title:"Phrasing and Pausing", targetSound:"Fluency — natural phrasing", instruction:"Great speakers use pauses like punctuation — let us practise!", steps:["Say each phrase below with a clear pause between words","Breathe naturally at each pause point","Keep your voice relaxed and unhurried throughout","Notice how pausing makes you sound MORE confident"], practiceWords:["today I want","to tell you","something really","important to me","please listen carefully"], hint:"Pauses are not weakness — they are the sign of a confident speaker", praise:"Your phrasing and pausing was incredibly powerful!" },
    ],
    vocabulary: [
      { title:"Semantic Feature Analysis", targetSound:"Vocabulary depth and word knowledge", instruction:"Analyse each word like a scientist — what do you know about it?", steps:["Read each word below carefully","Say what category it belongs to","Name two properties or features of it","Use it in a sentence you create yourself"], practiceWords:["ocean","volcano","eclipse","migration","democracy","atmosphere","erosion","hibernate"], hint:"The more features you know about a word the better you own it", praise:"Vocabulary scientist — that was impressive thinking!" },
      { title:"Word Web Challenge", targetSound:"Synonyms, antonyms, and word families", instruction:"For each word say a synonym, an antonym, and use it in a sentence!", steps:["Say the word aloud clearly","Say a synonym — a word that means the same","Say an antonym — a word that means the opposite","Use the original word in a powerful sentence"], practiceWords:["brave","enormous","miserable","ancient","swift","peculiar","generous","fragile"], hint:"A rich vocabulary means you always have the perfect word ready", praise:"What a rich and impressive word web!" },
    ],
    narrative: [
      { title:"Story Grammar Detective", targetSound:"Narrative structure — all elements", instruction:"Use these story starter words to build a complete five-part story!", steps:["CHARACTER: Use one of these words to describe your character","SETTING: Use a setting word to paint the picture","PROBLEM: Introduce a problem using a conflict word","SOLUTION and ENDING: Resolve it using a resolution word"], practiceWords:["mysterious","ancient","suddenly","meanwhile","however","therefore","eventually","fortunately"], hint:"Use this framework for school essays too — it works every time!", praise:"Story grammar detective work — absolutely brilliant!" },
      { title:"Persuasive Speech Builder", targetSound:"Expository and persuasive language", instruction:"Use these powerful linking words to build a convincing argument!", steps:["STATE your opinion using: I believe, In my opinion, I strongly think","Give REASON 1 using: First of all, To begin with, One important reason","Give REASON 2 using: Furthermore, Additionally, Another key point","CONCLUDE using: Therefore, In conclusion, For these reasons"], practiceWords:["furthermore","additionally","therefore","consequently","nevertheless","however","significantly","evidently"], hint:"The strongest arguments use facts AND feelings together", praise:"Persuasive power unlocked — you convinced me!" },
    ],
  },
  teen: {
    articulation: [
      { title:"Accent Clarity Workout", targetSound:"Precise consonant articulation", instruction:"Pronounce each word with maximum precision — every sound counts!", steps:["Say each word below at slow speed first","Now say it at normal conversational speed","Finally say it at slightly faster speed","Record yourself and identify your weakest consonants"], practiceWords:["particularly","specifically","comfortable","literature","February","vegetable","temperature","regularly"], hint:"Clarity is not about accent elimination — it is about precision and intention", praise:"Razor sharp articulation — that was impressive!" },
      { title:"Connected Speech Mastery", targetSound:"Linking and connected speech", instruction:"Say each phrase smoothly linking words naturally — no choppy breaks!", steps:["Say the phrase below as one smooth connected unit","Notice where words naturally link together","Say it again at natural conversational speed","Compare: does it sound natural and fluent?"], practiceWords:["going to","want to","kind of","lot of","out of","used to","supposed to","ought to"], hint:"Native speakers link words constantly — it is not lazy it is natural", praise:"Your connected speech sounds natural and confident!" },
    ],
    fluency: [
      { title:"Camperdown Easy Onset", targetSound:"Fluency — Camperdown Programme", instruction:"Begin each word with zero tension — the lightest possible voice initiation", steps:["Take a relaxed breath — do not force it, just let it happen","Place your articulators ready but with no tension","Start your first sound as gently as possible — barely a whisper growing into voice","Say each word below using this technique"], practiceWords:["I","actually","every","only","often","usually","already","obviously"], hint:"Zero tension at initiation is the goal — lighter than you think is possible", praise:"Evidence-based technique mastered — clinical level work!" },
      { title:"Voluntary Stuttering Practice", targetSound:"Stuttering desensitisation", instruction:"Intentionally stutter on each word — this reduces fear and builds control", steps:["Choose a word below and intentionally repeat its first sound","Say it calmly and deliberately — you are in control","Notice how voluntary stuttering feels different from involuntary","Practise in a low-pressure context: reading aloud to yourself"], practiceWords:["my","name","is","today","because","sometimes","people","communication"], hint:"Voluntary stuttering reduces anxiety and increases control — it is clinical best practice", praise:"That took real courage — you should be incredibly proud!" },
    ],
    vocabulary: [
      { title:"Academic Language Builder", targetSound:"Formal and academic register", instruction:"Upgrade each everyday word to its academic equivalent and use it in a sentence", steps:["Say the word below — this is the everyday version","Say its academic synonym aloud","Note the difference in register and formality","Use the academic word in a sentence you construct yourself"], practiceWords:["demonstrate","facilitate","consequently","approximately","significant","perspective","evaluate","implement"], hint:"Academic vocabulary opens doors — in university, interviews, and professional life", praise:"Academic vocabulary level: expert! Outstanding work!" },
      { title:"Connotation Explorer", targetSound:"Nuanced word meaning and register", instruction:"Say each word and identify whether it feels positive, negative, or neutral", steps:["Say the word clearly and naturally","Decide: positive, negative, or neutral connotation?","Think of a context where this word would be powerful","Use it in a sentence where the connotation really matters"], practiceWords:["slender","frugal","persistent","peculiar","assertive","blunt","ambitious","cautious"], hint:"Word choice reveals attitude — choose with precision and intention", praise:"Nuanced language understanding — that is sophisticated thinking!" },
    ],
    narrative: [
      { title:"STAR Method Personal Narrative", targetSound:"Narrative for interviews", instruction:"Use each transition word to build your STAR method narrative", steps:["SITUATION: Set the scene using a context word","TASK: Describe your role using a responsibility word","ACTION: Explain what you did using an action word","RESULT: Describe the outcome using an impact word"], practiceWords:["initially","consequently","specifically","successfully","significantly","ultimately","effectively","strategically"], hint:"This STAR method works for job interviews, university applications, and presentations", praise:"Professional-level narrative structure — interview ready!" },
      { title:"Podcast Style Monologue", targetSound:"Extended discourse and organisation", instruction:"Use these discourse markers to organise a 2-minute spoken monologue", steps:["INTRO: Hook with: Did you know, Have you ever, Imagine if","POINT 1: Start with: First and foremost, To begin with","POINT 2: Transition with: Building on this, Furthermore","OUTRO: Close with: In summary, To bring this together, Ultimately"], practiceWords:["furthermore","nevertheless","in contrast","as a result","for instance","in particular","above all","to summarise"], hint:"Great podcasters sound conversational but are actually very organised", praise:"You could host your own podcast — genuinely impressive!" },
    ],
  },
};

function getExercise(ageId, typeId, index) {
  const pool = EXERCISES[ageId]?.[typeId] || [];
  return pool[index % pool.length];
}

function WordPractice({ words, ag, muted }) {
  const [activeWord, setActiveWord] = useState(null);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef(null);

  const speakWord = useCallback((word, rate = 0.85) => {
    if (muted) return;
    setIsPlaying(true);
    setHighlightIndex(-1);
    Speech.speak(word, rate, 1.1, () => {
      setIsPlaying(false);
      const letters = word.split("");
      letters.forEach((_, i) => {
        timerRef.current = setTimeout(() => {
          setHighlightIndex(i);
          if (i === letters.length - 1) setTimeout(() => setHighlightIndex(-1), 400);
        }, i * 120);
      });
    });
  }, [muted]);

  useEffect(() => { return () => { if (timerRef.current) clearTimeout(timerRef.current); }; }, []);

  const handleWordTap = (word) => { AudioEngine.click(); setActiveWord(word); speakWord(word, 0.85); };
  const handleSlow = () => { if (!activeWord) return; AudioEngine.click(); speakWord(activeWord, 0.5); };
  const handleNormal = () => { if (!activeWord) return; AudioEngine.click(); speakWord(activeWord, 0.85); };

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>🔤 Tap a word to hear it</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
        {words.map((word, i) => (
          <button key={i} onClick={() => handleWordTap(word)} style={{ background: activeWord === word ? ag.color : "#fff", color: activeWord === word ? "#fff" : "#1F2937", border: `2px solid ${activeWord === word ? ag.color : ag.color + "40"}`, borderRadius: 14, padding: "10px 18px", fontSize: 17, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", transition: "all 0.18s", boxShadow: activeWord === word ? `0 4px 14px ${ag.color}50` : "none", transform: activeWord === word ? "scale(1.05)" : "scale(1)" }}>
            {word}
          </button>
        ))}
      </div>
      {activeWord && (
        <div style={{ background: ag.light, borderRadius: 20, padding: "24px", textAlign: "center", marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 2, marginBottom: 16 }}>
            {activeWord.split("").map((letter, i) => (
              <span key={i} style={{ fontSize: 42, fontWeight: 900, lineHeight: 1, color: highlightIndex === i ? ag.color : "#1F2937", background: highlightIndex === i ? ag.color + "20" : "transparent", borderRadius: 8, padding: "0 3px", transition: "all 0.15s", display: "inline-block", transform: highlightIndex === i ? "scale(1.3)" : "scale(1)" }}>
                {letter}
              </span>
            ))}
          </div>
          <div style={{ fontSize: 13, color: ag.color, fontWeight: 700, marginBottom: 16, letterSpacing: "0.05em" }}>{activeWord.toUpperCase()}</div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button onClick={handleNormal} style={{ background: ag.color, color: "#fff", border: "none", borderRadius: 12, padding: "10px 20px", fontSize: 14, fontWeight: 800, cursor: "pointer", opacity: isPlaying ? 0.7 : 1 }}>
              {isPlaying ? "🔊 Playing..." : "🔊 Hear it"}
            </button>
            <button onClick={handleSlow} style={{ background: "#fff", color: ag.color, border: `2px solid ${ag.color}`, borderRadius: 12, padding: "10px 20px", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>🐢 Slow</button>
          </div>
          <div style={{ marginTop: 14, fontSize: 13, color: "#6B7280", fontWeight: 600 }}>Now say it yourself — listen, then speak!</div>
        </div>
      )}
    </div>
  );
}

function ExerciseCard({ exercise, ageGroup, onNext }) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [muted, setMuted] = useState(false);
  const ag = AGE_GROUPS.find(a => a.id === ageGroup);
  const steps = exercise.steps || [];
  const isLast = step >= steps.length - 1;

  const speak = useCallback((text, rate, onEnd) => {
    if (!muted) Speech.speak(text, rate || ag.speechRate, ag.speechPitch, onEnd);
    else onEnd && onEnd();
  }, [muted, ag]);

  useEffect(() => { speak(exercise.instruction); return () => Speech.stop(); }, [exercise]);
  useEffect(() => { if (!done) speak(steps[step]); }, [step, done]);
  useEffect(() => { if (done) { AudioEngine.complete(); setTimeout(() => speak(exercise.praise), 900); } }, [done]);

  const handleNext = () => { AudioEngine.step(); isLast ? setDone(true) : setStep(s => s + 1); };

  if (done) return (
    <div style={{ textAlign: "center", padding: "32px 20px" }}>
      <div style={{ fontSize: 72, marginBottom: 12 }}>🎉</div>
      <div style={{ fontSize: 24, fontWeight: 900, color: ag.color, marginBottom: 10 }}>{exercise.praise}</div>
      <div style={{ fontSize: 14, color: "#6B7280", marginBottom: 24, lineHeight: 1.6 }}>{exercise.hint}</div>
      <button onClick={() => { if (!muted) Speech.speak(exercise.praise, ag.speechRate, ag.speechPitch); }} style={{ background: ag.light, border: "none", borderRadius: 12, padding: "10px 20px", fontSize: 13, fontWeight: 700, color: ag.color, cursor: "pointer", marginBottom: 12 }}>🔊 Hear praise again</button>
      <button onClick={() => { AudioEngine.celebrate(); onNext(); }} style={{ background: ag.color, color: "#fff", border: "none", borderRadius: 16, padding: "16px", fontSize: 16, fontWeight: 800, cursor: "pointer", width: "100%", boxShadow: `0 4px 20px ${ag.color}50` }}>Next Exercise →</button>
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 }}>
        <button onClick={() => { setMuted(m => !m); Speech.stop(); }} style={{ background: muted ? "#FEE2E2" : "#F0FDF4", border: "none", borderRadius: 10, padding: "6px 14px", fontSize: 12, fontWeight: 700, color: muted ? "#DC2626" : "#059669", cursor: "pointer" }}>
          {muted ? "🔇 Sound off" : "🔊 Sound on"}
        </button>
      </div>
      <div style={{ background: ag.light, borderRadius: 20, padding: "20px 24px", marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: ag.color, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>🎯 Target: {exercise.targetSound}</div>
        <div style={{ fontSize: 21, fontWeight: 900, color: "#111827", marginBottom: 8 }}>{exercise.title}</div>
        <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.65, marginBottom: 10 }}>{exercise.instruction}</div>
        <button onClick={() => speak(exercise.instruction)} style={{ background: "rgba(255,255,255,0.7)", border: "none", borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 700, color: ag.color, cursor: "pointer" }}>🔊 Repeat instruction</button>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#6B7280" }}>STEP {step + 1} OF {steps.length}</span>
        <span style={{ fontSize: 12, color: "#9CA3AF" }}>{Math.round(((step + 1) / steps.length) * 100)}% done</span>
      </div>
      <div style={{ display: "flex", gap: 5, marginBottom: 14 }}>
        {steps.map((_, i) => (<div key={i} style={{ flex: 1, height: 6, borderRadius: 999, background: i <= step ? ag.color : "#E5E7EB", transition: "background 0.3s" }} />))}
      </div>
      <div style={{ background: "#fff", border: `2px solid ${ag.color}25`, borderRadius: 16, padding: "20px 24px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: 16 }}>
        <div style={{ fontSize: 15, color: "#111827", lineHeight: 1.7, fontWeight: 600, flex: 1 }}>{steps[step]}</div>
        <button onClick={() => speak(steps[step])} style={{ background: ag.light, border: "none", borderRadius: 10, width: 40, height: 40, fontSize: 18, cursor: "pointer", flexShrink: 0 }}>🔊</button>
      </div>
      {exercise.practiceWords && exercise.practiceWords.length > 0 && (<WordPractice words={exercise.practiceWords} ag={ag} muted={muted} />)}
      {exercise.hint && (
        <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#92400E", display: "flex", gap: 10 }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span><span><strong>Tip:</strong> {exercise.hint}</span>
        </div>
      )}
      <button onClick={handleNext} style={{ width: "100%", background: ag.color, color: "#fff", border: "none", borderRadius: 16, padding: "18px", fontSize: 17, fontWeight: 800, cursor: "pointer", boxShadow: `0 4px 20px ${ag.color}40` }}>
        {isLast ? "🎉 Complete!" : "Next Step →"}
      </button>
    </div>
  );
}

export default function SpeaklyApp() {
  const [screen, setScreen] = useState("home");
  const [selectedAge, setSelectedAge] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);
  const [streakDay] = useState(3);
  const ag = AGE_GROUPS.find(a => a.id === selectedAge);
  const startSession = (ageId, typeId) => { AudioEngine.click(); setSelectedAge(ageId); setSelectedType(typeId); setExerciseIndex(0); setSessionCount(s => s + 1); setScreen("exercise"); };
  const nextExercise = () => { setExerciseIndex(i => i + 1); setSessionCount(s => s + 1); };

  if (screen === "home") return (
    <div style={{ fontFamily: "'Nunito', sans-serif", minHeight: "100vh", background: "linear-gradient(160deg,#F5F3FF 0%,#ECFDF5 50%,#FEF3C7 100%)" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');`}</style>
      <div style={{ background: "#fff", padding: "20px 24px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
        <div><div style={{ fontSize: 24, fontWeight: 900, color: "#1F2937" }}>Speakly 🗣️</div><div style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 600 }}>Your speech therapy companion</div></div>
        <div style={{ textAlign: "right" }}><div style={{ fontSize: 22, fontWeight: 900, color: "#F59E0B" }}>🔥 {streakDay}</div><div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600 }}>day streak</div></div>
      </div>
      <div style={{ padding: "24px 20px" }}>
        <div style={{ background: "linear-gradient(135deg,#7C3AED,#4F46E5)", borderRadius: 24, padding: "22px 24px", color: "#fff", marginBottom: 28, boxShadow: "0 8px 32px rgba(124,58,237,0.3)" }}>
          <div style={{ fontSize: 13, opacity: 0.85, fontWeight: 600, marginBottom: 4 }}>Total sessions completed</div>
          <div style={{ fontSize: 44, fontWeight: 900, lineHeight: 1 }}>{sessionCount}</div>
          <div style={{ fontSize: 13, opacity: 0.8, marginTop: 8, fontWeight: 600 }}>{sessionCount === 0 ? "Let's start your first session today! 🚀" : "Every session builds stronger speech! 💪"}</div>
        </div>
        <div style={{ fontSize: 17, fontWeight: 900, color: "#1F2937", marginBottom: 16 }}>Who is practising today?</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}>
          {AGE_GROUPS.map(g => (
            <div key={g.id} onClick={() => { AudioEngine.click(); setSelectedAge(g.id); setScreen("type-select"); }} style={{ background: "#fff", borderRadius: 20, padding: "20px 16px", cursor: "pointer", border: `2px solid ${g.light}`, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", transition: "all 0.2s", textAlign: "center" }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${g.color}25`; }} onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"; }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>{g.mascot}</div>
              <div style={{ fontSize: 14, fontWeight: 900, color: g.color }}>{g.label}</div>
              <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 3, fontWeight: 600 }}>{g.description}</div>
            </div>
          ))}
        </div>
        <div style={{ background: "linear-gradient(135deg,#EDE9FE,#D1FAE5)", borderRadius: 20, padding: "18px 20px" }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#1F2937", marginBottom: 6 }}>🔊 How Speakly teaches</div>
          <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.7 }}>Every exercise reads instructions aloud. Tap any practice word to hear it spoken clearly — then tap 🐢 Slow to hear it at half speed. Say it back yourself — listen, see, speak!</div>
        </div>
      </div>
    </div>
  );

  if (screen === "type-select") return (
    <div style={{ fontFamily: "'Nunito', sans-serif", minHeight: "100vh", background: "#F9FAFB" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');`}</style>
      <div style={{ background: ag.color, padding: "24px 20px 32px", boxShadow: `0 4px 20px ${ag.color}50` }}>
        <button onClick={() => { AudioEngine.click(); setScreen("home"); }} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, padding: "7px 16px", color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer", marginBottom: 18 }}>← Back</button>
        <div style={{ fontSize: 44 }}>{ag.mascot}</div>
        <div style={{ fontSize: 24, fontWeight: 900, color: "#fff", marginTop: 8 }}>{ag.label}</div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>{ag.description} · Choose your practice type</div>
      </div>
      <div style={{ padding: "24px 20px" }}>
        <div style={{ fontSize: 16, fontWeight: 900, color: "#1F2937", marginBottom: 16 }}>What would you like to practise?</div>
        {THERAPY_TYPES.map(t => {
          const pool = EXERCISES[ag.id]?.[t.id] || [];
          return (
            <div key={t.id} onClick={() => startSession(ag.id, t.id)} style={{ background: "#fff", borderRadius: 18, padding: "18px 20px", marginBottom: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 16, border: "2px solid transparent", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", transition: "all 0.18s" }} onMouseEnter={e => { e.currentTarget.style.borderColor = ag.color; e.currentTarget.style.transform = "translateX(5px)"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.transform = "translateX(0)"; }}>
              <div style={{ fontSize: 34, width: 50, textAlign: "center" }}>{t.icon}</div>
              <div style={{ flex: 1 }}><div style={{ fontSize: 16, fontWeight: 900, color: "#1F2937" }}>{t.label}</div><div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2, fontWeight: 600 }}>{t.desc} · {pool.length} exercises</div></div>
              <div style={{ fontSize: 22, color: "#D1D5DB", fontWeight: 900 }}>→</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  if (screen === "exercise") {
    const exercise = getExercise(selectedAge, selectedType, exerciseIndex);
    return (
      <div style={{ fontFamily: "'Nunito', sans-serif", minHeight: "100vh", background: "#F9FAFB" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');`}</style>
        <div style={{ background: ag.color, padding: "20px 20px 28px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <button onClick={() => { AudioEngine.click(); Speech.stop(); setScreen("type-select"); }} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, padding: "7px 16px", color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>← Back</button>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", fontWeight: 700 }}>Session #{sessionCount}</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 44 }}>{ag.mascot}</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: "#fff", marginTop: 6 }}>{ag.label} · {THERAPY_TYPES.find(t => t.id === selectedType)?.label}</div>
          </div>
        </div>
        <div style={{ padding: "24px 20px" }}>
          <ExerciseCard key={`${selectedAge}-${selectedType}-${exerciseIndex}`} exercise={exercise} ageGroup={selectedAge} onNext={nextExercise} />
          <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
            <button onClick={() => { AudioEngine.click(); Speech.stop(); nextExercise(); }} style={{ flex: 1, background: "#F3F4F6", border: "none", borderRadius: 14, padding: "13px", fontSize: 13, fontWeight: 800, color: "#6B7280", cursor: "pointer" }}>🔄 Skip</button>
            <button onClick={() => { AudioEngine.click(); Speech.stop(); setScreen("home"); }} style={{ flex: 1, background: "#F3F4F6", border: "none", borderRadius: 14, padding: "13px", fontSize: 13, fontWeight: 800, color: "#6B7280", cursor: "pointer" }}>🏠 Home</button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}