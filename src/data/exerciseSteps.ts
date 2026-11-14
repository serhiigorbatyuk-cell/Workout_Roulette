import type { ExerciseId } from "@/data/exercises";
import type { Lang } from "@/i18n";

export interface ExerciseDemoSteps {
  steps: [string, string, string];
}

type StepsByExercise = Record<ExerciseId, ExerciseDemoSteps>;

const uk: StepsByExercise = {
  squats: {
    steps: [
      "Стань рівно, стопи на ширині плечей, шкарпетки трохи назовні.",
      "Опускай таз назад і вниз, наче сідаєш на стілець, коліна йдуть за носками.",
      "Коли стегна стануть паралельні підлозі, впевнено піднімися вгору.",
    ],
  },
  plank: {
    steps: [
      "Ляж на живіт і спирайся на передпліччя під плечима.",
      "Підніми тіло в одну лінію від голови до п'ят.",
      "Напруж живіт і сідниці, дихай рівно.",
    ],
  },
  pushups: {
    steps: [
      "Прийми упор лежачи, долоні трохи ширші за плечі.",
      "Згинай лікті під кутом 45°, опускай груди до підлоги.",
      "Витисни тіло вгору, зберігаючи пряму лінію.",
    ],
  },
  jumpingJacks: {
    steps: [
      "Стань рівно, руки вздовж тіла.",
      "Стрибком розведи ноги й підніми руки над головою.",
      "Стрибком повернися у вихідне положення.",
    ],
  },
  lunges: {
    steps: [
      "Зроби крок вперед однією ногою.",
      "Опускайся, поки обидва коліна не зігнуться до 90°.",
      "Відштовхнися передньою п'ятою і повернися назад.",
    ],
  },
  highKnees: {
    steps: [
      "Стань рівно, руки зігнуті в ліктях.",
      "Біжи на місці, піднімаючи коліна до рівня грудей.",
      "Тримай швидкий, але контрольований темп.",
    ],
  },
  crunches: {
    steps: [
      "Ляж на спину, коліна зігнуті, стопи на підлозі.",
      "Руки за головою або на грудях, підборіддя трохи підняте.",
      "Напруж живіт і підніми лопатки над підлогою.",
    ],
  },
  gluteBridge: {
    steps: [
      "Ляж на спину, коліна зігнуті, стопи на підлозі.",
      "Напруж сідниці й підніми таз вгору.",
      "Затримайся на секунду і повільно опустися.",
    ],
  },
  burpees: {
    steps: [
      "З присіду постав долоні на підлогу.",
      "Стрибком вийди в планку, за бажанням зроби віджимання.",
      "Стрибком поверни ноги до рук і вистрибни вгору.",
    ],
  },
  mountainClimbers: {
    steps: [
      "Прийми планку на передпліччях.",
      "По черзі підтягуй коліна до грудей.",
      "Тримай таз стабільно й рухайся в ритмі.",
    ],
  },
  abPulses: {
    steps: [
      "Ляж на спину, ноги зігнуті, поперек притиснутий до підлоги.",
      "Трохи підніми лопатки й тягнися руками до стоп.",
      "Роби короткі пульсації вгору-вниз.",
    ],
  },
  jumpSquats: {
    steps: [
      "Стань у присідання, стопи на ширині плечей.",
      "Вистрибни вгору, повністю випрямивши ноги.",
      "М'яко приземлися й одразу повтори.",
    ],
  },
  superman: {
    steps: [
      "Ляж на живіт, руки витягнуті вперед.",
      "Одночасно підніми руки, груди й ноги.",
      "Затримайся на секунду й повільно опустися.",
    ],
  },
  climbers: {
    steps: [
      "Прийми упор лежачи на прямих руках.",
      "По черзі підтягуй коліна до грудей.",
      "Тримай плечі над долонями й рухайся швидко.",
    ],
  },
  tPushups: {
    steps: [
      "Прийми упор лежачи, долоні під плечима.",
      "Зроби віджимання, опускаючи груди до підлоги.",
      "У верхній точці поверни тіло вбік і підніми руку вгору.",
    ],
  },
};

