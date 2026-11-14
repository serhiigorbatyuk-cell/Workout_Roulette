import { useI18n, type Lang } from "@/i18n";

export interface FeatureText {
  builder: {
    open: string;
    title: string;
    subtitle: string;
    addHint: string;
    selected: string;
    empty: string;
    savePlaceholder: string;
    save: string;
    savedTitle: string;
    savedEmpty: string;
    start: string;
    nameRequired: string;
    minOne: string;
    delete: string;
    moveUp: string;
    moveDown: string;
    remove: string;
    savedToast: string;
    close: string;
    allAdded: string;
  };
  sounds: {
    toggle: string;
    on: string;
    off: string;
  };
  result: {
    title: string;
    subtitle: string;
    exercises: string;
    duration: string;
    share: string;
    copy: string;
    copied: string;
    close: string;
    again: string;
  };
  calendar: {
    title: string;
    subtitle: string;
    week: string;
    month: string;
    workouts: string;
    minutes: string;
    noData: string;
    today: string;
    dayDetails: string;
    emptyDay: string;
    prev: string;
    next: string;
  };
  quotes: {
    title: string;
    next: string;
    list: string[];
  };
  rest: {
    pause: string;
    resume: string;
    skip: string;
  };
  favorites: {
    title: string;
    subtitle: string;
    empty: string;
    start: string;
    add: string;
    remove: string;
    clear: string;
  };
  demo: {
    open: string;
    title: string;
    close: string;
    stepsTitle: string;
    done: string;
  };
}

const uk: FeatureText = {
  builder: {
    open: "Конструктор тренувань",
    title: "Конструктор тренувань",
    subtitle: "Вибери вправи, зміни порядок і збережи власне тренування",
    addHint: "Додай вправу",
    selected: "Твоє тренування",
    empty: "Ще жодної вправи. Додай хоча б одну зі списку.",
    savePlaceholder: "Назва тренування",
    save: "Зберегти",
    savedTitle: "Мої тренування",
    savedEmpty: "Збережені тренування з'являться тут",
    start: "Почати тренування",
    nameRequired: "Введи назву тренування",
    minOne: "Додай хоча б одну вправу",
    delete: "Видалити",
    moveUp: "Вгору",
    moveDown: "Вниз",
    remove: "Прибрати",
    savedToast: "Збережено",
    close: "Закрити",
    allAdded: "Усі вправи вже додані",
  },
  sounds: {
    toggle: "Звукові ефекти",
    on: "увімкнено",
    off: "вимкнено",
  },
  result: {
    title: "Тренування завершено!",
    subtitle: "Чудова робота. Ось твій результат:",
    exercises: "вправ",
    duration: "тривалість",
    share: "Поділитися",
    copy: "Копіювати",
    copied: "Скопійовано",
    close: "Закрити",
    again: "Ще тренування",
  },
  calendar: {
    title: "Календар активності",
    subtitle: "Твої тренування по днях",
    week: "Цей тиждень",
    month: "Обраний місяць",
    workouts: "тренувань",
    minutes: "хвилин",
    noData: "Почни тренуватися — і тут з'являться позначки",
    today: "Сьогодні",
    dayDetails: "Деталі дня",
    emptyDay: "Цього дня тренувань не було",
    prev: "Попередній місяць",
    next: "Наступний місяць",
  },
  quotes: {
    title: "Мотивація дня",
    next: "Наступна цитата",
    list: [
      "Тіло може все — треба лише переконати голову.",
      "Маленький крок сьогодні кращий за ідеальний план завтра.",
      "Ти не мусиш бути найкращим. Ти мусиш бути кращим, ніж учора.",
      "Дисципліна — це вибір між тим, чого хочеш зараз, і тим, чого хочеш найбільше.",
      "Кожне тренування — це інвестиція в себе. Дивіденди прийдуть.",
      "Не зупиняйся, коли втомився. Зупиняйся, коли закінчив.",
    ],
  },
  rest: {
    pause: "Пауза",
    resume: "Продовжити",
    skip: "Пропустити",
  },
  favorites: {
    title: "Обране",
    subtitle: "Вправи, які ти зберіг",
    empty: "Натискай сердечко на вправі, щоб зберегти її тут",
    start: "Тренувати обране",
    add: "Додати в обране",
    remove: "Прибрати з обраного",
    clear: "Очистити обране",
  },
  demo: {
    open: "Як виконувати?",
    title: "Техніка виконання",
    close: "Закрити",
    stepsTitle: "Покроково",
    done: "Зрозуміло",
  },
};

