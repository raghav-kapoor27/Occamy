import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { ShoppingCart, MapPin, ArrowLeft, CheckCircle } from 'lucide-react';
import { Sale, Location } from '../../types';
import { products } from '../../data/mockData';

export function SalesCapture() {
  const { user } = useAuth();
  const { addSale, currentDayLog } = useData();
  const navigate = useNavigate();

  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const [saleType, setSaleType] = useState<'B2C' | 'B2B'>('B2C');
  const [productSKU, setProductSKU] = useState('');
  const [packSize, setPackSize] = useState('');
  const [quantity, setQuantity] = useState('');
  const [mode, setMode] = useState<'direct' | 'via_distributor'>('direct');
  const [isRepeatOrder, setIsRepeatOrder] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [amount, setAmount] = useState('');

  const selectedProduct = products.find(p => p.sku === productSKU);

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

    const sale: Sale = {
      id: 'sale-' + Date.now(),
      userId: user?.id || '',
      date: new Date(),
      type: saleType,
      productSKU,
      packSize,
      quantity: parseInt(quantity),
      mode,
      isRepeatOrder,
      customerName,
      customerContact,
      location: currentLocation,
      amount: parseFloat(amount),
    };

    addSale(sale);
    setShowSuccess(true);
    setTimeout(() => {
      navigate('/field');
    }, 1500);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Sale Recorded!</h2>
          <p className="text-gray-500">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-purple-600 text-white p-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/field')} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="font-semibold text-lg">Record Sale</h1>
            <p className="text-sm text-purple-100">Capture sales data</p>
          </div>
        </div>
      </div>

      {!currentDayLog && (
        <div className="m-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
          ⚠️ Please start your day first to log sales properly.
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* Sale Type Toggle */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-2">Sale Type</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSaleType('B2C')}
              className={`p-3 rounded-lg border-2 transition-colors ${
                saleType === 'B2C'
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 text-gray-600'
              }`}
            >
              <p className="font-medium">B2C</p>
              <p className="text-xs">Direct to Farmer</p>
            </button>
            <button
              type="button"
              onClick={() => setSaleType('B2B')}
              className={`p-3 rounded-lg border-2 transition-colors ${
                saleType === 'B2B'
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 text-gray-600'
              }`}
            >
              <p className="font-medium">B2B</p>
              <p className="text-xs">Distributor/Reseller</p>
            </button>
          </div>
        </div>

        {/* Product Selection */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product *</label>
            <select
              value={productSKU}
              onChange={e => {
                setProductSKU(e.target.value);
                setPackSize('');
              }}
              className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white"
              required
            >
              <option value="">Select product</option>
              {products.map(product => (
                <option key={product.sku} value={product.sku}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          {selectedProduct && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pack Size *</label>
              <div className="grid grid-cols-3 gap-2">
                {selectedProduct.packSizes.map(size => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setPackSize(size)}
                    className={`p-2 rounded-lg border-2 text-sm transition-colors ${
                      packSize === size
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
            <input
              type="number"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              placeholder="Enter quantity"
              required
            />
          </div>
        </div>

        {/* Customer Details */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {saleType === 'B2C' ? 'Customer Name' : 'Business Name'} *
            </label>
            <input
              type="text"
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              placeholder="Enter name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact (Optional)</label>
            <input
              type="tel"
              value={customerContact}
              onChange={e => setCustomerContact(e.target.value)}
              className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              placeholder="+91 XXXXX XXXXX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹) *</label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              placeholder="Enter total amount"
              required
            />
          </div>
        </div>

        {/* Sale Mode */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-2">Sale Mode</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMode('direct')}
              className={`p-2 rounded-lg border-2 text-sm transition-colors ${
                mode === 'direct'
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 text-gray-600'
              }`}
            >
              Direct Sale
            </button>
            <button
              type="button"
              onClick={() => setMode('via_distributor')}
              className={`p-2 rounded-lg border-2 text-sm transition-colors ${
                mode === 'via_distributor'
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 text-gray-600'
              }`}
            >
              Via Distributor
            </button>
          </div>
        </div>

        {/* Repeat Order */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isRepeatOrder}
              onChange={e => setIsRepeatOrder(e.target.checked)}
              className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <span className="text-sm font-medium text-gray-700">This is a repeat order</span>
          </label>
        </div>

        {/* Location */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <div className={`flex items-center gap-2 p-3 rounded-lg ${currentLocation ? 'bg-purple-50' : 'bg-red-50'}`}>
            <MapPin className={`w-5 h-5 ${currentLocation ? 'text-purple-600' : 'text-red-600'}`} />
            <span className={`text-sm ${currentLocation ? 'text-purple-700' : 'text-red-700'}`}>
              {currentLocation
                ? `${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}`
                : 'Unable to get location'}
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!currentLocation || !packSize}
          className="w-full py-3 text-base bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[48px]"
        >
          <ShoppingCart className="w-5 h-5" />
          Record Sale
        </button>
      </form>
    </div>
  );
}