const en: StepsByExercise = {
  squats: {
    steps: [
      "Stand tall with feet shoulder-width apart and toes slightly out.",
      "Push your hips back and down as if sitting on a chair, knees following your toes.",
      "When your thighs are parallel to the floor, drive up confidently.",
    ],
  },
  plank: {
    steps: [
      "Lie on your stomach and rest on your forearms under your shoulders.",
      "Lift your body into one straight line from head to heels.",
      "Brace your abs and glutes, and breathe steadily.",
    ],
  },
  pushups: {
    steps: [
      "Get into a push-up position with hands slightly wider than your shoulders.",
      "Bend your elbows at about 45° and lower your chest toward the floor.",
      "Press your body back up while keeping a straight line.",
    ],
  },
  jumpingJacks: {
    steps: [
      "Stand tall with your arms by your sides.",
      "Jump your feet apart and raise your arms overhead.",
      "Jump back to the starting position.",
    ],
  },
  lunges: {
    steps: [
      "Step forward with one leg.",
      "Lower until both knees are bent to about 90°.",
      "Push through the front heel and return to standing.",
    ],
  },
  highKnees: {
    steps: [
      "Stand tall with your elbows bent.",
      "Run in place, driving your knees up to chest height.",
      "Keep a fast but controlled rhythm.",
    ],
  },
  crunches: {
    steps: [
      "Lie on your back with knees bent and feet on the floor.",
      "Put your hands behind your head or on your chest, chin slightly up.",
      "Tighten your abs and lift your shoulder blades off the floor.",
    ],
  },
  gluteBridge: {
    steps: [
      "Lie on your back with knees bent and feet on the floor.",
      "Squeeze your glutes and lift your hips upward.",
      "Hold for a second, then lower slowly.",
    ],
  },
  burpees: {
    steps: [
      "From a squat, place your palms on the floor.",
      "Jump your feet back into a plank and add a push-up if you like.",
      "Jump your feet back to your hands and leap up.",
    ],
  },
  mountainClimbers: {
    steps: [
      "Get into a forearm plank.",
      "Drive your knees toward your chest one at a time.",
      "Keep your hips stable and move rhythmically.",
    ],
  },
  abPulses: {
    steps: [
      "Lie on your back with knees bent and lower back pressed down.",
      "Lift your shoulder blades slightly and reach toward your feet.",
      "Pulse up and down with small movements.",
    ],
  },
  jumpSquats: {
    steps: [
      "Start in a squat with feet shoulder-width apart.",
      "Jump up, fully extending your legs.",
      "Land softly and repeat right away.",
    ],
  },
  superman: {
    steps: [
      "Lie on your stomach with arms stretched forward.",
      "Lift your arms, chest and legs at the same time.",
      "Hold for a second, then lower slowly.",
    ],
  },
  climbers: {
    steps: [
      "Get into a high plank on straight arms.",
      "Drive your knees toward your chest one at a time.",
      "Keep your shoulders over your hands and move fast.",
    ],
  },
  tPushups: {
    steps: [
      "Get into a push-up position with hands under your shoulders.",
      "Lower your chest toward the floor.",
      "At the top, rotate your torso and raise one arm up.",
    ],
  },
};

