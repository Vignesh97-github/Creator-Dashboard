import React, { useState, useEffect } from 'react';
import { creditService } from '../../services/api';
import Loader from '../ui/Loader';

const CreditStats = () => {
  const [stats, setStats] = useState({
    balance: 0,
    history: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCreditStats();
  }, []);

  const fetchCreditStats = async () => {
    try {
      const [balance, history] = await Promise.all([
        creditService.getBalance(),
        creditService.getHistory()
      ]);
      setStats({ balance, history });
    } catch (err) {
      setError(err.message || 'Failed to fetch credit stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader size="lg" />;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Credit Balance</h2>
      
      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <div className="mb-6">
        <div className="text-3xl font-bold text-indigo-600">
          {stats.balance} Credits
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Available for premium features
        </p>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Recent Transactions</h3>
        <div className="space-y-3">
          {stats.history.slice(0, 5).map((transaction) => (
            <div
              key={transaction._id}
              className="flex items-center justify-between py-2 border-b border-gray-100"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {transaction.type}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(transaction.date).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`text-sm font-medium ${
                  transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {transaction.amount > 0 ? '+' : ''}
                {transaction.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreditStats;