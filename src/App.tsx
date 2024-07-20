import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Search, Filter, RefreshCw } from 'lucide-react';

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
  const [toys, setToys] = useState([]);
  const [filters, setFilters] = useState({});
  const [currentStep, setCurrentStep] = useState('Leeftijdsgroep');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(true);
  const scrollTargetRef = useRef(null);

  useEffect(() => {
    const fetchToys = async () => {
      try {
        const response = await fetch('/catalogus.json');
        const data = await response.json();
        setToys(data);
      } catch (error) {
        console.error('Error fetching toys:', error);
      }
    };

    fetchToys();
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
  }, [filters, searchTerm, toys]);

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

  const ShowResults = ({ toys }) => {
    if (!toys || toys.length === 0) {
      return (
          <div className="text-center py-8 text-lg text-gray-500">
            Geen resultaten om te tonen
          </div>
      );
    }
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {toys.map((toy) => (
              <div
                  key={toy.Beschrijving}
                  className="bg-white shadow-lg rounded-lg overflow-hidden"
              >
                <img
                    src={`/img/${toy.Bestandsnaam}`}
                    alt={toy.Beschrijving}
                    className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-2 text-gray-800">{toy.Titel}</h2>
                  <p className="text-gray-600 mb-4">{toy.Beschrijving}</p>
                  <div className="space-y-2">
                    {Object.entries(columnLabels).map(([key, label]) => (
                        <div key={key} className="flex items-center text-sm">
                          <span className="font-semibold text-gray-700 mr-2">{label}:</span>
                          <span className="text-gray-600">
                      {key === 'Ontwikkelingsdoelen'
                          ? Object.values(toy[key]).flat().join(', ')
                          : Array.isArray(toy[key])
                              ? toy[key].join(', ')
                              : toy[key]}
                    </span>
                        </div>
                    ))}
                  </div>
                </div>
              </div>
          ))}
        </div>
    );
  };

  const toggleSearchMode = () => {
    setIsSearchMode(!isSearchMode);
    if (isSearchMode) {
      setSearchTerm('');
    }
  };

  const resetFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  return (
      <div className="container mx-auto px-4 py-8">
        <div ref={scrollTargetRef}></div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Speelgoed Zoeker</h1>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex space-x-2">
              <button
                  onClick={toggleSearchMode}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300 flex items-center"
              >
                {isSearchMode ? <><Filter className="mr-2" /> Filters</> : <><Search className="mr-2" /> Zoeken</>}
              </button>
              <button
                  onClick={resetFilters}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300 flex items-center"
              >
                <RefreshCw className="mr-2" /> Reset
              </button>
            </div>
            {isSearchMode ? (
                <div className="relative w-full md:w-1/2">
                  <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Zoek naar speelgoed..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
                  {filterableColumns.map((column) => (
                      <div key={column} className="bg-white rounded-lg shadow p-4">
                        <h3 className="font-semibold text-gray-700 mb-2">{columnLabels[column]}</h3>
                        <div className="space-y-2">
                          {availableOptions[column] && availableOptions[column].map(option => (
                              <button
                                  key={option}
                                  onClick={() => handleFilterClick(column, option)}
                                  className={`w-full text-left px-2 py-1 rounded ${
                                      filters[column] === option
                                          ? 'bg-blue-500 text-white'
                                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                  } transition-colors duration-200`}
                              >
                                {option}
                              </button>
                          ))}
                        </div>
                      </div>
                  ))}
                </div>
            )}
          </div>
        </div>
        <div className="mb-4 text-lg font-semibold text-gray-700">
          Aantal zoekresultaten: {filteredToys.length}
        </div>
        <ShowResults toys={filteredToys} />
      </div>
  );
}