const pl: StepsByExercise = {
  squats: {
    steps: [
      "Stań prosto, stopy na szerokość barków, palce lekko na zewnątrz.",
      "Odpychaj biodra do tyłu i w dół, jakbyś siadał na krześle; kolana idą za palcami.",
      "Gdy uda będą równolegle do podłogi, pewnie wstań.",
    ],
  },
  plank: {
    steps: [
      "Połóż się na brzuchu i oprzyj się na przedramionach pod barkami.",
      "Unieś ciało w jedną linię od głowy do pięt.",
      "Napnij brzuch i pośladki, oddychaj równo.",
    ],
  },
  pushups: {
    steps: [
      "Przyjmij pozycję do pompek, dłonie nieco szerzej niż barki.",
      "Ugnij łokcie pod kątem 45° i opuść klatkę do podłogi.",
      "Wypchnij ciało w górę, utrzymując prostą linię.",
    ],
  },
  jumpingJacks: {
    steps: [
      "Stań prosto, ręce wzdłuż ciała.",
      "Skocz, rozstaw nogi i unieś ręce nad głowę.",
      "Skocz z powrotem do pozycji wyjściowej.",
    ],
  },
  lunges: {
    steps: [
      "Zrób krok do przodu jedną nogą.",
      "Opuść się, aż oba kolana ugną się do około 90°.",
      "Odepchnij się przednią piętą i wróć do stania.",
    ],
  },
  highKnees: {
    steps: [
      "Stań prosto, łokcie ugięte.",
      "Biegnij w miejscu, unosząc kolana do wysokości klatki.",
      "Utrzymuj szybkie, ale kontrolowane tempo.",
    ],
  },
  crunches: {
    steps: [
      "Połóż się na plecach, kolana ugięte, stopy na podłodze.",
      "Ręce za głową lub na klatce, broda lekko uniesiona.",
      "Napnij brzuch i unieś łopatki nad podłogę.",
    ],
  },
  gluteBridge: {
    steps: [
      "Połóż się na plecach, kolana ugięte, stopy na podłodze.",
      "Napnij pośladki i unieś biodra w górę.",
      "Wytrzymaj sekundę i powoli opuść.",
    ],
  },
  burpees: {
    steps: [
      "Z przysiadu postaw dłonie na podłodze.",
      "Skocz stopami do planku i w razie potrzeby zrób pompkę.",
      "Skocz stopami do dłoni i wyskocz w górę.",
    ],
  },
  mountainClimbers: {
    steps: [
      "Przyjmij deskę na przedramionach.",
      "Naprzemiennie przyciągaj kolana do klatki.",
      "Utrzymuj stabilne biodra i rytmiczny ruch.",
    ],
  },
  abPulses: {
    steps: [
      "Połóż się na plecach, kolana ugięte, lędźwie dociśnięte do podłogi.",
      "Lekko unieś łopatki i sięgaj rękami do stóp.",
      "Wykonuj krótkie pulsacje w górę i w dół.",
    ],
  },
  jumpSquats: {
    steps: [
      "Zacznij w przysiadzie, stopy na szerokość barków.",
      "Wyskocz w górę, prostując nogi.",
      "Wyląduj miękko i od razu powtórz.",
    ],
  },
  superman: {
    steps: [
      "Połóż się na brzuchu, ręce wyciągnięte do przodu.",
      "Jednocześnie unieś ręce, klatkę i nogi.",
      "Wytrzymaj sekundę i powoli opuść.",
    ],
  },
  climbers: {
    steps: [
      "Przyjmij deskę na prostych rękach.",
      "Naprzemiennie przyciągaj kolana do klatki.",
      "Trzymaj barki nad dłońmi i ruszaj się szybko.",
    ],
  },
  tPushups: {
    steps: [
      "Przyjmij pozycję do pompek, dłonie pod barkami.",
      "Opuść klatkę do podłogi.",
      "W górze obróć tułów i unieś jedną rękę.",
    ],
  },
};

