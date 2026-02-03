import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Package, MapPin, ArrowLeft, CheckCircle } from 'lucide-react';
import { SampleDistribution as SampleType, Location } from '../../types';
import { products } from '../../data/mockData';

export function SampleDistribution() {
  const { user } = useAuth();
  const { addSample, currentDayLog } = useData();
  const navigate = useNavigate();

  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const [productSKU, setProductSKU] = useState('');
  const [quantity, setQuantity] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientType, setRecipientType] = useState<'farmer' | 'distributor' | 'retailer'>('farmer');
  const [purpose, setPurpose] = useState<'trial' | 'demo' | 'follow-up'>('trial');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            timestamp: new Date(),
          });
        },
        () => {
          setCurrentLocation({ lat: 19.9975, lng: 73.7898, timestamp: new Date() });
        }
      );
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentLocation) return;

    const sample: SampleType = {
      id: 'sample-' + Date.now(),
      userId: user?.id || '',
      date: new Date(),
      productSKU,
      quantity: parseFloat(quantity),
      recipientName,
      recipientType,
      purpose,
      location: currentLocation,
      notes,
    };

    addSample(sample);
    setShowSuccess(true);
    setTimeout(() => {
      navigate('/field');
    }, 1500);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Sample Recorded!</h2>
          <p className="text-gray-500">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/field')} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="font-semibold text-lg">Distribute Sample</h1>
            <p className="text-sm text-blue-100">Record sample distribution</p>
          </div>
        </div>
      </div>

      {!currentDayLog && (
        <div className="m-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
          ⚠️ Please start your day first to log samples properly.
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* Product Selection */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-1">Product *</label>
          <select
            value={productSKU}
            onChange={e => setProductSKU(e.target.value)}

            required
          >
            <option value="">Select product</option>
            {products.map(product => (
              <option key={product.sku} value={product.sku}>
                {product.name} ({product.sku})
              </option>
            ))}
          </select>
        </div>

        {/* Quantity */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (kg) *</label>
          <input
            type="number"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}

            placeholder="Enter quantity"
            step="0.5"
            required
          />
        </div>

        {/* Recipient Details */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Name *</label>
            <input
              type="text"
              value={recipientName}
              onChange={e => setRecipientName(e.target.value)}

              placeholder="Enter name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Type *</label>
            <select
              value={recipientType}
              onChange={e => setRecipientType(e.target.value as 'farmer' | 'distributor' | 'retailer')}
className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"

            >
              <option value="farmer">Farmer</option>
              <option value="distributor">Distributor</option>
              <option value="retailer">Retailer</option>
            </select>
          </div>
        </div>

        {/* Purpose */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-2">Purpose *</label>
          <div className="grid grid-cols-3 gap-2">
            {(['trial', 'demo', 'follow-up'] as const).map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setPurpose(p)}
                className={`p-2 rounded-lg border-2 text-sm capitalize transition-colors ${
                  purpose === p
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-600'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <div className={`flex items-center gap-2 p-3 rounded-lg ${currentLocation ? 'bg-blue-50' : 'bg-red-50'}`}>
            <MapPin className={`w-5 h-5 ${currentLocation ? 'text-blue-600' : 'text-red-600'}`} />
            <span className={`text-sm ${currentLocation ? 'text-blue-700' : 'text-red-700'}`}>
              {currentLocation
                ? `${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}`
                : 'Unable to get location'}
            </span>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            placeholder="Add any additional notes..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!currentLocation}

        >
          <Package className="w-5 h-5" />
          Record Sample Distribution
        </button>
      </form>
    </div>
  );
}
