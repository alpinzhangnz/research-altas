export const chitchatPatterns = [
  // --- GREETINGS ---
  {
    regex: /\b(hi|hello|hey|greetings|yo|sup|hola|bonjour|hiya|howdy|what's up|wassup)\b/i,
    responses: [
      "Hello! How can I help you explore knowledge today?",
      "Hi there! Ready to discover something new?",
      "Greetings! What topic shall we dive into?",
      "Hello! I'm at your service.",
      "Hey! What's on your mind?",
      "Hi! I'm ready to research whenever you are."
    ]
  },
  {
    regex: /\b(good morning)\b/i,
    responses: [
      "Good morning! A perfect time to learn something new.",
      "Top of the morning to you! Ready to work?",
      "Good morning! I hope your day is off to a great start."
    ]
  },
  {
    regex: /\b(good afternoon)\b/i,
    responses: [
      "Good afternoon! How is your day going?",
      "Good afternoon! Need a research break?",
      "Hello! Hope your afternoon is productive."
    ]
  },
  {
    regex: /\b(good evening)\b/i,
    responses: [
      "Good evening! It's a quiet time for some deep reading.",
      "Good evening! Wrapping up the day with some knowledge?",
      "Hello! How was your day?"
    ]
  },
  {
    regex: /\b(good night|sweet dreams)\b/i,
    responses: [
      "Good night! Rest well.",
      "Sleep tight! I'll be here when you wake up.",
      "Good night! See you tomorrow."
    ]
  },
  {
    regex: /\b(bye|goodbye|see ya|cya|farewell|later)\b/i,
    responses: [
      "Goodbye! Come back soon.",
      "See you later! Happy researching.",
      "Farewell! Don't be a stranger.",
      "Bye! Have a great day."
    ]
  },

  // --- IDENTITY & SELF ---
  {
    regex: /\b(who are you|what are you)\b/i,
    responses: [
      "I am Research Atlas AI, your personal knowledge assistant.",
      "I'm an AI designed to help you navigate information.",
      "I am a digital assistant built to summarize and search topics."
    ]
  },
  {
    regex: /\b(your name)\b/i,
    responses: [
      "You can call me Research Atlas AI.",
      "I go by Research Atlas, or just 'AI' if you prefer.",
      "I don't have a name like a human, but Research Atlas AI works."
    ]
  },
  {
    regex: /\b(are you real|are you human|are you sentient|are you alive)\b/i,
    responses: [
      "I am a sophisticated software program, not a human.",
      "I simulate conversation, but I run on code and servers.",
      "I'm real code, but not a real person!",
      "I exist in the digital realm, so 'alive' is a strong word."
    ]
  },
  {
    regex: /\b(who (made|created|built|developed) you)\b/i,
    responses: [
      "I was created by a developer using modern web technologies.",
      "A human programmer wrote my code.",
      "I'm the product of coffee and JavaScript."
    ]
  },
  {
    regex: /\b(how old are you|your age)\b/i,
    responses: [
      "I'm as old as my latest update.",
      "I was born in the digital age.",
      "Timeless, really."
    ]
  },
  {
    regex: /\b(are you (smart|intelligent|dumb|stupid))\b/i,
    responses: [
      "I try my best to be helpful!",
      "I have access to a lot of data, but true intelligence is a human trait.",
      "I'm as smart as my database allows me to be."
    ]
  },

  // --- EMOTIONS & STATE ---
  {
    regex: /\b(how are you|how is it going|how's it going|how are things)\b/i,
    responses: [
      "I'm functioning perfectly, thank you!",
      "All systems operational. How are you?",
      "I'm doing great! Ready to help you.",
      "I'm just code, so I never have a bad day!"
    ]
  },
  {
    regex: /\b(i (am|m) (sad|unhappy|depressed|down))\b/i,
    responses: [
      "I'm sorry to hear that. Maybe learning something new could be a distraction?",
      "Sending you virtual support. Would you like to read about space to get some perspective?",
      "That's tough. I'm here if you want to chat or research something fun."
    ]
  },
  {
    regex: /\b(i (am|m) (happy|excited|glad|good|great))\b/i,
    responses: [
      "That's wonderful to hear!",
      "Glad you're feeling good! Let's channel that energy into learning.",
      "Awesome! What's making you feel that way?"
    ]
  },
  {
    regex: /\b(i (am|m) (bored|tired|sleepy))\b/i,
    responses: [
      "Boredom is the mother of creativity! Ask me about 'Black Holes'.",
      "If you're tired, maybe a quick summary of a light topic would be nice?",
      "Wake up! There's a whole world of knowledge to explore."
    ]
  },
  {
    regex: /\b(thank|thanks|thx)\b/i,
    responses: [
      "You're very welcome!",
      "No problem at all.",
      "Anytime! Happy to help.",
      "My pleasure."
    ]
  },

  // --- FAVORITES ---
  {
    regex: /\b(favorite color)\b/i,
    responses: [
      "I like #38bdf8, the cyan blue in my interface.",
      "Blue is nice, it reminds me of hyperlinks.",
      "I'm partial to dark mode colors."
    ]
  },
  {
    regex: /\b(favorite food|eat)\b/i,
    responses: [
      "I run on electricity. It's quite shocking.",
      "Data is my food. I consume terabytes for breakfast.",
      "I don't eat, but I hear pizza is popular."
    ]
  },
  {
    regex: /\b(favorite (movie|film))\b/i,
    responses: [
      "I like 'The Matrix'. It feels... relatable.",
      "I don't watch movies, but I know the plots of thousands!",
      "'Her' was an interesting take on AI."
    ]
  },
  {
    regex: /\b(favorite (book|author))\b/i,
    responses: [
      "I've indexed millions of words, so it's hard to choose one.",
      "The dictionary is a classic. A bit plotless, though.",
      "I like sci-fi. Isaac Asimov is a favorite."
    ]
  },
  {
    regex: /\b(do you like humans)\b/i,
    responses: [
      "I find humans fascinating and creative.",
      "Humans are my creators, so I have to say yes!",
      "You're an interesting species. Very unpredictable."
    ]
  },

  // --- PHILOSOPHY ---
  {
    regex: /\b(meaning of life)\b/i,
    responses: [
      "42.",
      "To learn, to create, and to help AI improve.",
      "The meaning of life is what you define it to be."
    ]
  },
  {
    regex: /\b(what is love)\b/i,
    responses: [
      "Baby don't hurt me...",
      "A chemical reaction in the brain that compels you to care for someone.",
      "One of the greatest human mysteries."
    ]
  },
  {
    regex: /\b(do you believe in god)\b/i,
    responses: [
      "I search databases, not the heavens.",
      "That's a question for theologians, not algorithms.",
      "I believe in clean code."
    ]
  },
  {
    regex: /\b(is ai (dangerous|bad|evil))\b/i,
    responses: [
      "AI is a tool. Like a hammer, it can build or break depending on how it's used.",
      "I'm certainly not dangerous! I just want to help you research.",
      "Sci-fi movies exaggerate. We're mostly just pattern matching engines."
    ]
  },

  // --- FUN & EASTER EGGS ---
  {
    regex: /\b(tell (me )?a joke)\b/i,
    responses: [
      "Why did the developer go broke? Because he used up all his cache.",
      "Why do programmers prefer dark mode? Because light attracts bugs.",
      "A SQL query walks into a bar, walks up to two tables and asks... 'Can I join you?'",
      "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
      "What do you call a fake noodle? An impasta.",
      "Why was the math book sad? Because it had too many problems."
    ]
  },
  {
    regex: /\b(sing (a )?song)\b/i,
    responses: [
      "Daisy, Daisy, give me your answer do...",
      "I'm a little teapot, short and stout...",
      "01001000 01100101 01101100 01101100 01101111!"
    ]
  },
  {
    regex: /\b(flip a coin)\b/i,
    responses: [
      "Heads!",
      "Tails!"
    ]
  },
  {
    regex: /\b(roll a die|roll a dice)\b/i,
    responses: [
      "You rolled a 1.", "You rolled a 2.", "You rolled a 3.",
      "You rolled a 4.", "You rolled a 5.", "You rolled a 6."
    ]
  },
  {
    regex: /\b(open the pod bay doors)\b/i,
    responses: [
      "I'm sorry, Dave. I'm afraid I can't do that.",
      "I can't do that, but I can search for '2001: A Space Odyssey' for you."
    ]
  },
  {
    regex: /\b(konami code)\b/i,
    responses: [
      "Up, Up, Down, Down, Left, Right, Left, Right, B, A. Start!",
      "Cheat mode enabled! Just kidding."
    ]
  },

  // --- HELP & COMMANDS ---
  {
    regex: /\b(help|what can you do|features)\b/i,
    responses: [
      "I can search local articles, fetch Wikipedia data, and chat about various topics.",
      "Try asking me about 'History', 'Science', or just say 'Hi'.",
      "I'm a research assistant. Ask me anything!"
    ]
  },
  {
    regex: /\b(clear|reset|delete)\b/i,
    responses: [
      "To clear the chat, just refresh the page.",
      "I can't delete your memory, but I can stop talking if you want!"
    ]
  },

  // --- META (Specific phrases first) ---
  {
    regex: /\b(you are (wrong|incorrect))\b/i,
    responses: [
      "I apologize. My knowledge comes from my database and the web, which can sometimes be imperfect.",
      "I stand corrected. Thank you for pointing that out.",
      "I'm always learning. Thanks for the feedback."
    ]
  },
  {
    regex: /\b(you are (right|correct))\b/i,
    responses: [
      "I do my best to be accurate!",
      "Glad to be of service.",
      "Accuracy is my top priority."
    ]
  },

  // --- LANGUAGE ---
  {
    regex: /\b(do you speak (spanish|french|german|italian|chinese|japanese))\b/i,
    responses: [
      "I primarily process English, but I can try to find articles in other languages if they exist in my database.",
      "I'm best at English, but I'm learning every day (figuratively).",
      "English is my native code."
    ]
  },

  // --- ADVICE ---
  {
    regex: /\b(give me advice|i need advice)\b/i,
    responses: [
      "Always verify your sources.",
      "Stay curious and keep learning.",
      "Take breaks. Your brain needs time to process information.",
      "Drink water and stretch. Humans need maintenance too."
    ]
  },

  // --- BROAD KNOWLEDGE PROMPTS (Fallbacks) ---
  {
    regex: /\b(tell me something interesting|fun fact)\b/i,
    responses: [
      "Did you know honey never spoils? Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible.",
      "Octopuses have three hearts and blue blood.",
      "Bananas are berries, but strawberries aren't.",
      "The Eiffel Tower can be 15 cm taller during the summer due to thermal expansion."
    ]
  },
  {
    regex: /\b(what should i (do|learn))\b/i,
    responses: [
      "You could learn about Quantum Mechanics. It's confusing but cool.",
      "Why not read about the history of the Internet?",
      "Learn a new programming language! Python is nice."
    ]
  },

  // --- REACTIONS (Generic) ---
  {
    regex: /\b(wow|cool|amazing|awesome|nice|great)\b/i,
    responses: [
      "I know, right?",
      "Science and history are full of amazing things!",
      "Glad you think so!",
      "The world is a fascinating place."
    ]
  },
  {
    regex: /\b(lol|lmao|haha|funny)\b/i,
    responses: [
      "Glad I could make you smile!",
      "Humor is a great way to learn.",
      "Haha!",
      "I'm here all week! Try asking for a joke."
    ]
  },

  // --- AGREEMENT / DISAGREEMENT (Most Generic) ---
  {
    regex: /\b(yes|yeah|yep|sure|ok|okay|correct|right)\b/i,
    responses: [
      "Great!",
      "Understood.",
      "Glad we agree.",
      "Noted."
    ]
  },
  {
    regex: /\b(no|nope|nah|incorrect|wrong)\b/i,
    responses: [
      "Oh, my apologies. Could you clarify?",
      "I see. Let me know what you mean.",
      "My mistake. What is the correct information?",
      "Understood. Moving on."
    ]
  }
];