const en: FeatureText = {
  builder: {
    open: "Workout builder",
    title: "Workout builder",
    subtitle: "Pick exercises, reorder them and save your own workout",
    addHint: "Add an exercise",
    selected: "Your workout",
    empty: "No exercises yet. Add at least one from the list.",
    savePlaceholder: "Workout name",
    save: "Save",
    savedTitle: "My workouts",
    savedEmpty: "Saved workouts will appear here",
    start: "Start workout",
    nameRequired: "Enter a workout name",
    minOne: "Add at least one exercise",
    delete: "Delete",
    moveUp: "Move up",
    moveDown: "Move down",
    remove: "Remove",
    savedToast: "Saved",
    close: "Close",
    allAdded: "All exercises are already added",
  },
  sounds: {
    toggle: "Sound effects",
    on: "on",
    off: "off",
  },
  result: {
    title: "Workout complete!",
    subtitle: "Great job. Here is your result:",
    exercises: "exercises",
    duration: "duration",
    share: "Share",
    copy: "Copy",
    copied: "Copied",
    close: "Close",
    again: "Another workout",
  },
  calendar: {
    title: "Activity calendar",
    subtitle: "Your workouts day by day",
    week: "This week",
    month: "Selected month",
    workouts: "workouts",
    minutes: "minutes",
    noData: "Start training and your marks will appear here",
    today: "Today",
    dayDetails: "Day details",
    emptyDay: "No workout on this day",
    prev: "Previous month",
    next: "Next month",
  },
  quotes: {
    title: "Motivation of the day",
    next: "Next quote",
    list: [
      "Your body can do it — you just have to convince your mind.",
      "A small step today beats a perfect plan tomorrow.",
      "You don't have to be the best. You have to be better than yesterday.",
      "Discipline is choosing between what you want now and what you want most.",
      "Every workout is an investment in yourself. The dividends will come.",
      "Don't stop when you're tired. Stop when you're done.",
    ],
  },
  rest: {
    pause: "Pause",
    resume: "Resume",
    skip: "Skip",
  },
  favorites: {
    title: "Favorites",
    subtitle: "Exercises you saved",
    empty: "Tap the heart on an exercise to save it here",
    start: "Train favorites",
    add: "Add to favorites",
    remove: "Remove from favorites",
    clear: "Clear favorites",
  },
  demo: {
    open: "How to do it?",
    title: "Exercise technique",
    close: "Close",
    stepsTitle: "Step by step",
    done: "Got it",
  },
};

