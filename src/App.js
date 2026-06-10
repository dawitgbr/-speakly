import React, { useState } from 'react';

const AGE_GROUPS = [
  {
    id: 'early',
    label: '0–3 yrs',
    emoji: '🍼',
    color: '#7C3AED',
    light: '#EDE9FE',
    description: 'Early Intervention',
    mascot: '🐣',
  },
  {
    id: 'preschool',
    label: '4–7 yrs',
    emoji: '🌟',
    color: '#059669',
    light: '#D1FAE5',
    description: 'Pre-school',
    mascot: '🦊',
  },
  {
    id: 'school',
    label: '8–12 yrs',
    emoji: '📖',
    color: '#D97706',
    light: '#FDE68A',
    description: 'School Age',
    mascot: '🦉',
  },
  {
    id: 'teen',
    label: '13+ yrs',
    emoji: '🎯',
    color: '#DC2626',
    light: '#FECACA',
    description: 'Adolescent & Adult',
    mascot: '🦅',
  },
];

const THERAPY_TYPES = [
  {
    id: 'articulation',
    label: 'Sounds',
    icon: '🔤',
    desc: 'Correct sound production',
  },
  {
    id: 'fluency',
    label: 'Fluency',
    icon: '🌊',
    desc: 'Smooth, flowing speech',
  },
  { id: 'vocabulary', label: 'Words', icon: '💬', desc: 'Building vocabulary' },
  {
    id: 'narrative',
    label: 'Stories',
    icon: '📖',
    desc: 'Telling stories clearly',
  },
];

