import { useEffect, useState } from 'react';

interface Card {
    id: string;
    name: string;
    images: {
    small: string;
    large: string;
    };
    hp?: string;
    rarity?: string;
    types?: string[];
};

const TcgTestPage: React.FC = () => {
    const [cards, setCards] = useState<Card[]>([]);

    useEffect(() => {
    fetch('https://api.pokemontcg.io/v2/cards?pageSize=20', {
    })
        .then(res => res.json())
        .then(data => setCards(data.data))
        .catch(err => console.error('Failed to fetch cards', err));
}, []);

    return (
    // <div className="container mt-4">
    //     <h2 className="text-center mb-4" style={{ color: '#e63946' }}>Pokémon TCG Test</h2>
    //     <div className="row">
    //     {cards.map(card => (
    //         <div key={card.id} className="col-md-3 mb-4">
    //         <div className="card">
    //             <img src={card.images.small} className="card-img-top" alt={card.name} />
    //             <div className="card-body">
    //             <h5 className="card-title text-center">{card.name}</h5>
    //             </div>
    //         </div>
    //         </div>
    //     ))}
    //     </div>
    // </div>
    <div className="container mt-4">
        <h2 className="text-center mb-4" style={{ color: '#e63946' }}>Pokémon TCG Test</h2>
        <div className="row">
            {cards.map(card => (
                <div key={card.id} className="col-md-3 mb-4">
                    <div className="card h-100">
                        <img src={card.images.small} className="card-img-top"/>
                        <div className="card-body">
                            <h5 className="card-title text-center">{card.name}</h5>
                            <p><strong>HP:</strong> {card.hp}</p>
                            <p><strong>Rarity:</strong> {card.rarity || 'Unknown'}</p>
                            <p><strong>Types:</strong> {card.types?.join(', ') || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            ))}
            </div>
    </div>
    );
};

export default TcgTestPage;