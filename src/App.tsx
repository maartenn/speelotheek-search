import React, { useState, useMemo, useEffect,useRef } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const toys = [
  {
    "Titel": "Croquet Set",
    "Beschrijving": "Een traditionele croquet set voor buitenspel. Spelers slaan met een mallet ballen door hoepels en proberen als eerste hun ballen in de eindpoorten te slaan.",
    "Leeftijdsgroep": "6+",
    "Soort speelgoed": "Buitenspeelgoed, gezelschapsspel",
    "Ontwikkelingsdoelen": {
      "Motoriek": [
        "Grove motoriek",
        "Coördinatie",
        "Evenwicht"
      ],
      "Cognitief": [
        "Strategisch denken",
        "Ruimtelijk inzicht",
        "Probleemoplossend vermogen"
      ],
      "Sociaal-emotioneel": [
        "Sociale interactie",
        "Samenwerking",
        "Sportiviteit"
      ],
      "Overige": []
    },
    "Thema's": [
      "Sport",
      "Buitenactiviteiten"
    ],
    "Merk": "Niet zichtbaar",
    "Aantal spelers": "2+",
    "Extra informatie": "De set bevat 4 houten mallets, 6 ballen, 9 hoepels en 2 eindpoorten. De set wordt geleverd in een draagtas.",
    "Bestandsnaam": "B057 Croquet Set.jpg"
  },
  {
    "Titel": "Kegelspel",
    "Beschrijving": "Het doel van dit spel is om de kegels om te gooien met de ballen.",
    "Leeftijdsgroep": "2+",
    "Soort speelgoed": "Kegelspel",
    "Ontwikkelingsdoelen": {
      "Motoriek": [
        "Grove motoriek",
        "Coördinatie",
        "Evenwicht"
      ],
      "Cognitief": [
        "Ruimtelijk inzicht",
        "Probleemoplossend vermogen"
      ],
      "Sociaal-emotioneel": [
        "Samenwerking",
        "Sociale interactie"
      ],
      "Overige": []
    },
    "Thema's": [],
    "Merk": "Onbekend",
    "Aantal spelers": "2+",
    "Extra informatie": "Het kegelspel is gemaakt van hout en bevat 10 kegels en 2 ballen.",
    "Bestandsnaam": "B061 Kegelspel.JPG"
  },
  {
    "Titel": "Motoriekfiets",
    "Beschrijving": "Een motoriekfiets is een speelgoedvoertuig dat kinderen helpt om hun motorische vaardigheden te ontwikkelen. Het voertuig is speciaal ontworpen om te rijden met behulp van de armen en benen.",
    "Leeftijdsgroep": "2-6 jaar",
    "Soort speelgoed": "Motoriekspel",
    "Ontwikkelingsdoelen": {
      "Motoriek": [
        "Grove motoriek",
        "Evenwicht",
        "Coördinatie"
      ],
      "Cognitief": [
        "Ruimtelijk inzicht"
      ],
      "Sociaal-emotioneel": [],
      "Overige": []
    },
    "Thema's": [],
    "Merk": "Niet zichtbaar",
    "Aantal spelers": "1",
    "Extra informatie": "De motoriekfiets is gemaakt van stevig materiaal en is geschikt voor zowel binnen als buiten gebruik.",
    "Bestandsnaam": "B059 Motoriekfiets.jpg"
  },
  {
    "Titel": "Pogo Stick",
    "Beschrijving": "Een pogo stick is een springend speelgoed waarbij je op een metalen staaf met een veer staat en omhoog springt door met je voeten op de pedalen te duwen.",
    "Leeftijdsgroep": "5+",
    "Soort speelgoed": "Buitenspeelgoed",
    "Ontwikkelingsdoelen": {
      "Motoriek": [
        "Grove motoriek",
        "Evenwicht",
        "Coördinatie"
      ],
      "Cognitief": [],
      "Sociaal-emotioneel": [],
      "Overige": []
    },
    "Thema's": [],
    "Merk": "Onbekend",
    "Aantal spelers": "1",
    "Extra informatie": "Geschikt voor zowel jongens als meisjes.",
    "Bestandsnaam": "B060 Pogostick 2.JPG"
  },
  {
    "Titel": "Balanceerdoolhof",
    "Beschrijving": "Een speelgoeddoolhof dat kinderen moeten balanceren om een balletje of ander voorwerp doorheen te leiden.",
    "Leeftijdsgroep": "2-5 jaar",
    "Soort speelgoed": "Balansbord, Doolhof",
    "Ontwikkelingsdoelen": {
      "Motoriek": "Fijne motoriek, Grove motoriek, Evenwicht, Coördinatie",
      "Cognitief": "Probleemoplossend vermogen, Ruimtelijk inzicht",
      "Sociaal-emotioneel": "Geen",
      "Overige": "Concentratie"
    },
    "Thema's": ["Dieren"],
    "Merk": "K's Kids",
    "Aantal spelers": "1",
    "Extra informatie": "Het doolhof is gemaakt van stevig plastic en is geschikt voor zowel binnen als buiten.",
    "Bestandsnaam": "B067 Balanceerdoolhof.JPG"
  },
  {
    "Titel": "Tafelvoetbalspel",
    "Beschrijving": "Tafelvoetbalspel waarbij spelers hun eigen team van poppetjes met behulp van hendels moeten bewegen om de bal in het doel van de tegenstander te schieten.",
    "Leeftijdsgroep": "6+",
    "Soort speelgoed": "Tafelvoetbalspel",
    "Ontwikkelingsdoelen": {
      "Motoriek": [
        "Fijne motoriek",
        "Grove motoriek",
        "Coördinatie",
        "Hand-oogcoördinatie"
      ],
      "Cognitief": [
        "Strategisch denken",
        "Probleemoplossend vermogen",
        "Ruimtelijk inzicht"
      ],
      "Sociaal-emotioneel": [
        "Sociale interactie",
        "Competitie",
        "Samenwerking"
      ],
      "Overige": []
    },
    "Thema's": [
      "Sport",
      "Voetbal"
    ],
    "Merk": "Arco",
    "Aantal spelers": "2",
    "Extra informatie": "Zonder poten",
    "Bestandsnaam": "B070 Tafel voetbalspel (zonder poten).jpg"
  },
  {
    "Titel": "Therapie Bal",
    "Beschrijving": "Deze therapie bal is een hulpmiddel voor het verbeteren van balans, coördinatie en stabiliteit. Het kan worden gebruikt tijdens verschillende oefeningen en activiteiten.",
    "Leeftijdsgroep": "Alle leeftijden",
    "Soort speelgoed": "Therapiehulpmiddel",
    "Ontwikkelingsdoelen": {
      "Motoriek": [
        "Evenwicht",
        "Coördinatie",
        "Stabiliteit"
      ],
      "Cognitief": [],
      "Sociaal-emotioneel": [],
      "Overige": [
        "Spierversterking",
        "Verbeteren van proprioceptie (lichaamsbewustzijn)"
      ]
    },
    "Thema's": [],
    "Merk": "Onbekend",
    "Aantal spelers": "1",
    "Extra informatie": "De bal is gemaakt van duurzaam materiaal en heeft een glad oppervlak.",
    "Bestandsnaam": "B056 Therapie bal.jpg"
  },
  {
    "Titel": "Jongleerset",
    "Beschrijving": "Deze set bevat diverse attributen om te jongleren, zoals ballen, kegels, doeken en hoepels. De set is ideaal voor beginners om te leren jongleren en om plezier te hebben met verschillende trucs.",
    "Leeftijdsgroep": "6+",
    "Soort speelgoed": "Jongleerset",
    "Ontwikkelingsdoelen": {
      "Motoriek": [
        "Fijne motoriek",
        "Grove motoriek",
        "Coördinatie",
        "Evenwicht"
      ],
      "Cognitief": [
        "Probleemoplossend vermogen",
        "Ruimtelijk inzicht",
        "Concentratie"
      ],
      "Sociaal-emotioneel": [
        "Sociale interactie",
        "Samenwerking"
      ],
      "Overige": [
        "Creativiteit",
        "Behendigheid"
      ]
    },
    "Thema's": [
      "Circus",
      "Jongleren",
      "Trucs"
    ],
    "Merk": "Niet zichtbaar",
    "Aantal spelers": "1+",
    "Extra informatie": "De set is geschikt voor zowel beginners als gevorderden. De attributen zijn gemaakt van duurzaam materiaal en zijn veilig voor kinderen.",
    "Bestandsnaam": "B062 Jongleerset.jpg"
  },
  {
    "Titel": "Balanceerschijf",
    "Beschrijving": "De balanceerschijf is een speelgoed dat kinderen helpt om hun evenwicht en coördinatie te verbeteren. Het kan ook gebruikt worden om spierkracht en stabiliteit te trainen.",
    "Leeftijdsgroep": "3+",
    "Soort speelgoed": "Bewegings- en evenwichtsspeelgoed",
    "Ontwikkelingsdoelen": {
      "Motoriek": [
        "Grove motoriek",
        "Evenwicht",
        "Coördinatie"
      ],
      "Cognitief": [
        "Ruimtelijk inzicht"
      ],
      "Sociaal-emotioneel": [],
      "Overige": []
    },
    "Thema's": [],
    "Merk": "Niet zichtbaar",
    "Aantal spelers": "1",
    "Extra informatie": "De balanceerschijf is gemaakt van stevig plastic en heeft een diameter van ongeveer 35 cm.",
    "Bestandsnaam": "B066 Balanceerschijf.jpg"
  },
  {
    "Titel": "Actiespeelgoedset",
    "Beschrijving": "Deze set bevat verschillende soorten speelgoed voor actie en plezier, waaronder auto's, ringen en ballen.",
    "Leeftijdsgroep": "2+",
    "Soort speelgoed": "Actiespeelgoed",
    "Ontwikkelingsdoelen": {
      "Motoriek": [
        "Fijne motoriek",
        "Grove motoriek",
        "Coördinatie"
      ],
      "Cognitief": [
        "Probleemoplossend vermogen",
        "Ruimtelijk inzicht"
      ],
      "Sociaal-emotioneel": [
        "Sociale interactie",
        "Samenwerking"
      ],
      "Overige": []
    },
    "Thema's": [
      "Auto's",
      "Sport",
      "Spel"
    ],
    "Merk": "Niet zichtbaar",
    "Aantal spelers": "1+",
    "Extra informatie": "De set is gemaakt van kunststof en stof.",
    "Bestandsnaam": "B063 Actiespelen van kunststof en stof.JPG"
  },
  {
    "Titel": "Loopmuis",
    "Beschrijving": "Een loopmuis van plastic met wielen, geschikt voor jonge kinderen om op te rijden en mee te spelen.",
    "Leeftijdsgroep": "1-3 jaar",
    "Soort speelgoed": "Loopfiets, loopwagen",
    "Ontwikkelingsdoelen": {
      "Motoriek": "Grove motoriek, evenwicht, coördinatie",
      "Cognitief": "Ruimtelijk inzicht",
      "Sociaal-emotioneel": "Zelfvertrouwen",
      "Overige": "Bewegingsvaardigheid"
    },
    "Thema's": ["Dieren"],
    "Merk": "Onbekend",
    "Aantal spelers": "1",
    "Extra informatie": "Het speelgoed is gemaakt van plastic en heeft vier wielen. Het heeft een handvat om vast te houden en een zitje om op te rijden.",
    "Bestandsnaam": "B058 Loopmuis.jpg"
  }
];