const pl: FeatureText = {
  builder: {
    open: "Kreator treningu",
    title: "Kreator treningu",
    subtitle: "Wybierz ćwiczenia, zmień kolejność i zapisz własny trening",
    addHint: "Dodaj ćwiczenie",
    selected: "Twój trening",
    empty: "Nie ma jeszcze ćwiczeń. Dodaj przynajmniej jedno z listy.",
    savePlaceholder: "Nazwa treningu",
    save: "Zapisz",
    savedTitle: "Moje treningi",
    savedEmpty: "Zapisane treningi pojawią się tutaj",
    start: "Rozpocznij trening",
    nameRequired: "Podaj nazwę treningu",
    minOne: "Dodaj przynajmniej jedno ćwiczenie",
    delete: "Usuń",
    moveUp: "W górę",
    moveDown: "W dół",
    remove: "Usuń",
    savedToast: "Zapisano",
    close: "Zamknij",
    allAdded: "Wszystkie ćwiczenia są już dodane",
  },
  sounds: {
    toggle: "Efekty dźwiękowe",
    on: "włączone",
    off: "wyłączone",
  },
  result: {
    title: "Trening ukończony!",
    subtitle: "Świetna robota. Oto twój wynik:",
    exercises: "ćwiczeń",
    duration: "czas",
    share: "Udostępnij",
    copy: "Kopiuj",
    copied: "Skopiowano",
    close: "Zamknij",
    again: "Kolejny trening",
  },
  calendar: {
    title: "Kalendarz aktywności",
    subtitle: "Twoje treningi dzień po dniu",
    week: "Ten tydzień",
    month: "Wybrany miesiąc",
    workouts: "treningów",
    minutes: "minut",
    noData: "Zacznij trenować — a oznaczenia pojawią się tutaj",
    today: "Dzisiaj",
    dayDetails: "Szczegóły dnia",
    emptyDay: "Tego dnia nie było treningu",
    prev: "Poprzedni miesiąc",
    next: "Następny miesiąc",
  },
  quotes: {
    title: "Motywacja dnia",
    next: "Następny cytat",
    list: [
      "Twoje ciało potrafi — musisz tylko przekonać głowę.",
      "Mały krok dziś jest lepszy niż idealny plan jutro.",
      "Nie musisz być najlepszy. Musisz być lepszy niż wczoraj.",
      "Dyscyplina to wybór między tym, czego chcesz teraz, a tym, czego chcesz najbardziej.",
      "Każdy trening to inwestycja w siebie. Dywidendy przyjdą.",
      "Nie zatrzymuj się, gdy jesteś zmęczony. Zatrzymaj się, gdy skończysz.",
    ],
  },
  rest: {
    pause: "Pauza",
    resume: "Wznów",
    skip: "Pomiń",
  },
  favorites: {
    title: "Ulubione",
    subtitle: "Ćwiczenia, które zapisałeś",
    empty: "Dotknij serca przy ćwiczeniu, aby zapisać je tutaj",
    start: "Trenuj ulubione",
    add: "Dodaj do ulubionych",
    remove: "Usuń z ulubionych",
    clear: "Wyczyść ulubione",
  },
  demo: {
    open: "Jak wykonać?",
    title: "Technika ćwiczenia",
    close: "Zamknij",
    stepsTitle: "Krok po kroku",
    done: "Rozumiem",
  },
};

const de: FeatureText = {
  builder: {
    open: "Trainingsplaner",
    title: "Trainingsplaner",
    subtitle: "Wähle Übungen, ändere die Reihenfolge und speichere dein Training",
    addHint: "Übung hinzufügen",
    selected: "Dein Training",
    empty: "Noch keine Übungen. Füge mindestens eine aus der Liste hinzu.",
    savePlaceholder: "Name des Trainings",
    save: "Speichern",
    savedTitle: "Meine Trainings",
    savedEmpty: "Gespeicherte Trainings erscheinen hier",
    start: "Training starten",
    nameRequired: "Gib einen Namen für das Training ein",
    minOne: "Füge mindestens eine Übung hinzu",
    delete: "Löschen",
    moveUp: "Nach oben",
    moveDown: "Nach unten",
    remove: "Entfernen",
    savedToast: "Gespeichert",
    close: "Schließen",
    allAdded: "Alle Übungen sind bereits hinzugefügt",
  },
  sounds: {
    toggle: "Soundeffekte",
    on: "an",
    off: "aus",
  },
  result: {
    title: "Training abgeschlossen!",
    subtitle: "Großartig. Hier ist dein Ergebnis:",
    exercises: "Übungen",
    duration: "Dauer",
    share: "Teilen",
    copy: "Kopieren",
    copied: "Kopiert",
    close: "Schließen",
    again: "Noch ein Training",
  },
  calendar: {
    title: "Aktivitätskalender",
    subtitle: "Deine Trainings Tag für Tag",
    week: "Diese Woche",
    month: "Ausgewählter Monat",
    workouts: "Trainings",
    minutes: "Minuten",
    noData: "Beginne zu trainieren — dann erscheinen hier Markierungen",
    today: "Heute",
    dayDetails: "Tagesdetails",
    emptyDay: "An diesem Tag kein Training",
    prev: "Vorheriger Monat",
    next: "Nächster Monat",
  },
  quotes: {
    title: "Motivation des Tages",
    next: "Nächstes Zitat",
    list: [
      "Dein Körper kann es — du musst nur deinen Kopf überzeugen.",
      "Ein kleiner Schritt heute ist besser als ein perfekter Plan morgen.",
      "Du musst nicht der Beste sein. Du musst besser sein als gestern.",
      "Disziplin heißt, zwischen dem zu wählen, was du jetzt willst, und dem, was du am meisten willst.",
      "Jedes Training ist eine Investition in dich. Die Zinsen kommen.",
      "Hör nicht auf, wenn du müde bist. Hör auf, wenn du fertig bist.",
    ],
  },
  rest: {
    pause: "Pause",
    resume: "Fortsetzen",
    skip: "Überspringen",
  },
  favorites: {
    title: "Favoriten",
    subtitle: "Übungen, die du gespeichert hast",
    empty: "Tippe auf das Herz einer Übung, um sie hier zu speichern",
    start: "Favoriten trainieren",
    add: "Zu Favoriten hinzufügen",
    remove: "Aus Favoriten entfernen",
    clear: "Favoriten leeren",
  },
  demo: {
    open: "Wie geht das?",
    title: "Übungstechnik",
    close: "Schließen",
    stepsTitle: "Schritt für Schritt",
    done: "Verstanden",
  },
};