const de: StepsByExercise = {
  squats: {
    steps: [
      "Steh aufrecht, Füße schulterbreit, Zehen leicht nach außen.",
      "Schiebe die Hüfte nach hinten und unten, als würdest du dich auf einen Stuhl setzen; die Knie folgen den Zehen.",
      "Wenn die Oberschenkel parallel zum Boden sind, drück dich kraftvoll hoch.",
    ],
  },
  plank: {
    steps: [
      "Leg dich auf den Bauch und stütze dich auf den Unterarmen unter den Schultern ab.",
      "Hebe den Körper in eine gerade Linie von Kopf bis Fersen.",
      "Spanne Bauch und Gesäß an und atme gleichmäßig.",
    ],
  },
  pushups: {
    steps: [
      "Geh in die Liegestützposition, Hände etwas breiter als die Schultern.",
      "Beuge die Ellbogen etwa 45° und senke die Brust zum Boden.",
      "Drück den Körper wieder hoch und halte die gerade Linie.",
    ],
  },
  jumpingJacks: {
    steps: [
      "Steh aufrecht, Arme seitlich am Körper.",
      "Springe die Beine auseinander und hebe die Arme über den Kopf.",
      "Springe zurück in die Ausgangsposition.",
    ],
  },
  lunges: {
    steps: [
      "Mach einen Schritt nach vorn mit einem Bein.",
      "Senke dich, bis beide Knie etwa 90° gebeugt sind.",
      "Drück dich über die vordere Ferse hoch und komm zurück.",
    ],
  },
  highKnees: {
    steps: [
      "Steh aufrecht, Ellbogen gebeugt.",
      "Lauf auf der Stelle und zieh die Knie bis zur Brusthöhe hoch.",
      "Halte ein schnelles, aber kontrolliertes Tempo.",
    ],
  },
  crunches: {
    steps: [
      "Leg dich auf den Rücken, Knie gebeugt, Füße am Boden.",
      "Hände hinter dem Kopf oder auf der Brust, Kinn leicht angehoben.",
      "Spanne den Bauch an und hebe die Schulterblätter vom Boden.",
    ],
  },
  gluteBridge: {
    steps: [
      "Leg dich auf den Rücken, Knie gebeugt, Füße am Boden.",
      "Spanne das Gesäß an und hebe die Hüfte nach oben.",
      "Halte kurz und senke langsam ab.",
    ],
  },
  burpees: {
    steps: [
      "Setz dich in die Hocke und leg die Handflächen auf den Boden.",
      "Spring mit den Füßen in den Plank und mach optional einen Liegestütz.",
      "Spring mit den Füßen zu den Händen zurück und hoch.",
    ],
  },
  mountainClimbers: {
    steps: [
      "Geh in den Unterarmplank.",
      "Zieh abwechselnd die Knie zur Brust.",
      "Halte die Hüfte stabil und bewege dich rhythmisch.",
    ],
  },
  abPulses: {
    steps: [
      "Leg dich auf den Rücken, Knie gebeugt, unterer Rücken am Boden.",
      "Hebe die Schulterblätter leicht an und greif zu den Füßen.",
      "Mach kleine Auf- und Ab-Pulsbewegungen.",
    ],
  },
  jumpSquats: {
    steps: [
      "Starte in der Hocke, Füße schulterbreit.",
      "Spring hoch und strecke die Beine vollständig.",
      "Lande weich und wiederhole sofort.",
    ],
  },
  superman: {
    steps: [
      "Leg dich auf den Bauch, Arme nach vorn gestreckt.",
      "Hebe Arme, Brust und Beine gleichzeitig an.",
      "Halte kurz und senke langsam ab.",
    ],
  },
  climbers: {
    steps: [
      "Geh in den Plank auf gestreckten Armen.",
      "Zieh abwechselnd die Knie zur Brust.",
      "Halte die Schultern über den Händen und werde schnell.",
    ],
  },
  tPushups: {
    steps: [
      "Geh in die Liegestützposition, Hände unter den Schultern.",
      "Senke die Brust zum Boden.",
      "Dreh dich oben zur Seite und hebe einen Arm.",
    ],
  },
};

