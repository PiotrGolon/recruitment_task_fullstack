import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const supportedCurrencies = ['EUR', 'USD', 'CZK', 'IDR', 'BRL'];

function CurrencyExchange() {
    const [rates, setRates] = useState([]);
    const [amount, setAmount] = useState('');
    const [selectedCurrency, setSelectedCurrency] = useState(supportedCurrencies[0]);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
   
    const fetchRates = useCallback(async () => {
        try {
            const response = await axios.get(`http://api.nbp.pl/api/exchangerates/tables/A/${date}/`);
            const filteredRates = response.data[0].rates.filter(rate => supportedCurrencies.includes(rate.code));
            setRates(filteredRates);
        } catch (error) {
            console.error('Error fetching data: ', error);
            setRates([]);
        }
    }, [date]);

    useEffect(() => {
        fetchRates();
    }, [fetchRates]);

    const handleAmountChange = (event) => {
        setAmount(event.target.value);
    };

    const handleCurrencyChange = (event) => {
        setSelectedCurrency(event.target.value);
    };

    const handleDateChange = (event) => {
        setDate(event.target.value);
    };

    const calculateExchange = () => {
        const rate = rates.find(r => r.code === selectedCurrency);
        return rate ? (amount / rate.mid).toFixed(2) : 'Brak danych';
    };
    
    return (
        <div className='flex items-center justify-center h-screen bg-blue-50'>
            <div className="flex flex-col items-center justify-center h-auto w-80 bg-blue-200 border-2 border-blue-500 rounded-xl p-4 space-y-4">
                <div className="w-auto">
                        <label className="block text-blue-700 text-sm font-bold mb-1" htmlFor="date">
                            Data:
                        </label>
                    <input className='p-2 rounded-xl bg-blue-100 border-blue-500 text-blue-700 focus:border-blue-700' type="date" value={date} onChange={handleDateChange} min="2023-01-01" />
                </div>
                <div className='flex bg-blue-300 rounded-xl items-center justify-between p-2'>
                    <input className='h-10 w-3/5 bg-blue-100 border-blue-500 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-700 text-blue-700' type="number" value={amount} onChange={handleAmountChange} placeholder="Kwota w PLN" />
                        <select className='h-10 w-2/5 bg-blue-100 border-blue-500 rounded-lg ml-2 text-blue-700' value={selectedCurrency} onChange={handleCurrencyChange}>
                            {supportedCurrencies.map(currency => (
                                <option key={currency} value={currency}>{currency}</option>
                            ))}
                        </select>
                </div>
                <div className='h-auto w-3/5 bg-blue-100 rounded-xl flex items-center justify-center'>
                    <p className='text-blue-700 font-bold'>
                        {amount} PLN to {calculateExchange()} {selectedCurrency}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default CurrencyExchange;