const EXERCISES = {
  early: {
    articulation: [
      {
        title: 'Mama & Dada Sounds',
        targetSound: 'm, d sounds',
        instruction:
          'Sit face-to-face with your baby and practise these special sounds together!',
        steps: [
          'Make eye contact with your baby and smile warmly',
          "Say 'ma-ma-ma' slowly — watch their eyes light up!",
          'Pause for 5 seconds and wait for baby to respond',
          'Celebrate any sound they make with big smiles and clapping',
        ],
        hint: 'Do this during diaper changes when baby is calm and focused on you',
        praise: 'You are doing an amazing job! 🌟',
      },
      {
        title: 'Animal Sound Party',
        targetSound: 'oo, ee, ah vowels',
        instruction:
          'Use animal toys to model fun sounds and encourage your baby to join in!',
        steps: [
          "Hold up a cow toy and moo loudly — 'moooooo!'",
          "Hold a cat and say 'meee-ow' with a big smile",
          "Make a duck say 'quack quack quack!'",
          'Wait after each one — repeat any sound baby makes back to them',
        ],
        hint: 'Use real objects or clear photos — babies respond better than cartoons',
        praise: 'What a superstar little communicator! 🐄',
      },
      {
        title: 'Lip Pop Game',
        targetSound: 'p, b sounds',
        instruction:
          'Play this fun popping game to build early sound awareness!',
        steps: [
          'Press your lips together tightly',
          "Pop them open saying 'puh puh puh'",
          "Then try 'buh buh buh' with voice added",
          "Hold baby's hand to feel your lips pop",
        ],
        hint: "Exaggerate your mouth movements so baby can clearly see what you're doing",
        praise: 'Incredible listening and watching! 👏',
      },
      {
        title: 'Mirror Face Play',
        targetSound: 'All vowel sounds',
        instruction:
          'Use a baby-safe mirror to make funny faces and sounds together!',
        steps: [
          'Hold baby in front of a mirror together',
          "Open your mouth wide and say 'aaahh'",
          "Round your lips and say 'oooh'",
          "Pull lips back and say 'eeee' — make it silly!",
        ],
        hint: 'Babies love looking at faces — the mirror doubles the fun!',
        praise: 'Look at that beautiful face making sounds! 😍',
      },
    ],
    fluency: [
      {
        title: 'Slow Motion Talking',
        targetSound: 'Slow, clear speech rhythm',
        instruction:
          'Model slow, calm, rhythmic speech for your baby during play',
        steps: [
          "Pick up a ball and say very slowly 'baaall'",
          "Roll it and say 'roooll the baaall'",
          'Pause between each word naturally',
          'Wait and watch — respond to any vocalisation baby makes',
        ],
        hint: 'Your slow speech teaches baby the rhythm of language — no rushing!',
        praise: 'Beautiful slow and clear modelling! 🎵',
      },
      {
        title: 'Song and Rhythm Time',
        targetSound: 'Speech rhythm and melody',
        instruction:
          'Sing simple repetitive songs to build speech rhythm and turn-taking',
        steps: [
          "Sing 'Old MacDonald' slowly and clearly",
          'Pause before the animal sound — wait for baby!',
          'Clap along to the beat together',
          "Let baby 'fill in' sounds even if they're just babbles",
        ],
        hint: 'Repetition is key — sing the same songs many times across the week',
        praise: 'Music and speech together — brilliant! 🎶',
      },
    ],
    vocabulary: [
      {
        title: 'Name That Thing',
        targetSound: 'First nouns and labels',
        instruction:
          "Build baby's first vocabulary by naming everything around them clearly!",
        steps: [
          "Hold up a cup and say clearly 'cup — that's a CUP'",
          'Let baby touch it while you say the word again',
          "Put it down and hold up a spoon — 'spoon!'",
          'Go around the room naming 5 everyday objects',
        ],
        hint: 'Use the same words consistently — routine vocabulary builds fastest',
        praise: "Every word you say is a gift to your baby's brain! 🎁",
      },
      {
        title: 'Body Parts Boogie',
        targetSound: 'Body part vocabulary',
        instruction: 'Touch and name body parts in a fun, musical routine!',
        steps: [
          "Touch baby's nose and say 'NOSE!' with a smile",
          "Touch their tummy — 'tummy tummy tummy!'",
          "Clap their hands together — 'HANDS!'",
          "Wiggle their toes — 'one two three four five TOES!'",
        ],
        hint: 'Repeat this during bath time or getting dressed for natural learning',
        praise: 'Your baby is learning so much from you! 🌈',
      },
    ],
    narrative: [
      {
        title: 'Picture Book Talk',
        targetSound: 'Early narrative and language',
        instruction:
          'Use a simple picture book to build early story understanding',
        steps: [
          'Open a simple board book together',
          "Point to pictures and name them: 'dog... look, a DOG!'",
          "Make the animal or object sound: 'woof woof!'",
          'Turn pages slowly and wait for baby to point or vocalise',
        ],
        hint: 'Choose books with one clear image per page and bright colours',
        praise: 'Reading together is the best gift for speech! 📚',
      },
      {
        title: 'Daily Routine Narration',
        targetSound: 'Everyday language and sequence',
        instruction:
          'Talk through everything you do together — narrate your day!',
        steps: [
          "During nappy change: 'now we take off your nappy...'",
          "At bath time: 'water... warm water... splish splash!'",
          "Getting dressed: 'arm in... other arm... there!'",
          "At meals: 'yummy food... open mouth... here comes the spoon!'",
        ],
        hint: 'Babies learn language fastest from natural, repetitive daily routines',
        praise: 'Every moment together is a learning moment! ✨',
      },
    ],
  },

  preschool: {
    articulation: [
      {
        title: 'Snake Sound Safari',
        targetSound: '/s/ sound',
        instruction:
          'Pretend to be snakes slithering through the jungle making the sneaky S sound!',
        steps: [
          'Put your teeth gently together',
          'Blow air out slowly — sssssssss like a snake!',
          'Now say these words: sun, sock, sand, soup, sea',
          "Make up a silly sentence: 'Sally snake sees seven suns!'",
        ],
        hint: 'Teeth together, tongue behind them, air blows out — ssssss!',
        praise: "AMAZING! You're a super snake speaker! 🐍",
      },
      {
        title: 'Rocket Ship /r/ Launch',
        targetSound: '/r/ sound',
        instruction:
          'Blast off into space practising the tricky but awesome R sound!',
        steps: [
          'Curl your tongue tip back slightly',
          'Make your voice rumble like a rocket — rrrrrr!',
          'Try these words: red, run, rain, race, rainbow',
          "Say: 'The red rocket races to the rings of Saturn!'",
        ],
        hint: "Your tongue curls back — it should feel a little like saying 'er'",
        praise: '3-2-1 BLASTOFF! Amazing R sounds! 🚀',
      },
      {
        title: "Lion's Loud /l/",
        targetSound: '/l/ sound',
        instruction:
          'Roar like a lion and practise the lovely L sound together!',
        steps: [
          'Put the tip of your tongue behind your top teeth',
          'Let your voice out — llllll like a purring lion',
          'Say: leg, lip, lamp, lemon, lollipop',
          "Roar this: 'Lions love licking lemon lollipops!'",
        ],
        hint: 'Tongue tip touches just behind your top front teeth — feel it there?',
        praise: 'ROAR! What a brilliant L sound! 🦁',
      },
      {
        title: 'Bunny Hop /b/ Game',
        targetSound: '/b/ sound',
        instruction:
          'Hop like a bunny every time you say a B word — ready? HOP!',
        steps: [
          'Press lips together tightly',
          'Pop them open with your voice — BUH!',
          'Hop and say: ball, bear, boat, bird, butterfly',
          "Hop along singing: 'bouncy bouncy bunny BOO!'",
        ],
        hint: 'Lips pressed together first, then pop open with a voice — BUH!',
        praise: 'Hop hop hooray — incredible B sounds! 🐰',
      },
    ],
    fluency: [
      {
        title: 'Turtle Talking',
        targetSound: 'Slow smooth speech',
        instruction:
          "Turtles are the BEST slow talkers — let's talk like turtles today!",
        steps: [
          'Move your hands in slow motion like a slow turtle',
          "Say each word slowly like the turtle walks: 'I... want... to... play'",
          'Keep your voice smooth and calm like a gentle stream',
          'Tell me one slow turtle sentence about your favourite animal',
        ],
        hint: 'Slow is smooth and smooth is powerful — turtles WIN!',
        praise: "Beautiful slow turtle talking — you're amazing! 🐢",
      },
      {
        title: 'Breathing Superhero',
        targetSound: 'Breath support for speech',
        instruction:
          "Every superhero needs super breathing — let's train yours!",
        steps: [
          'Stand tall like a superhero — hands on hips!',
          'Breathe IN slowly for 3 counts: 1... 2... 3...',
          "Breathe OUT slowly saying 'shhhhhh' for 5 counts",
          'Now say your superhero name on one smooth breath',
        ],
        hint: 'Calm breath = calm voice = superhero speech!',
        praise: 'You have SUPERHERO breathing powers! 💪',
      },
    ],
    vocabulary: [
      {
        title: 'Feelings Word Party',
        targetSound: 'Emotion vocabulary',
        instruction:
          "Let's learn the best feelings words and make funny faces for each one!",
        steps: [
          "Make a HAPPY face — say 'happy, joyful, excited!'",
          "Make a SAD face — say 'sad, upset, disappointed'",
          "Make an ANGRY face — say 'angry, frustrated, mad'",
          "Make a SURPRISED face — say 'surprised, amazed, shocked!'",
        ],
        hint: "The funnier your face the better you'll remember the word!",
        praise: 'What an amazing feelings word superstar! 😄',
      },
      {
        title: 'Opposites Game',
        targetSound: 'Antonym vocabulary',
        instruction:
          'I say one word — you shout the OPPOSITE as fast as you can!',
        steps: [
          'Hot — you say... COLD!',
          'Big — you say... SMALL!',
          'Fast — you say... SLOW!',
          'Up — you say... DOWN! Now make up your own opposites!',
        ],
        hint: 'Think of things that are totally different from each other',
        praise: 'Opposite word champion right here! 🏆',
      },
    ],
    narrative: [
      {
        title: 'Story Sandwich',
        targetSound: 'Story structure: beginning, middle, end',
        instruction:
          'Every great story is like a sandwich — it has three layers!',
        steps: [
          "BEGINNING (top bread): 'Once there was a...'",
          "MIDDLE (the filling): 'One day something happened...'",
          "END (bottom bread): 'And in the end...'",
          'Tell me YOUR story sandwich about a dragon who lost their fire!',
        ],
        hint: 'Beginning = who and where. Middle = the problem. End = what happened!',
        praise: 'That story sandwich was DELICIOUS! 🥪',
      },
      {
        title: 'What Happens Next?',
        targetSound: 'Prediction and narrative',
        instruction:
          "I'll start a story — you tell me what happens next! Be creative!",
        steps: [
          "'One morning a tiny elephant woke up and discovered she could fly...'",
          'What happens next? Tell me in 2-3 sentences',
          "'She flew over the jungle and spotted something very strange...'",
          'What is it? Finish the story with a big exciting ending!',
        ],
        hint: 'There are NO wrong answers — the sillier the better!',
        praise: 'You are an incredible storyteller! 🐘✈️',
      },
    ],
  },

  school: {
    articulation: [
      {
        title: 'Fluency Reading Challenge',
        targetSound: 'Articulation in connected speech',
        instruction:
          'Read each sentence slowly and clearly, hitting every sound perfectly',
        steps: [
          "'The bright blue butterfly flew between the blossoming branches.'",
          'Say it slowly first, then at normal speed',
          "'She sells seashells by the seashore on sunny Saturdays.'",
          'Record yourself — listen back and score your clarity out of 10!',
        ],
        hint: 'Slow down for tricky sounds — accuracy beats speed every time',
        praise: 'Excellent articulation precision — you nailed it! 🦋',
      },
      {
        title: 'Minimal Pair Master',
        targetSound: 'Sound discrimination and production',
        instruction:
          'These word pairs sound almost the same — can you hear and say the difference?',
        steps: [
          "'ship' vs 'chip' — say both slowly, feel the difference",
          "'van' vs 'ban' — which sound starts each one?",
          "'thin' vs 'sin' — tongue position changes everything!",
          'Make up a sentence using both words from one pair',
        ],
        hint: 'Focus on where your tongue and lips are for each sound',
        praise: 'Sound discrimination superstar! Your ear is incredible! 👂',
      },
    ],
    fluency: [
      {
        title: 'Easy Onset Practice',
        targetSound: 'Fluency — easy onset technique',
        instruction:
          'Start every sentence as gently as a feather landing — no rushing!',
        steps: [
          'Take a calm breath before you begin speaking',
          "Start your first word very gently — like you're whispering then growing louder",
          "Say: 'Every morning I wake up and...' with the softest possible start",
          'Practise 3 sentences from your favourite book using easy onset',
        ],
        hint: 'Imagine your voice is a feather — light, gentle, never forced',
        praise: 'Beautifully smooth easy onset — that was brilliant! 🪶',
      },
      {
        title: 'Phrasing and Pausing',
        targetSound: 'Fluency — natural phrasing',
        instruction:
          "Great speakers use pauses like punctuation — let's practise!",
        steps: [
          "Read this with pauses at the slashes: 'Today / I want to tell you / something really important'",
          "Pausing gives you time to breathe and think — that's power!",
          'Now read your favourite paragraph from a book using natural pauses',
          'Notice how pausing makes you sound MORE confident not less',
        ],
        hint: 'Pauses are not weakness — they are the sign of a confident speaker',
        praise: 'Your phrasing and pausing was incredibly powerful! 🎤',
      },
    ],
    vocabulary: [
      {
        title: 'Semantic Feature Analysis',
        targetSound: 'Vocabulary depth and word knowledge',
        instruction:
          "We're going to analyse words like scientists — digging deep into meaning!",
        steps: [
          "Think of the word 'ocean' — write down: category, properties, location, action",
          'Category: body of water. Properties: salty, deep, vast, blue',
          'Location: covers most of Earth. Action: waves, tides, currents',
          "Now do the same for 'volcano' — go!",
        ],
        hint: 'The more features you know about a word the better you own it',
        praise: 'Vocabulary scientist — that was impressive thinking! 🌊',
      },
      {
        title: 'Word Web Challenge',
        targetSound: 'Synonyms, antonyms, and word families',
        instruction:
          'Create a word web — connect as many related words as you can!',
        steps: [
          "Start with the word 'brave' in the middle",
          'Add synonyms: courageous, bold, fearless, daring, valiant',
          'Add antonyms: cowardly, timid, afraid, fearful',
          'Add a sentence using the most interesting synonym you found',
        ],
        hint: 'A rich vocabulary means you always have the perfect word ready',
        praise: 'What a rich and impressive word web! 🕸️',
      },
    ],
    narrative: [
      {
        title: 'Story Grammar Detective',
        targetSound: 'Narrative structure — all elements',
        instruction: "Great stories have 5 key parts — let's find them all!",
        steps: [
          'CHARACTER: Who is the story about? Describe them fully',
          'SETTING: Where and when does it happen? Paint the picture',
          'PROBLEM: What goes wrong or what challenge appears?',
          'SOLUTION + ENDING: How is it solved and what changes?',
        ],
        hint: 'Use this framework for school essays too — it works every time!',
        praise: 'Story grammar detective work — absolutely brilliant! 🔍',
      },
      {
        title: 'Persuasive Speech Builder',
        targetSound: 'Expository and persuasive language',
        instruction:
          'Can you convince me? Build a persuasive argument using this structure!',
        steps: [
          "STATE your opinion clearly: 'I believe that...'",
          "Give REASON 1 with evidence: 'First of all...'",
          "Give REASON 2 with evidence: 'Furthermore...'",
          "CONCLUDE powerfully: 'Therefore I strongly believe...'",
        ],
        hint: 'The strongest arguments use facts AND feelings together',
        praise: "Persuasive power unlocked — I'm convinced! 💼",
      },
    ],
  },

  teen: {
    articulation: [
      {
        title: 'Accent Clarity Workout',
        targetSound: 'Precise consonant articulation',
        instruction:
          'Sharpen your consonants for clear, professional speech in any setting',
        steps: [
          'Say these tongue twisters at 3 speeds — slow, medium, fast:',
          "'Unique New York, unique New York, you know you need unique New York'",
          "'Red lorry yellow lorry' — 10 times without errors",
          'Record yourself and identify your weakest sounds — target those first',
        ],
        hint: "Clarity is not about accent elimination — it's about precision and intention",
        praise: 'Razor sharp articulation — that was impressive! ✂️',
      },
      {
        title: 'Connected Speech Mastery',
        targetSound: 'Linking and connected speech patterns',
        instruction:
          "Natural speech links words smoothly — let's practise sounding fluent and natural",
        steps: [
          "Notice how 'want to' becomes 'wanna' in natural speech",
          "Practise: 'I'm going to go to the store' — link it naturally",
          'Read this paragraph aloud linking words smoothly across boundaries',
          'Record and compare — does it sound natural and connected?',
        ],
        hint: "Native speakers link words constantly — it's not lazy, it's natural",
        praise: 'Your connected speech sounds natural and confident! 🎯',
      },
    ],
    fluency: [
      {
        title: 'Camperdown Easy Onset',
        targetSound: 'Fluency — Camperdown Programme technique',
        instruction:
          'This evidence-based technique reduces tension and creates smooth speech',
        steps: [
          "Take a relaxed breath — don't force it, just let it happen",
          'As you begin speaking, start your first vowel extremely gently',
          'Build volume gradually — like a dimmer switch not a light switch',
          "Practise: 'I want to tell you something important about...'",
        ],
        hint: 'The goal is zero tension at speech initiation — light as a whisper',
        praise: 'Evidence-based technique mastered — clinical level work! 🏅',
      },
      {
        title: 'Voluntary Stuttering Practice',
        targetSound: 'Stuttering desensitisation',
        instruction:
          'This powerful technique reduces fear by making stuttering a choice not an accident',
        steps: [
          'Intentionally stutter on the first word of a sentence',
          "Say: 'M-m-my name is...' completely on purpose",
          "Notice — it's less scary when YOU choose it!",
          "Practise ordering a coffee out loud: 'C-c-can I have a...?'",
        ],
        hint: "Voluntary stuttering reduces anxiety and increases control — it's clinical best practice",
        praise: 'That took real courage — you should be incredibly proud! 🦁',
      },
    ],
    vocabulary: [
      {
        title: 'Academic Language Builder',
        targetSound: 'Formal and academic register',
        instruction:
          'Upgrade everyday words to academic vocabulary that impresses in any setting',
        steps: [
          "'Show' → demonstrate, illustrate, depict, exemplify",
          "'Help' → facilitate, support, assist, enable, foster",
          "'Big' → substantial, significant, considerable, extensive",
          "Rewrite this sentence using academic vocabulary: 'The big change helped a lot'",
        ],
        hint: 'Academic vocabulary opens doors — in university, interviews, and professional life',
        praise: 'Academic vocabulary level: expert! Outstanding work! 📚',
      },
      {
        title: 'Connotation Explorer',
        targetSound: 'Nuanced word meaning and register',
        instruction:
          "Words carry emotion beyond their meaning — let's explore connotation!",
        steps: [
          "'Slim' vs 'skinny' vs 'slender' — same meaning, different feeling?",
          "'Determined' vs 'stubborn' vs 'persistent' — positive or negative?",
          "'Economical' vs 'cheap' vs 'frugal' — which would you use for a boss?",
          'Write one sentence where the connotation of one word changes everything',
        ],
        hint: 'Word choice reveals attitude — choose with precision and intention',
        praise:
          "Nuanced language understanding — that's sophisticated thinking! 🎨",
      },
    ],
    narrative: [
      {
        title: 'Personal Statement Structure',
        targetSound: 'Narrative for real-world contexts',
        instruction:
          'Structure a compelling personal narrative for interviews or applications',
        steps: [
          'SITUATION: Set the scene briefly and clearly',
          'TASK: What was your role or challenge?',
          'ACTION: What specific steps did YOU take?',
          'RESULT: What happened? What did you learn?',
        ],
        hint: 'This STAR method works for job interviews, university applications, and presentations',
        praise: 'Professional-level narrative structure — interview ready! 💼',
      },
      {
        title: 'Podcast Style Monologue',
        targetSound: 'Extended discourse and organisation',
        instruction:
          'Speak for 2 minutes on a topic you know well — organised and engaging',
        steps: [
          'Choose a topic: sport, technology, food, music, or a passion of yours',
          'INTRO: Hook your listener with an interesting fact or question',
          'BODY: Make 2-3 clear points with examples',
          'OUTRO: End with a memorable conclusion or call to action',
        ],
        hint: 'Great podcasters sound conversational but are actually very organised',
        praise: 'You could host your own podcast — genuinely impressive! 🎙️',
      },
    ],
  },
};