const es: StepsByExercise = {
  squats: {
    steps: [
      "Ponte erguido con los pies a la anchura de los hombros y las puntas ligeramente hacia fuera.",
      "Lleva la cadera hacia atrás y abajo como si te sentaras en una silla; las rodillas siguen a los pies.",
      "Cuando los muslos estén paralelos al suelo, sube con fuerza.",
    ],
  },
  plank: {
    steps: [
      "Túmbate boca abajo y apóyate en los antebrazos bajo los hombros.",
      "Eleva el cuerpo en una línea recta desde la cabeza hasta los talones.",
      "Aprieta el abdomen y los glúteos y respira con calma.",
    ],
  },
  pushups: {
    steps: [
      "Colócate en posición de flexión, con las manos algo más anchas que los hombros.",
      "Flexiona los codos unos 45° y baja el pecho hacia el suelo.",
      "Empuja el cuerpo hacia arriba manteniendo la línea recta.",
    ],
  },
  jumpingJacks: {
    steps: [
      "Ponte erguido con los brazos a los lados.",
      "Salta abriendo las piernas y levanta los brazos por encima de la cabeza.",
      "Salta de vuelta a la posición inicial.",
    ],
  },
  lunges: {
    steps: [
      "Da un paso adelante con una pierna.",
      "Baja hasta que ambas rodillas se doblen unos 90°.",
      "Empuja con el talón delantero y vuelve a ponerte de pie.",
    ],
  },
  highKnees: {
    steps: [
      "Ponte erguido con los codos flexionados.",
      "Corre en el sitio llevando las rodillas a la altura del pecho.",
      "Mantén un ritmo rápido pero controlado.",
    ],
  },
  crunches: {
    steps: [
      "Túmbate boca arriba con las rodillas flexionadas y los pies en el suelo.",
      "Manos detrás de la cabeza o sobre el pecho, barbilla ligeramente arriba.",
      "Aprieta el abdomen y levanta los omóplatos del suelo.",
    ],
  },
  gluteBridge: {
    steps: [
      "Túmbate boca arriba con las rodillas flexionadas y los pies en el suelo.",
      "Aprieta los glúteos y eleva la cadera.",
      "Mantén un segundo y baja despacio.",
    ],
  },
  burpees: {
    steps: [
      "Desde una sentadilla, apoya las palmas en el suelo.",
      "Salta con los pies a la plancha y haz una flexión si quieres.",
      "Salta con los pies hacia las manos y salta hacia arriba.",
    ],
  },
  mountainClimbers: {
    steps: [
      "Colócate en plancha sobre antebrazos.",
      "Lleva las rodillas al pecho de forma alterna.",
      "Mantén la cadera estable y muévete con ritmo.",
    ],
  },
  abPulses: {
    steps: [
      "Túmbate boca arriba con las rodillas flexionadas y la zona lumbar pegada al suelo.",
      "Eleva un poco los omóplatos y lleva las manos hacia los pies.",
      "Haz pequeños pulsos hacia arriba y abajo.",
    ],
  },
  jumpSquats: {
    steps: [
      "Empieza en sentadilla con los pies a la anchura de los hombros.",
      "Salta hacia arriba extendiendo las piernas por completo.",
      "Aterriza suave y repite enseguida.",
    ],
  },
  superman: {
    steps: [
      "Túmbate boca abajo con los brazos estirados hacia delante.",
      "Eleva a la vez los brazos, el pecho y las piernas.",
      "Mantén un segundo y baja despacio.",
    ],
  },
  climbers: {
    steps: [
      "Colócate en plancha alta con los brazos rectos.",
      "Lleva las rodillas al pecho de forma alterna.",
      "Mantén los hombros sobre las manos y muévete rápido.",
    ],
  },
  tPushups: {
    steps: [
      "Colócate en posición de flexión con las manos bajo los hombros.",
      "Baja el pecho hacia el suelo.",
      "Arriba, gira el torso y levanta un brazo.",
    ],
  },
};

