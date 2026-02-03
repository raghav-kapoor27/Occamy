import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { MapPin, Users, User, Camera, ArrowLeft, CheckCircle } from 'lucide-react';
import { Meeting, Location } from '../../types';

export function MeetingLog() {
  const { user } = useAuth();
  const { addMeeting, currentDayLog } = useData();
  const navigate = useNavigate();

  const [meetingType, setMeetingType] = useState<'one-on-one' | 'group'>('one-on-one');
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // One-on-One fields
  const [personName, setPersonName] = useState('');
  const [personCategory, setPersonCategory] = useState<'farmer' | 'seller' | 'influencer'>('farmer');
  const [contactDetails, setContactDetails] = useState('');
  const [businessPotential, setBusinessPotential] = useState('');

  // Group meeting fields
  const [villageName, setVillageName] = useState('');
  const [attendeeCount, setAttendeeCount] = useState('');
  const [groupMeetingType, setGroupMeetingType] = useState('');

  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

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
          // Default location for demo
          setCurrentLocation({ lat: 19.9975, lng: 73.7898, timestamp: new Date() });
        }
      );
    }
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos = Array.from(files).map(file => URL.createObjectURL(file));
      setPhotos(prev => [...prev, ...newPhotos]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentLocation) return;

    const meeting: Meeting = {
      id: 'meeting-' + Date.now(),
      type: meetingType,
      userId: user?.id || '',
      date: new Date(),
      location: currentLocation,
      notes,
      photos,
    };

    if (meetingType === 'one-on-one') {
      meeting.personName = personName;
      meeting.personCategory = personCategory;
      meeting.contactDetails = contactDetails;
      meeting.businessPotential = businessPotential;
    } else {
      meeting.villageName = villageName;
      meeting.attendeeCount = parseInt(attendeeCount);
      meeting.meetingType = groupMeetingType;
    }

    addMeeting(meeting);
    setShowSuccess(true);
    setTimeout(() => {
      navigate('/field');
    }, 1500);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Meeting Logged!</h2>
          <p className="text-gray-500">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-emerald-700 text-white p-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/field')} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="font-semibold text-lg">Log Meeting</h1>
            <p className="text-sm text-emerald-100">Record your interaction</p>
          </div>
        </div>
      </div>

      {!currentDayLog && (
        <div className="m-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
          ⚠️ Please start your day first to log meetings properly.
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* Meeting Type Toggle */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Type</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMeetingType('one-on-one')}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                meetingType === 'one-on-one'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-gray-200 text-gray-600'
              }`}
            >
              <User className="w-5 h-5" />
              <span>One-on-One</span>
            </button>
            <button
              type="button"
              onClick={() => setMeetingType('group')}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                meetingType === 'group'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-gray-200 text-gray-600'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Group</span>
            </button>
          </div>
        </div>

        {/* One-on-One Fields */}
        {meetingType === 'one-on-one' && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Person Name *</label>
              <input
                type="text"
                value={personName}
                onChange={e => setPersonName(e.target.value)}
                className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="Enter name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                value={personCategory}
                onChange={e => setPersonCategory(e.target.value as 'farmer' | 'seller' | 'influencer')}
                className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
              >
                <option value="farmer">Farmer</option>
                <option value="seller">Seller</option>
                <option value="influencer">Influencer (Vet/Expert)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Details</label>
              <input
                type="tel"
                value={contactDetails}
                onChange={e => setContactDetails(e.target.value)}
                className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="+91 XXXXX XXXXX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Potential</label>
              <select
                value={businessPotential}
                onChange={e => setBusinessPotential(e.target.value)}
                className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
              >
                <option value="">Select potential</option>
                <option value="5-10 kg">5-10 kg/month</option>
                <option value="10-25 kg">10-25 kg/month</option>
                <option value="25-50 kg">25-50 kg/month</option>
                <option value="50-100 kg">50-100 kg/month</option>
                <option value="100-200 kg">100-200 kg/month</option>
                <option value="200+ kg">200+ kg/month</option>
              </select>
            </div>
          </div>
        )}

        {/* Group Meeting Fields */}
        {meetingType === 'group' && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Village / Location *</label>
              <input
                type="text"
                value={villageName}
                onChange={e => setVillageName(e.target.value)}
                className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="Enter village name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of Attendees *</label>
              <input
                type="number"
                value={attendeeCount}
                onChange={e => setAttendeeCount(e.target.value)}
                className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="Enter count"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Type *</label>
              <select
                value={groupMeetingType}
                onChange={e => setGroupMeetingType(e.target.value)}
                className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
                required
              >
                <option value="">Select type</option>
                <option value="Awareness Session">Awareness Session</option>
                <option value="Product Demo">Product Demo</option>
                <option value="Training">Training</option>
                <option value="Farmer Gathering">Farmer Gathering</option>
                <option value="Cooperative Meeting">Cooperative Meeting</option>
              </select>
            </div>
          </div>
        )}

        {/* Location */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <div className={`flex items-center gap-2 p-3 rounded-lg ${currentLocation ? 'bg-emerald-50' : 'bg-red-50'}`}>
            <MapPin className={`w-5 h-5 ${currentLocation ? 'text-emerald-600' : 'text-red-600'}`} />
            <span className={`text-sm ${currentLocation ? 'text-emerald-700' : 'text-red-700'}`}>
              {currentLocation
                ? `${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}`
                : 'Unable to get location'}
            </span>
          </div>
        </div>

        {/* Photos */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-2">Photos</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {photos.map((photo, index) => (
              <div key={index} className="relative">
                <img src={photo} alt="" className="w-16 h-16 object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => setPhotos(photos.filter((_, i) => i !== index))}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-emerald-500 transition-colors">
            <Camera className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-500">Add Photos</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
            placeholder="Add any additional notes..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!currentLocation}
          className="w-full py-3 text-base bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
        >
          Log Meeting
        </button>
      </form>
    </div>
  );
}