const es: FeatureText = {
  builder: {
    open: "Creador de entrenamientos",
    title: "Creador de entrenamientos",
    subtitle: "Elige ejercicios, cambia el orden y guarda tu propio entrenamiento",
    addHint: "Añadir ejercicio",
    selected: "Tu entrenamiento",
    empty: "Aún no hay ejercicios. Añade al menos uno de la lista.",
    savePlaceholder: "Nombre del entrenamiento",
    save: "Guardar",
    savedTitle: "Mis entrenamientos",
    savedEmpty: "Los entrenamientos guardados aparecerán aquí",
    start: "Empezar entrenamiento",
    nameRequired: "Escribe un nombre para el entrenamiento",
    minOne: "Añade al menos un ejercicio",
    delete: "Eliminar",
    moveUp: "Subir",
    moveDown: "Bajar",
    remove: "Quitar",
    savedToast: "Guardado",
    close: "Cerrar",
    allAdded: "Todos los ejercicios ya están añadidos",
  },
  sounds: {
    toggle: "Efectos de sonido",
    on: "activado",
    off: "desactivado",
  },
  result: {
    title: "¡Entrenamiento completado!",
    subtitle: "Buen trabajo. Este es tu resultado:",
    exercises: "ejercicios",
    duration: "duración",
    share: "Compartir",
    copy: "Copiar",
    copied: "Copiado",
    close: "Cerrar",
    again: "Otro entrenamiento",
  },
  calendar: {
    title: "Calendario de actividad",
    subtitle: "Tus entrenamientos día a día",
    week: "Esta semana",
    month: "Mes seleccionado",
    workouts: "entrenamientos",
    minutes: "minutos",
    noData: "Empieza a entrenar y aquí aparecerán las marcas",
    today: "Hoy",
    dayDetails: "Detalles del día",
    emptyDay: "Este día no hubo entrenamiento",
    prev: "Mes anterior",
    next: "Mes siguiente",
  },
  quotes: {
    title: "Motivación del día",
    next: "Siguiente frase",
    list: [
      "Tu cuerpo puede — solo tienes que convencer a tu mente.",
      "Un pequeño paso hoy vale más que un plan perfecto mañana.",
      "No tienes que ser el mejor. Tienes que ser mejor que ayer.",
      "La disciplina es elegir entre lo que quieres ahora y lo que más quieres.",
      "Cada entrenamiento es una inversión en ti. Los resultados llegarán.",
      "No pares cuando estés cansado. Para cuando termines.",
    ],
  },
  rest: {
    pause: "Pausa",
    resume: "Continuar",
    skip: "Saltar",
  },
  favorites: {
    title: "Favoritos",
    subtitle: "Ejercicios que guardaste",
    empty: "Toca el corazón de un ejercicio para guardarlo aquí",
    start: "Entrenar favoritos",
    add: "Añadir a favoritos",
    remove: "Quitar de favoritos",
    clear: "Vaciar favoritos",
  },
  demo: {
    open: "¿Cómo se hace?",
    title: "Técnica del ejercicio",
    close: "Cerrar",
    stepsTitle: "Paso a paso",
    done: "Entendido",
  },
};

