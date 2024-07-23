import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Search, Filter, RefreshCw, X } from 'lucide-react';
import { Users, Calendar, Box, Target, Tag } from 'lucide-react';

const getIconForColumn = (column) => {
    switch (column) {
        case 'Leeftijdsgroep':
            return Calendar;
        case 'Aantal spelers':
            return Users;
        case 'Soort speelgoed':
            return Box;
        case 'Ontwikkelingsdoelen':
            return Target;
        case 'Thema\'s':
            return Tag;
        default:
            return Filter;
    }
};
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

type Filters = {
    [key in typeof filterableColumns[number]]?: string;
};

const LazyImage: React.FC<{ src: string; alt: string; className?: string }> = ({ src, alt, className }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsLoaded(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                rootMargin: '100px',
            }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => {
            if (imgRef.current) {
                observer.unobserve(imgRef.current);
            }
        };
    }, []);

    return (
        <img
            ref={imgRef}
            src={isLoaded ? src : 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='}
            alt={alt}
            className={className}
        />
    );
};

export default function ToyFilterWizard() {
    const [toys, setToys] = useState([]);
    const [filters, setFilters] = useState<Filters>({});
    const [currentStep, setCurrentStep] = useState('Leeftijdsgroep');
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchMode, setIsSearchMode] = useState(true);
    const [selectedToy, setSelectedToy] = useState(null);
    const scrollTargetRef = useRef(null);

    // Verplaatst naar het begin van de component
    const getAgeValue = (age: string): number => {
        if (age.includes('jaar en ouder')) {
            return parseInt(age.split(' ')[0]);
        }
        return parseInt(age);
    };

    useEffect(() => {
        const fetchToys = async () => {
            try {
                const response = await fetch(`${process.env.PUBLIC_URL}/catalogus.json`);
                const data = await response.json();
                setToys(data);
            } catch (error) {
                console.error('Error fetching toys:', error);
            }
        };

        fetchToys();
    }, []);

    const isAgeInRange = (toyAgeRange: string, selectedAge: string): boolean => {
        const selectedAgeValue = getAgeValue(selectedAge);

        if (toyAgeRange.includes('+')) {
            const toyMinAge = parseInt(toyAgeRange);
            return selectedAgeValue >= toyMinAge;
        } else if (toyAgeRange.includes('-')) {
            const [min, max] = toyAgeRange.split('-').map(Number);
            return selectedAgeValue >= min && selectedAgeValue <= max;
        } else {
            const toyAge = parseInt(toyAgeRange);
            return selectedAgeValue === toyAge;
        }
    };

    const isPlayerCountValid = (toyPlayers: string, selectedPlayers: string): boolean => {
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
                if (typeof value !== 'string') return false;

                switch (key) {
                    case 'Leeftijdsgroep':
                        return isAgeInRange(toy[key], value);
                    case 'Aantal spelers':
                        return isPlayerCountValid(toy[key], value);
                    case 'Ontwikkelingsdoelen':
                        return Object.values(toy[key]).flat().includes(value);
                    default:
                        return toy[key].includes(value);
                }
            });
            return searchMatch && filterMatch;
        });
    }, [filters, searchTerm, toys]);

    const availableOptions = useMemo(() => {
        const options = filterableColumns.reduce((acc, column) => {
            if (column === 'Leeftijdsgroep') {
                const ageOptions = new Set<string>();
                filteredToys.forEach(toy => {
                    if (toy[column].includes('+')) {
                        const minAge = parseInt(toy[column]);
                        ageRangeOptions.forEach(option => {
                            if (getAgeValue(option) >= minAge) {
                                ageOptions.add(option);
                            }
                        });
                    } else if (toy[column].includes('-')) {
                        const [min, max] = toy[column].split('-').map(Number);
                        ageRangeOptions.forEach(option => {
                            const ageValue = getAgeValue(option);
                            if (ageValue >= min && ageValue <= max) {
                                ageOptions.add(option);
                            }
                        });
                    } else {
                        ageOptions.add(ageRangeOptions.find(option => getAgeValue(option) === parseInt(toy[column])) || '');
                    }
                });
                acc[column] = Array.from(ageOptions);
            } else {
                acc[column] = [...new Set(filteredToys.map(toy => {
                    if (column === 'Aantal spelers') {
                        return playerOptions.find(option => isPlayerCountValid(toy[column], option));
                    }
                    if (column === 'Ontwikkelingsdoelen') {
                        return Object.values(toy[column]).flat();
                    }
                    return toy[column];
                }).flat())];
            }

            if (column !== 'Leeftijdsgroep' && column !== 'Aantal spelers') {
                acc[column].sort((a, b) => a.localeCompare(b, 'nl', { sensitivity: 'base' }));
            }

            return acc;
        }, {} as Record<string, string[]>);

        options['Leeftijdsgroep'].sort((a, b) => getAgeValue(a) - getAgeValue(b));
        options['Aantal spelers'].sort((a, b) => playerOptions.indexOf(a) - playerOptions.indexOf(b));

        return options;
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
                        className="bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105"
                        onClick={() => setSelectedToy(toy)}
                    >
                        <LazyImage
                            src={`${process.env.PUBLIC_URL}/img/${toy.Bestandsnaam}`}
                            alt={toy.Beschrijving}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <h2 className="text-xl font-bold mb-2 text-gray-800">{toy.Titel}</h2>
                            <p className="text-gray-600 mb-4 line-clamp-2">{toy.Beschrijving}</p>
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

    const ToyModal = ({ toy, onClose }) => {
        const modalRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            const handleOutsideClick = (event: MouseEvent) => {
                if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                    onClose();
                }
            };

            document.addEventListener('mousedown', handleOutsideClick);
            return () => {
                document.removeEventListener('mousedown', handleOutsideClick);
            };
        }, [onClose]);

        if (!toy) return null;
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
                <div ref={modalRef} className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="sticky top-0 bg-white p-4 flex justify-between items-center border-b">
                        <h2 className="text-2xl font-bold text-gray-800">{toy.Titel}</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            <X size={24} />
                        </button>
                    </div>
                    <div className="p-4">
                        <LazyImage
                            src={`${process.env.PUBLIC_URL}/img/${toy.Bestandsnaam}`}
                            alt={toy.Beschrijving}
                            className="w-full h-auto object-contain mb-4"
                        />
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
                    <div className="flex items-center mb-4">
                        <img src={`${process.env.PUBLIC_URL}/speelotheek-vlieger.png`}
                             alt="Speelotheek Vlieger"
                             className="mr-4 h-auto max-h-[150%]"
                             style={{ maxHeight: 'calc(1.5 * 3rem)' }}
                             loading="lazy"
                        />
                        <h1 className="text-3xl font-bold text-gray-800">Speelgoed Zoeker - Speelotheek de Vlieger</h1>
                    </div>
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
                                {filterableColumns.map((column) => {
                                    const Icon = getIconForColumn(column);
                                    return (
                                        <div key={column} className="bg-white rounded-lg shadow p-4">
                                            <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                                                <Icon className="mr-2" size={18}/>
                                                {columnLabels[column]}
                                            </h3>
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
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
                <div className="mb-4 text-lg font-semibold text-gray-700">
                    Aantal zoekresultaten: {filteredToys.length}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredToys.map((toy) => (
                        <div
                            key={toy.Beschrijving}
                            className="bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105"
                            onClick={() => setSelectedToy(toy)}
                        >
                            <LazyImage
                                src={`${process.env.PUBLIC_URL}/img/${toy.Bestandsnaam}`}
                                alt={toy.Beschrijving}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                            <h2 className="text-xl font-bold mb-2 text-gray-800">{toy.Titel}</h2>
                                <p className="text-gray-600 mb-4 line-clamp-2">{toy.Beschrijving}</p>
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
                {selectedToy && <ToyModal toy={selectedToy} onClose={() => setSelectedToy(null)} />}
            </div>
        );

}