const fr: StepsByExercise = {
  squats: {
    steps: [
      "Tiens-toi droit, pieds écartés à la largeur des épaules, pointes légèrement vers l'extérieur.",
      "Pousse les hanches vers l'arrière et le bas comme pour t'asseoir ; les genoux suivent les orteils.",
      "Quand les cuisses sont parallèles au sol, remonte avec énergie.",
    ],
  },
  plank: {
    steps: [
      "Allonge-toi sur le ventre et appuie-toi sur les avant-bras sous les épaules.",
      "Monte le corps en une ligne droite de la tête aux talons.",
      "Contracte les abdos et les fessiers, respire régulièrement.",
    ],
  },
  pushups: {
    steps: [
      "Mets-toi en position de pompe, mains un peu plus larges que les épaules.",
      "Plie les coudes à environ 45° et descends la poitrine vers le sol.",
      "Pousse le corps vers le haut en gardant une ligne droite.",
    ],
  },
  jumpingJacks: {
    steps: [
      "Tiens-toi droit, bras le long du corps.",
      "Saute en écartant les jambes et lève les bras au-dessus de la tête.",
      "Saute pour revenir à la position de départ.",
    ],
  },
  lunges: {
    steps: [
      "Fais un pas en avant avec une jambe.",
      "Descends jusqu'à ce que les deux genoux soient pliés à environ 90°.",
      "Pousse sur le talon avant et reviens debout.",
    ],
  },
  highKnees: {
    steps: [
      "Tiens-toi droit, coudes pliés.",
      "Cours sur place en montant les genoux à hauteur de poitrine.",
      "Garde un rythme rapide mais contrôlé.",
    ],
  },
  crunches: {
    steps: [
      "Allonge-toi sur le dos, genoux pliés, pieds au sol.",
      "Mains derrière la tête ou sur la poitrine, menton légèrement relevé.",
      "Contracte les abdos et décolle les omoplates du sol.",
    ],
  },
  gluteBridge: {
    steps: [
      "Allonge-toi sur le dos, genoux pliés, pieds au sol.",
      "Contracte les fessiers et monte les hanches.",
      "Tiens une seconde puis redescends lentement.",
    ],
  },
  burpees: {
    steps: [
      "Depuis un squat, pose les paumes au sol.",
      "Saute les pieds en planche et ajoute une pompe si tu veux.",
      "Ramène les pieds vers les mains et saute vers le haut.",
    ],
  },
  mountainClimbers: {
    steps: [
      "Mets-toi en planche sur les avant-bras.",
      "Ramène les genoux vers la poitrine en alternance.",
      "Garde le bassin stable et bouge en rythme.",
    ],
  },
  abPulses: {
    steps: [
      "Allonge-toi sur le dos, genoux pliés, bas du dos plaqué au sol.",
      "Décolle légèrement les omoplates et tends les mains vers les pieds.",
      "Fais de petites pulsations vers le haut et le bas.",
    ],
  },
  jumpSquats: {
    steps: [
      "Pars en squat, pieds écartés à la largeur des épaules.",
      "Saute vers le haut en tendant complètement les jambes.",
      "Atterris en douceur et enchaîne tout de suite.",
    ],
  },
  superman: {
    steps: [
      "Allonge-toi sur le ventre, bras tendus devant.",
      "Lève en même temps les bras, la poitrine et les jambes.",
      "Tiens une seconde puis redescends lentement.",
    ],
  },
  climbers: {
    steps: [
      "Mets-toi en planche haute sur bras tendus.",
      "Ramène les genoux vers la poitrine en alternance.",
      "Garde les épaules au-dessus des mains et accélère.",
    ],
  },
  tPushups: {
    steps: [
      "Mets-toi en position de pompe, mains sous les épaules.",
      "Descends la poitrine vers le sol.",
      "En haut, tourne le buste et lève un bras.",
    ],
  },
};

export const EXERCISE_STEPS: Record<Lang, StepsByExercise> = {
  uk,
  en,
  pl,
  de,
  es,
  fr,
};