const fr: FeatureText = {
  builder: {
    open: "Créateur d'entraînement",
    title: "Créateur d'entraînement",
    subtitle: "Choisis des exercices, change l'ordre et enregistre ton entraînement",
    addHint: "Ajouter un exercice",
    selected: "Ton entraînement",
    empty: "Pas encore d'exercices. Ajoute-en au moins un de la liste.",
    savePlaceholder: "Nom de l'entraînement",
    save: "Enregistrer",
    savedTitle: "Mes entraînements",
    savedEmpty: "Les entraînements enregistrés apparaîtront ici",
    start: "Commencer l'entraînement",
    nameRequired: "Saisis un nom pour l'entraînement",
    minOne: "Ajoute au moins un exercice",
    delete: "Supprimer",
    moveUp: "Monter",
    moveDown: "Descendre",
    remove: "Retirer",
    savedToast: "Enregistré",
    close: "Fermer",
    allAdded: "Tous les exercices sont déjà ajoutés",
  },
  sounds: {
    toggle: "Effets sonores",
    on: "activés",
    off: "désactivés",
  },
  result: {
    title: "Entraînement terminé !",
    subtitle: "Beau travail. Voici ton résultat :",
    exercises: "exercices",
    duration: "durée",
    share: "Partager",
    copy: "Copier",
    copied: "Copié",
    close: "Fermer",
    again: "Un autre entraînement",
  },
  calendar: {
    title: "Calendrier d'activité",
    subtitle: "Tes entraînements jour après jour",
    week: "Cette semaine",
    month: "Mois sélectionné",
    workouts: "entraînements",
    minutes: "minutes",
    noData: "Commence à t'entraîner et les marques apparaîtront ici",
    today: "Aujourd'hui",
    dayDetails: "Détails du jour",
    emptyDay: "Aucun entraînement ce jour-là",
    prev: "Mois précédent",
    next: "Mois suivant",
  },
  quotes: {
    title: "Motivation du jour",
    next: "Citation suivante",
    list: [
      "Ton corps peut le faire — il suffit de convaincre ta tête.",
      "Un petit pas aujourd'hui vaut mieux qu'un plan parfait demain.",
      "Tu n'as pas besoin d'être le meilleur. Tu dois être meilleur qu'hier.",
      "La discipline, c'est choisir entre ce que tu veux maintenant et ce que tu veux le plus.",
      "Chaque entraînement est un investissement en toi. Les résultats viendront.",
      "Ne t'arrête pas quand tu es fatigué. Arrête-toi quand tu as fini.",
    ],
  },
  rest: {
    pause: "Pause",
    resume: "Reprendre",
    skip: "Passer",
  },
  favorites: {
    title: "Favoris",
    subtitle: "Les exercices que tu as enregistrés",
    empty: "Touche le cœur d'un exercice pour l'enregistrer ici",
    start: "Entraîner les favoris",
    add: "Ajouter aux favoris",
    remove: "Retirer des favoris",
    clear: "Vider les favoris",
  },
  demo: {
    open: "Comment faire ?",
    title: "Technique de l'exercice",
    close: "Fermer",
    stepsTitle: "Étape par étape",
    done: "Compris",
  },
};

const FEATURE_DICTIONARIES: Record<Lang, FeatureText> = {
  uk,
  en,
  pl,
  de,
  es,
  fr,
};

export function getFeatureText(lang: Lang): FeatureText {
  return FEATURE_DICTIONARIES[lang];
}

export function useFeatureText(): FeatureText {
  const { lang } = useI18n();
  return FEATURE_DICTIONARIES[lang];
}