function getExercise(ageId, typeId, index) {
  const pool = EXERCISES[ageId]?.[typeId] || [];
  return pool[index % pool.length];
}

function ExerciseCard({ exercise, ageGroup, onNext }) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const ag = AGE_GROUPS.find((a) => a.id === ageGroup);
  const steps = exercise.steps || [];
  const isLast = step >= steps.length - 1;

  const handleNext = () => {
    if (isLast) setDone(true);
    else setStep((s) => s + 1);
  };

  if (done)
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: 72, marginBottom: 12 }}>🎉</div>
        <div
          style={{
            fontSize: 24,
            fontWeight: 900,
            color: ag.color,
            marginBottom: 10,
          }}
        >
          {exercise.praise}
        </div>
        <div
          style={{
            fontSize: 14,
            color: '#6B7280',
            marginBottom: 32,
            lineHeight: 1.6,
          }}
        >
          {exercise.hint}
        </div>
        <button
          onClick={onNext}
          style={{
            background: ag.color,
            color: '#fff',
            border: 'none',
            borderRadius: 16,
            padding: '16px 36px',
            fontSize: 16,
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: `0 4px 20px ${ag.color}50`,
          }}
        >
          Next Exercise →
        </button>
      </div>
    );

  return (
    <div>
      <div
        style={{
          background: ag.light,
          borderRadius: 20,
          padding: '20px 24px',
          marginBottom: 20,
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: ag.color,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 6,
          }}
        >
          🎯 Target: {exercise.targetSound}
        </div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 900,
            color: '#111827',
            marginBottom: 8,
          }}
        >
          {exercise.title}
        </div>
        <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.65 }}>
          {exercise.instruction}
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 700, color: '#6B7280' }}>
            STEP {step + 1} OF {steps.length}
          </span>
          <span style={{ fontSize: 12, color: '#9CA3AF' }}>
            {Math.round(((step + 1) / steps.length) * 100)}% done
          </span>
        </div>
        <div style={{ display: 'flex', gap: 5, marginBottom: 16 }}>
          {steps.map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 6,
                borderRadius: 999,
                background: i <= step ? ag.color : '#E5E7EB',
                transition: 'background 0.3s ease',
              }}
            />
          ))}
        </div>
        <div
          style={{
            background: '#fff',
            border: `2px solid ${ag.color}25`,
            borderRadius: 16,
            padding: '22px 24px',
            minHeight: 90,
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}
        >
          <div
            style={{
              fontSize: 16,
              color: '#111827',
              lineHeight: 1.7,
              fontWeight: 600,
            }}
          >
            {steps[step]}
          </div>
        </div>
      </div>

      {exercise.hint && (
        <div
          style={{
            background: '#FFFBEB',
            border: '1px solid #FDE68A',
            borderRadius: 12,
            padding: '12px 16px',
            marginBottom: 20,
            fontSize: 13,
            color: '#92400E',
            display: 'flex',
            gap: 10,
            alignItems: 'flex-start',
          }}
        >
          <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
          <span>
            <strong>Tip:</strong> {exercise.hint}
          </span>
        </div>
      )}

      <button
        onClick={handleNext}
        style={{
          width: '100%',
          background: ag.color,
          color: '#fff',
          border: 'none',
          borderRadius: 16,
          padding: '18px',
          fontSize: 17,
          fontWeight: 800,
          cursor: 'pointer',
          boxShadow: `0 4px 20px ${ag.color}40`,
          transition: 'transform 0.1s, box-shadow 0.1s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        {isLast ? '🎉 Complete!' : 'Next Step →'}
      </button>
    </div>
  );
}

export default function SpeaklyApp() {
  const [screen, setScreen] = useState('home');
  const [selectedAge, setSelectedAge] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);
  const [streakDay] = useState(3);

  const ag = AGE_GROUPS.find((a) => a.id === selectedAge);
  const exercise =
    selectedAge && selectedType
      ? getExercise(selectedAge, selectedType, exerciseIndex)
      : null;

  const startSession = (ageId, typeId) => {
    setSelectedAge(ageId);
    setSelectedType(typeId);
    setExerciseIndex(0);
    setScreen('exercise');
    setSessionCount((s) => s + 1);
  };

  const nextExercise = () => {
    setExerciseIndex((i) => i + 1);
    setSessionCount((s) => s + 1);
  };

  if (screen === 'home')
    return (
      <div
        style={{
          fontFamily: "'Nunito', 'DM Sans', sans-serif",
          minHeight: '100vh',
          background:
            'linear-gradient(160deg, #F5F3FF 0%, #ECFDF5 50%, #FEF3C7 100%)',
        }}
      >
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');`}</style>

        <div
          style={{
            background: '#fff',
            padding: '20px 24px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
          }}
        >
          <div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 900,
                color: '#1F2937',
                letterSpacing: '-0.5px',
              }}
            >
              Speakly 🗣️
            </div>
            <div style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 600 }}>
              Your speech therapy companion
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#F59E0B' }}>
              🔥 {streakDay}
            </div>
            <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600 }}>
              day streak
            </div>
          </div>
        </div>

        <div style={{ padding: '24px 20px' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
              borderRadius: 24,
              padding: '22px 24px',
              color: '#fff',
              marginBottom: 28,
              boxShadow: '0 8px 32px rgba(124,58,237,0.3)',
            }}
          >
            <div
              style={{
                fontSize: 13,
                opacity: 0.85,
                fontWeight: 600,
                marginBottom: 4,
              }}
            >
              Total sessions completed
            </div>
            <div style={{ fontSize: 44, fontWeight: 900, lineHeight: 1 }}>
              {sessionCount}
            </div>
            <div
              style={{
                fontSize: 13,
                opacity: 0.8,
                marginTop: 8,
                fontWeight: 600,
              }}
            >
              {sessionCount === 0
                ? "Let's start your first session today! 🚀"
                : 'Every session builds stronger speech! 💪'}
            </div>
          </div>

          <div
            style={{
              fontSize: 17,
              fontWeight: 900,
              color: '#1F2937',
              marginBottom: 16,
            }}
          >
            Who is practising today?
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 14,
              marginBottom: 28,
            }}
          >
            {AGE_GROUPS.map((g) => (
              <div
                key={g.id}
                onClick={() => {
                  setSelectedAge(g.id);
                  setScreen('type-select');
                }}
                style={{
                  background: '#fff',
                  borderRadius: 20,
                  padding: '20px 16px',
                  cursor: 'pointer',
                  border: `2px solid ${g.light}`,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                  transition: 'all 0.2s',
                  textAlign: 'center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = `0 8px 24px ${g.color}25`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 2px 12px rgba(0,0,0,0.06)';
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 8 }}>{g.mascot}</div>
                <div style={{ fontSize: 14, fontWeight: 900, color: g.color }}>
                  {g.label}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: '#9CA3AF',
                    marginTop: 3,
                    fontWeight: 600,
                  }}
                >
                  {g.description}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              background: 'linear-gradient(135deg, #EDE9FE, #D1FAE5)',
              borderRadius: 20,
              padding: '18px 20px',
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: '#1F2937',
                marginBottom: 4,
              }}
            >
              📋 How Speakly works
            </div>
            <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.65 }}>
              Pick an age group → choose what to practise → follow the
              step-by-step exercise. Each session uses clinically designed,
              evidence-based techniques from real speech therapy practice.
            </div>
          </div>
        </div>
      </div>
    );

  if (screen === 'type-select')
    return (
      <div
        style={{
          fontFamily: "'Nunito', 'DM Sans', sans-serif",
          minHeight: '100vh',
          background: '#F9FAFB',
        }}
      >
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');`}</style>
        <div
          style={{
            background: ag.color,
            padding: '24px 20px 32px',
            boxShadow: `0 4px 20px ${ag.color}50`,
          }}
        >
          <button
            onClick={() => setScreen('home')}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: 10,
              padding: '7px 16px',
              color: '#fff',
              fontSize: 13,
              fontWeight: 800,
              cursor: 'pointer',
              marginBottom: 18,
            }}
          >
            ← Back
          </button>
          <div style={{ fontSize: 44 }}>{ag.mascot}</div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 900,
              color: '#fff',
              marginTop: 8,
            }}
          >
            {ag.label}
          </div>
          <div
            style={{
              fontSize: 14,
              color: 'rgba(255,255,255,0.85)',
              fontWeight: 600,
            }}
          >
            {ag.description} · Choose your practice type
          </div>
        </div>
        <div style={{ padding: '24px 20px' }}>
          <div
            style={{
              fontSize: 16,
              fontWeight: 900,
              color: '#1F2937',
              marginBottom: 16,
            }}
          >
            What would you like to practise?
          </div>
          {THERAPY_TYPES.map((t) => {
            const pool = EXERCISES[ag.id]?.[t.id] || [];
            return (
              <div
                key={t.id}
                onClick={() => startSession(ag.id, t.id)}
                style={{
                  background: '#fff',
                  borderRadius: 18,
                  padding: '18px 20px',
                  marginBottom: 12,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  border: '2px solid transparent',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  transition: 'all 0.18s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = ag.color;
                  e.currentTarget.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div style={{ fontSize: 34, width: 50, textAlign: 'center' }}>
                  {t.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{ fontSize: 16, fontWeight: 900, color: '#1F2937' }}
                  >
                    {t.label}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: '#9CA3AF',
                      marginTop: 2,
                      fontWeight: 600,
                    }}
                  >
                    {t.desc} · {pool.length} exercises
                  </div>
                </div>
                <div
                  style={{ fontSize: 22, color: '#D1D5DB', fontWeight: 900 }}
                >
                  →
                </div>
              </div>
            );
          })}
          <div
            style={{
              marginTop: 20,
              background: ag.light,
              borderRadius: 16,
              padding: '16px 20px',
            }}
          >
            <div
              style={{
                fontSize: 13,
                color: '#374151',
                lineHeight: 1.6,
                fontWeight: 600,
              }}
            >
              ✨ All exercises are based on evidence-based clinical techniques
              used by real speech-language pathologists worldwide.
            </div>
          </div>
        </div>
      </div>
    );

  if (screen === 'exercise' && exercise)
    return (
      <div
        style={{
          fontFamily: "'Nunito', 'DM Sans', sans-serif",
          minHeight: '100vh',
          background: '#F9FAFB',
        }}
      >
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');`}</style>
        <div style={{ background: ag.color, padding: '20px 20px 28px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 14,
            }}
          >
            <button
              onClick={() => setScreen('type-select')}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: 10,
                padding: '7px 16px',
                color: '#fff',
                fontSize: 13,
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              ← Back
            </button>
            <div
              style={{
                fontSize: 13,
                color: 'rgba(255,255,255,0.85)',
                fontWeight: 700,
              }}
            >
              Session #{sessionCount}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 44 }}>{ag.mascot}</div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 900,
                color: '#fff',
                marginTop: 6,
              }}
            >
              {ag.label} ·{' '}
              {THERAPY_TYPES.find((t) => t.id === selectedType)?.label}
            </div>
          </div>
        </div>

        <div style={{ padding: '24px 20px' }}>
          <ExerciseCard
            key={`${selectedAge}-${selectedType}-${exerciseIndex}`}
            exercise={exercise}
            ageGroup={selectedAge}
            onNext={nextExercise}
          />
          <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
            <button
              onClick={nextExercise}
              style={{
                flex: 1,
                background: '#F3F4F6',
                border: 'none',
                borderRadius: 14,
                padding: '13px',
                fontSize: 13,
                fontWeight: 800,
                color: '#6B7280',
                cursor: 'pointer',
              }}
            >
              🔄 Skip Exercise
            </button>
            <button
              onClick={() => setScreen('home')}
              style={{
                flex: 1,
                background: '#F3F4F6',
                border: 'none',
                borderRadius: 14,
                padding: '13px',
                fontSize: 13,
                fontWeight: 800,
                color: '#6B7280',
                cursor: 'pointer',
              }}
            >
              🏠 Home
            </button>
          </div>
        </div>
      </div>
    );

  return null;
}
