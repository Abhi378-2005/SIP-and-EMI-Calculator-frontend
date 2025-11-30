import { useState } from 'react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('sip'); // 'sip' or 'emi'
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Form State
  const [inputs, setInputs] = useState({
    amount: '',
    rate: '',
    years: '',
  });

  const handleInputChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const calculate = async () => {
    setLoading(true);
    setResult(null);
    
    // Decide which endpoint to hit based on the active tab
  const apiUrl = import.meta.env.VITE_API_URL;

  const endpoint = activeTab === 'sip' 
  ? `${apiUrl}/calculate-sip` 
  : `${apiUrl}/calculate-emi`;

    // Prepare payload (Backend expects different variable names)
    const payload = activeTab === 'sip' 
      ? { monthlyInvestment: Number(inputs.amount), annualRate: Number(inputs.rate), years: Number(inputs.years) }
      : { loanAmount: Number(inputs.amount), annualRate: Number(inputs.rate), years: Number(inputs.years) };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error connecting to backend:", error);
      alert("Backend is not running! Make sure you started 'node server.js'");
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <div className="calculator-card">
        <h1>Finance Calculator</h1>
        
        {/* Tab Switcher */}
        <div className="tabs">
          <button 
            className={activeTab === 'sip' ? 'active' : ''} 
            onClick={() => { setActiveTab('sip'); setResult(null); }}
          >
            SIP Investor
          </button>
          <button 
            className={activeTab === 'emi' ? 'active' : ''} 
            onClick={() => { setActiveTab('emi'); setResult(null); }}
          >
            EMI Loan
          </button>
        </div>

        {/* Input Form */}
        <div className="form-group">
          <label>{activeTab === 'sip' ? 'Monthly Investment (₹)' : 'Loan Amount (₹)'}</label>
          <input 
            type="number" 
            name="amount" 
            value={inputs.amount} 
            onChange={handleInputChange} 
            placeholder="e.g. 5000"
          />

          <label>Annual Interest Rate (%)</label>
          <input 
            type="number" 
            name="rate" 
            value={inputs.rate} 
            onChange={handleInputChange} 
            placeholder="e.g. 12"
          />

          <label>Time Period (Years)</label>
          <input 
            type="number" 
            name="years" 
            value={inputs.years} 
            onChange={handleInputChange} 
            placeholder="e.g. 5"
          />

          <button className="calc-btn" onClick={calculate} disabled={loading}>
            {loading ? 'Calculating...' : 'Calculate'}
          </button>
        </div>

        {/* Results Display */}
        {result && (
          <div className="results">
            {activeTab === 'sip' ? (
              <>
                <div className="result-item">
                  <span>Invested:</span>
                  <strong>₹{result.investedAmount.toLocaleString()}</strong>
                </div>
                <div className="result-item">
                  <span>Returns:</span>
                  <strong>₹{result.estimatedReturns.toLocaleString()}</strong>
                </div>
                <div className="result-item highlight">
                  <span>Total Value:</span>
                  <strong>₹{result.totalValue.toLocaleString()}</strong>
                </div>
              </>
            ) : (
              <>
                <div className="result-item highlight">
                  <span>Monthly EMI:</span>
                  <strong>₹{result.emi.toLocaleString()}</strong>
                </div>
                <div className="result-item">
                  <span>Total Interest:</span>
                  <strong>₹{result.totalInterest.toLocaleString()}</strong>
                </div>
                <div className="result-item">
                  <span>Total Payable:</span>
                  <strong>₹{result.totalAmount.toLocaleString()}</strong>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;