const ageRangeOptions = [
  '0 jaar', '1 jaar', '2 jaar', '3 jaar', '4 jaar', '5 jaar', '6 jaar en ouder'
];

const playerOptions = [
  '0', '1', '2', '3', '4 of meer'
];

const filterableColumns = ['Leeftijdsgroep', 'Aantal spelers', 'Soort speelgoed', 'Ontwikkelingsdoelen', 'Thema\'s'];

const columnLabels = {
  Leeftijdsgroep: 'Leeftijd',
  'Aantal spelers': 'Aantal spelers',
  'Soort speelgoed': 'Type',
  Ontwikkelingsdoelen: 'Ontwikkelingsdoelen',
  'Thema\'s': 'Thema\'s'
};

export default function ToyFilterWizard() {
  const [filters, setFilters] = useState({});
  const [currentStep, setCurrentStep] = useState('Leeftijdsgroep');
  const currentStepIndex = useMemo(() => filterableColumns.findIndex(col => col === currentStep), [currentStep]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [currentToyIndex, setCurrentToyIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(true);
  const scrollTargetRef = useRef(null);
  const scrollToTop = () => {
    scrollTargetRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const ShowResults = ({toys, setCurrentToyIndex, currentToyIndex}) => {
    if (!toys || toys.length === 0) {
      return (
          <div className="text-center py-8 text-lg text-gray-500">
            Geen resultaten om te tonen
          </div>
      );
    }
    return (
        <>
          {toys.map((toy, idx) => (
              <div  key={toy.Beschrijving}
                    onClick={() => setCurrentToyIndex(idx)}
                    className={`cursor-pointer ${idx === currentToyIndex ? 'bg-blue-200' : 'bg-gray-100'}
          p-4 rounded-lg flex flex-col md:flex-row space-y-2 mb-4`}>

                <div className="md:w-2/5">

                <img
                    src={`/img/${toy.Bestandsnaam}`}
                    alt={toy.Beschrijving}
                    className="w-full h-auto rounded-md"
                />
                </div>
                <div className="md:w-3/5 flex flex-col space-y-2 p-4">
                  <h2 className="text-xl font-bold">{toy.Titel}</h2>
                  <p>{toy.Beschrijving}</p>
                  <div className="flex space-x-2">
                    <span className="font-semibold">{columnLabels['Leeftijdsgroep']}: </span>
                    <span>{toy.Leeftijdsgroep}</span>
                  </div>
                  <div className="flex space-x-2">
                    <span className="font-semibold">{columnLabels['Aantal spelers']}: </span>
                    <span>{toy['Aantal spelers']}</span>
                  </div>
                  <div className="flex space-x-2">
                    <span className="font-semibold">{columnLabels['Soort speelgoed']}: </span>
                    <span>{toy['Soort speelgoed']}</span>
                  </div>
                  <div className="flex space-x-2">
                    <span className="font-semibold">{columnLabels['Ontwikkelingsdoelen']}: </span>
                    <span>{Object.values(toy.Ontwikkelingsdoelen).flat().join(', ')}</span>
                  </div>
                  <div className="flex space-x-2">
                    <span className="font-semibold">{columnLabels['Thema\'s']}: </span>
                    <span>{toy['Thema\'s'].join(', ')}</span>
                  </div>
                </div>
              </div>
          ))}
        </>
    );
  };

  const toggleSearchMode = () => {
    setIsSearchMode(!isSearchMode);
    if (isSearchMode) {
      setSearchTerm('');
    }
  };

  const goToNextFilter = () => {
    if (currentStepIndex === filterableColumns.length - 1) {
      // Last step
    } else {
      const nextStep = filterableColumns[currentStepIndex + 1];
      setCurrentStep(nextStep);
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const filterOptions = useMemo(() => {
    return {
      Leeftijdsgroep: ageRangeOptions,
      'Aantal spelers': playerOptions,
      'Soort speelgoed': [...new Set(toys.map(toy => toy['Soort speelgoed']))].sort(),
      Ontwikkelingsdoelen: [...new Set(Object.values(toys.flatMap(toy => Object.values(toy.Ontwikkelingsdoelen)).flat()))].sort(),
      'Thema\'s': [...new Set(toys.flatMap(toy => toy['Thema\'s']))].sort(),
    };
  }, []);

  const isAgeInRange = (toyAgeRange, selectedAge) => {
    const toyMinAge = parseInt(toyAgeRange);
    const selectedAgeValue = ageRangeOptions.indexOf(selectedAge);
    if (toyAgeRange.includes('+')) {
      return selectedAgeValue >= ageRangeOptions.indexOf(toyMinAge + ' jaar');
    } else if (toyAgeRange.includes('-')) {
      const [min, max] = toyAgeRange.split('-').map(Number);
      return selectedAgeValue >= ageRangeOptions.indexOf(min + ' jaar') &&
          selectedAgeValue <= ageRangeOptions.indexOf(max + ' jaar');
    }
    return false;
  };

  const isPlayerCountValid = (toyPlayers, selectedPlayers) => {
    const toyPlayerCount = parseInt(toyPlayers);
    const selectedPlayerIndex = playerOptions.indexOf(selectedPlayers);
    if (toyPlayers.includes('+')) {
      return selectedPlayerIndex >= playerOptions.indexOf(toyPlayerCount.toString());
    }
    return selectedPlayerIndex === playerOptions.indexOf(toyPlayerCount.toString());
  };

  const filteredToys = useMemo(() => {
    return toys.filter(toy => {
      const searchMatch = Object.values(toy).some(value =>
          typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const filterMatch = Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        if (key === 'Leeftijdsgroep') {
          return isAgeInRange(toy[key], value);
        }
        if (key === 'Aantal spelers') {
          return isPlayerCountValid(toy[key], value);
        }
        if (key === 'Ontwikkelingsdoelen') {
          return Object.values(toy[key]).flat().includes(value);
        }
        return toy[key].includes(value);
      });
      return searchMatch && filterMatch;
    });
  }, [filters, searchTerm]);

  const availableOptions = useMemo(() => {
    return filterableColumns.reduce((acc, column) => {
      acc[column] = [...new Set(filteredToys.map(toy => {
        if (column === 'Leeftijdsgroep') {
          return ageRangeOptions.find(option => isAgeInRange(toy[column], option));
        }
        if (column === 'Aantal spelers') {
          return playerOptions.find(option => isPlayerCountValid(toy[column], option));
        }
        if (column === 'Ontwikkelingsdoelen') {
          return Object.values(toy[column]).flat();
        }
        return toy[column];
      }).flat())];
      return acc;
    }, {});
  }, [filteredToys]);

  const handleFilterClick = (column, value) => {
    setFilters(prev => ({
      ...prev,
      [column]: prev[column] === value ? null : value
    }));
    const currentIndex = filterableColumns.indexOf(column);
    const nextColumn = filterableColumns[(currentIndex + 1) % filterableColumns.length];
    setCurrentStep(nextColumn);
  };

  const handleNextToy = () => {
    setCurrentToyIndex((currentToyIndex + 1) % filteredToys.length);
  };

  const handlePrevToy = () => {
    setCurrentToyIndex((currentToyIndex - 1 + filteredToys.length) % filteredToys.length);
  };

  return (
      <div ref={scrollTargetRef} className="flex flex-col items-center">
        <div className="w-full lg:w-3/4 xl:w-3/4 p-4">

          <div className="mt-4">
            {isSearchMode ? (
                <div className="flex items-center">
                  <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded-md"
                      placeholder="Zoek op naam of beschrijving..."
                  />
                  <button
                      onClick={() => setSearchTerm('')}
                      className="ml-2 px-2 py-1 text-white bg-red-500 rounded-md"
                  >
                    <X size={16}/>
                  </button>
                </div>
            ) : (
                <div>
                  <h2 className="text-lg font-semibold">Filter op {columnLabels[currentStep]}</h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {filterOptions[currentStep].map(option => (
                        <button
                            key={option}
                            onClick={() => handleFilterClick(currentStep, option)}
                            className={`px-4 py-2 rounded-md ${filters[currentStep] === option ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                        >
                          {option}
                        </button>
                    ))}
                  </div>
                  <button
                      onClick={goToNextFilter}
                      className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md"
                  >
                    Volgende
                  </button>
                </div>
            )}
            {/*<button onClick={toggleSearchMode} className="px-4 py-2 bg-blue-500 text-white rounded-md">*/}
            {/*  {isSearchMode ? 'Naar filters (Beta)' : 'Zoek met tekst'}*/}
            {/*</button>*/}
          </div>
          <div className="mt-8">
            <ShowResults
                toys={filteredToys}
                setCurrentToyIndex={setCurrentToyIndex}
                currentToyIndex={currentToyIndex}
            />
          </div>
          <div className="mt-8 flex justify-between">
            <button onClick={handlePrevToy} className="p-2 bg-gray-300 rounded-md">
              <ChevronLeft size={24} />
            </button>
            <button onClick={handleNextToy} className="p-2 bg-gray-300 rounded-md">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
  );
}
