import { AcademyLesson } from '../types/market';

export const ACADEMY_LESSONS: AcademyLesson[] = [
  {
    id: 'lesson-1',
    title: '1. Pourquoi le Paper Trading est obligatoire pour débuter',
    subtitle: 'Apprendre à nager dans le grand bassin sans risque de noyade financière',
    duration: '5 min de lecture',
    level: 'Débutant',
    category: 'bases',
    keyTakeaway: 'Le trading avec de l\'argent réel sans avoir testé une stratégie rigoureuse pendant au moins 3 à 6 mois en simulation est la cause n°1 de ruine des débutants.',
    sections: [
      {
        title: 'Le mirage des gains faciles sur les réseaux sociaux',
        content: 'Les réseaux sociaux (TikTok, Instagram, YouTube) regorgent de vidéos montrant de soi-disant gains mirobolants en quelques minutes. La réalité statistique est implacable : plus de 80% des particuliers perdent de l\'argent sur les marchés financiers réels faute d\'expérience et de méthode.',
        warning: 'Méfiez-vous absolument des vendeurs de signaux miracles, des robots automatisés infaillibles et des plateformes qui vous poussent à déposer de l\'argent dès le premier jour.'
      },
      {
        title: 'Les 3 bénéfices majeurs du trading virtuel (Paper Trading)',
        content: 'Le paper trading vous permet : 1) De comprendre comment fonctionne la mécanique des ordres de bourse (au marché, limite, stop). 2) De tester vos hypothèses sans aucune pression psychologique destructrice. 3) De mesurer objectivement votre taux de réussite et votre ratio gain/perte sur plusieurs semaines.',
        tip: 'Traitez votre capital virtuel de 50 000 € avec le même sérieux et la même rigueur que s\'il s\'agissait de vos propres économies.'
      }
    ],
    quiz: {
      question: 'Quelle est la première chose à faire avant d\'envisager d\'investir de l\'argent réel ?',
      options: [
        'Copier aveuglément les signaux d\'un créateur sur Telegram',
        'S\'entraîner en paper trading pendant plusieurs mois et définir un plan de trading',
        'Mettre tout son capital sur une cryptomonnaie volatile pour doubler rapidement',
        'Utiliser un effet de levier x50 pour maximiser ses gains immédiats'
      ],
      correctIndex: 1,
      explanation: 'S\'entraîner en simulation permet d\'acquérir les compétences techniques, la discipline émotionnelle et la rigueur de gestion des risques indispensables sans risquer ses économies.'
    }
  },
  {
    id: 'lesson-2',
    title: '2. Comprendre et lire un Chandelier Japonais (Candlestick)',
    subtitle: 'Déchiffrer la bataille entre acheteurs (taureaux) et vendeurs (ours)',
    duration: '7 min de lecture',
    level: 'Débutant',
    category: 'analyse-technique',
    keyTakeaway: 'Une bougie résume 4 prix cruciaux en une période : l\'Ouverture (Open), le Plus Haut (High), le Plus Bas (Low) et la Clôture (Close) — le fameux OHLC.',
    sections: [
      {
        title: 'Anatomie d\'une bougie verte et d\'une bougie rouge',
        content: 'Une bougie verte (ou blanche) indique que le cours a clôturé plus haut qu\'il n\'a ouvert : les acheteurs ont pris le contrôle. Une bougie rouge indique que le cours a clôturé plus bas que son ouverture : la pression vendeuse l\'a emporté. Le corps représente l\'écart entre ouverture et clôture, tandis que les mèches (ombres) montrent les extrêmes atteints.',
        tip: 'Une longue mèche basse indique un rejet des prix bas : les acheteurs sont intervenus agressivement pour repousser le cours vers le haut (signal de support).'
      },
      {
        title: 'Les figures de base : Marteau et Étoile Filante',
        content: 'Le Marteau (Hammer) possède un petit corps en haut et une longue mèche vers le bas : il apparaît souvent à la fin d\'une baisse et signale un potentiel retournement haussier. L\'Étoile Filante (Shooting Star) est son inverse : longue mèche haute, petit corps en bas, signalant un essoufflement acheteur.',
        warning: 'Aucune figure graphique n\'est fiable à 100%. Il faut toujours attendre une confirmation et corréler avec le volume et les niveaux de support/résistance.'
      }
    ],
    quiz: {
      question: 'Que signifie une bougie avec un petit corps en haut et une très longue mèche vers le bas (Marteau) ?',
      options: [
        'Les vendeurs ont dominé jusqu\'à la dernière seconde',
        'Le marché a chuté brutalement mais les acheteurs ont vigoureusement racheté avant la clôture',
        'Le volume était nul et personne n\'a tradé',
        'Il faut immédiatement vendre à découvert'
      ],
      correctIndex: 1,
      explanation: 'La longue mèche basse montre que les vendeurs ont tenté d\'enfoncer le prix mais les acheteurs ont repris la main avec force.'
    }
  },
  {
    id: 'lesson-3',
    title: '3. La Règle d\'Or du Risque : Ne jamais risquer plus de 1% à 2%',
    subtitle: 'La formule mathématique qui protège votre compte contre la faillite',
    duration: '8 min de lecture',
    level: 'Débutant',
    category: 'risques',
    keyTakeaway: 'Le but premier d\'un trader n\'est pas de "gagner gros", mais de survivre sur les marchés pour laisser les probabilités positives faire fructifier son capital.',
    sections: [
      {
        title: 'Le piège des séries de pertes consécutives',
        content: 'Même les meilleurs gérants de fonds au monde subissent parfois 5 à 8 pertes consécutives. Si vous risquez 10% par trade, 5 pertes d\'affilée amputent plus de 41% de votre capital ! Pour remonter la pente, il vous faudra ensuite réaliser un gain de +70% juste pour revenir à zéro.',
        warning: 'Plus votre perte totale est importante, plus le pourcentage requis pour récupérer devient exponentiellement difficile.'
      },
      {
        title: 'Le calcul de taille de position (Position Sizing)',
        content: 'Si votre portefeuille virtuel est de 50 000 €, 1% représente 500 € de perte maximale autorisée. Si vous achetez une action à 100 € et placez votre Stop-Loss à 95 € (5 € de risque par action), votre quantité maximale doit être de 500 € / 5 € = 100 actions.',
        tip: 'TradeHub intègre un calculateur de risque automatique dans le simulateur pour vous donner la taille exacte d\'ordre à passer sans vous tromper.'
      }
    ],
    quiz: {
      question: 'Sur un compte de 10 000 €, si vous appliquez la règle de risque de 1%, combien pouvez-vous perdre au maximum si votre Stop-Loss est touché ?',
      options: [
        '1 000 €',
        '500 €',
        '100 €',
        '50 €'
      ],
      correctIndex: 2,
      explanation: '1% de 10 000 € équivaut strictement à 100 €. Le Stop-Loss doit être calibré de façon à couper la position dès que 100 € de perte sont atteints.'
    }
  },
  {
    id: 'lesson-4',
    title: '4. Stop-Loss et Take-Profit : La discipline automatique',
    subtitle: 'Comment automatiser sa sortie pour neutraliser les émotions',
    duration: '6 min de lecture',
    level: 'Intermédiaire',
    category: 'risques',
    keyTakeaway: 'Entrer sur le marché sans avoir défini son Stop-Loss à l\'avance, c\'est monter dans une voiture sans freins ni ceinture de sécurité.',
    sections: [
      {
        title: 'Pourquoi l\'être humain refuse d\'accepter une perte',
        content: 'La psychologie comportementale démontre que la douleur d\'une perte financière est deux fois plus intense que la joie d\'un gain équivalent. C\'est ce qui pousse le débutant à repousser son stop-loss en espérant un rebond miraculeux, jusqu\'à la liquidation totale.',
        warning: 'Ne déplacez JAMAIS un Stop-Loss dans le sens d\'une augmentation de votre risque. Un ordre Stop exécuté est une protection, pas un échec.'
      },
      {
        title: 'Le ratio Rendement / Risque (R:R Ratio)',
        content: 'Visez toujours un ratio R:R d\'au moins 2:1. Cela signifie que pour chaque euro risqué en Stop-Loss, vous visez un gain potentiel de 2 euros en Take-Profit. Avec un tel ratio, même si vous n\'avez raison que dans 40% de vos trades, votre portefeuille reste mathématiquement gagnant sur le long terme !',
        tip: 'Dans l\'interface de passage d\'ordre de TradeHub, le ratio Rendement/Risque est calculé en direct avant que vous ne cliquiez sur Confirmer.'
      }
    ],
    quiz: {
      question: 'Avec un ratio Rendement/Risque de 2:1 et 10 trades réalisés (4 gagnants de 200€ et 6 perdants de 100€), quel est votre bilan ?',
      options: [
        'Perte de 200 €',
        'Équilibre parfait (0 €)',
        'Gain net de +200 € (Gains: 800€, Pertes: 600€)',
        'Perte de 600 €'
      ],
      correctIndex: 2,
      explanation: '4 gains de 200 € = +800 €. 6 pertes de 100 € = -600 €. Bilan = +200 € de bénéfice net, alors même que vous avez eu tort 6 fois sur 10 ! Voilà la magie du Risk Management.'
    }
  },
  {
    id: 'lesson-5',
    title: '5. La vérité sur l\'Effet de Levier : Accélérateur de Ruine',
    subtitle: 'Comprendre pourquoi le levier est l\'arme la plus dangereuse pour les particuliers',
    duration: '5 min de lecture',
    level: 'Intermédiaire',
    category: 'bases',
    keyTakeaway: 'L\'effet de levier amplifie les gains mais amplifie tout autant les pertes. Avec un levier x20, une simple baisse de 5% du marché anéantit 100% de votre capital investi.',
    sections: [
      {
        title: 'Comment fonctionne l\'effet de levier',
        content: 'L\'effet de levier est un emprunt consenti par un courtier. Si vous investissez 1 000 € avec un levier x10, vous pilotez une position de 10 000 €. Si l\'actif gagne 2%, vous gagnez 200 € (+20% sur votre mise). Mais si l\'actif baisse de 2%, vous perdez 200 € (-20%).',
        warning: 'Sur les cryptomonnaies ou les actions volatiles, des mèches de 5% à 10% peuvent survenir en quelques secondes lors d\'annonces de nouvelles, entraînant un appel de marge et la liquidation immédiate.'
      },
      {
        title: 'La recommandation TradeHub pour les jeunes & débutants',
        content: 'Commencez toujours en Paper Trading au comptant (Spot / Levier x1). Maîtrisez d\'abord la régularité sur 6 mois avant d\'envisager le moindre levier.',
        tip: 'Le simulateur TradeHub désactive par défaut tout levier supérieur à x1 pour inculquer les saines habitudes d\'investissement patrimonial.'
      }
    ],
    quiz: {
      question: 'Si vous prenez une position avec un levier x20, quelle baisse de l\'actif entraîne la perte totale (100%) de votre capital ?',
      options: [
        'Une baisse de 20%',
        'Une baisse de 10%',
        'Une baisse de seulement 5% (100 / 20 = 5)',
        'Une baisse de 50%'
      ],
      correctIndex: 2,
      explanation: '100% / 20 = 5%. Une simple variation de 5% contre vous efface l\'intégralité de vos fonds engagés. C\'est pourquoi le levier sans expertise est extrêmement destructeur.'
    }
  }
];
