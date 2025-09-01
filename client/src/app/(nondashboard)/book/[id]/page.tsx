"use client";

import { useState, useEffect } from "react";
import { useGetPropertyQuery } from "@/state/api";
import { useParams } from "next/navigation";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Footer from "../../landing/Footer";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const BookingPage = () => {
  const params = useParams();
  const propertyId = parseInt(params.id as string);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState(1);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [isLoadingDates, setIsLoadingDates] = useState(false);
  
  const {
    data: property,
    isLoading,
    isError,
  } = useGetPropertyQuery(propertyId);

  // Fetch booked dates when component loads
  useEffect(() => {
    fetchBookedDates();
  }, [propertyId]);

  const fetchBookedDates = async () => {
    setIsLoadingDates(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002'}/bookings/booked-dates/${propertyId}`
      );
      const data = await response.json();
      
      if (response.ok) {
        const dates = data.bookedDates.map((dateStr: string) => new Date(dateStr));
        setBookedDates(dates);
      }
    } catch (error) {
      console.error('Error fetching booked dates:', error);
    } finally {
      setIsLoadingDates(false);
    }
  };

  const calculateNights = () => {
    if (checkIn && checkOut) {
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      return nights > 0 ? nights : 0;
    }
    return 0;
  };

  const dailyRate = property ? Math.round(property.pricePerMonth / 30) : 0;
  const totalPrice = calculateNights() * dailyRate;

  const isDateBooked = (date: Date) => {
    return bookedDates.some(bookedDate => 
      bookedDate.toDateString() === date.toDateString()
    );
  };

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      if (date < new Date()) {
        return 'past-date';
      }
      if (isDateBooked(date)) {
        return 'booked-date';
      }
      return 'available-date';
    }
    return '';
  };

  const tileDisabled = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      return date < new Date() || isDateBooked(date);
    }
    return false;
  };

  const handleDateClick = (value: Value) => {
    if (Array.isArray(value)) return;
    
    const selectedDate = value as Date;
    
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(selectedDate);
      setCheckOut(null);
    } else if (checkIn && !checkOut) {
      if (selectedDate > checkIn) {
        const datesInBetween = getDatesInRange(checkIn, selectedDate);
        const hasBookedDatesInBetween = datesInBetween.some(date => isDateBooked(date));
        
        if (hasBookedDatesInBetween) {
          alert('❌ Cannot select this range. There are booked dates in between.');
          return;
        }
        
        setCheckOut(selectedDate);
      } else {
        setCheckIn(selectedDate);
        setCheckOut(null);
      }
    }
  };

  const getDatesInRange = (start: Date, end: Date): Date[] => {
    const dates = [];
    const currentDate = new Date(start);
    
    while (currentDate <= end) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const bookingData = {
        propertyId,
        checkIn: checkIn.toISOString().split('T')[0],
        checkOut: checkOut.toISOString().split('T')[0],
        guests,
        guestName,
        guestEmail,
        guestPhone
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002'}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      const data = await response.json();

      if (response.ok) {
        alert('🎉 Booking request submitted successfully! We will confirm your booking soon.');
        setCheckIn(null);
        setCheckOut(null);
        setGuestName('');
        setGuestEmail('');
        setGuestPhone('');
        fetchBookedDates();
      } else {
        alert(`❌ ${data.message || 'Booking failed'}`);
      }
    } catch (error) {
      alert('❌ Error submitting booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (isError || !property) return <div className="min-h-screen flex items-center justify-center">Property not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Custom CSS for calendar */}
      <style jsx global>{`
        .available-date {
          background-color: #10b981 !important;
          color: white !important;
        }
        
        .booked-date {
          background-color: #ef4444 !important;
          color: white !important;
        }
        
        .past-date {
          background-color: #9ca3af !important;
          color: #6b7280 !important;
        }
        
        .react-calendar__tile--active {
          background-color: #3b82f6 !important;
          color: white !important;
        }
        
        .react-calendar__tile--range {
          background-color: #dbeafe !important;
          color: #1e40af !important;
        }
        
        .react-calendar__tile--rangeStart,
        .react-calendar__tile--rangeEnd {
          background-color: #3b82f6 !important;
          color: white !important;
        }

        .react-calendar {
          width: 100% !important;
          max-width: none !important;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 20px;
          font-family: inherit;
        }

        .react-calendar__month-view__weekdays {
          text-transform: uppercase;
          font-weight: bold;
          font-size: 0.75rem;
          color: #6b7280;
        }

        .react-calendar__tile {
          max-width: 100%;
          padding: 12px 0;
          background: none;
          text-align: center;
          line-height: 16px;
          font-size: 0.875rem;
          border: none;
          border-radius: 4px;
          margin: 2px;
        }

        .react-calendar__navigation button {
          min-width: 44px;
          background: none;
          border: none;
          font-size: 16px;
          margin-top: 8px;
        }
      `}</style>

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Book Your Stay</h1>
          <p className="text-gray-600 mt-2">Select your dates and complete your booking</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8 min-h-[600px]">
          
          {/* Property Info */}
          <div className="bg-white rounded-xl shadow-sm p-8 h-fit">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">{property.name}</h2>
            <p className="text-gray-600 mb-6">{property?.location?.address}</p>
            
            <div className="bg-green-50 p-6 rounded-lg border border-green-200 mb-6">
              <p className="text-3xl font-bold text-green-600 mb-2">
                ${dailyRate}/night
              </p>
              <p className="text-sm text-gray-600">
                Monthly rate: ${property.pricePerMonth.toLocaleString()}
              </p>
            </div>

            {/* Legend */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-4 text-gray-900">Calendar Legend</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Available</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Booked</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-gray-400 rounded-full"></div>
                  <span className="text-sm text-gray-700">Past dates</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Your selection</span>
                </div>
              </div>
            </div>

            {/* Property Features */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-semibold mb-3 text-gray-900">Property Features</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Security Deposit: ${property.securityDeposit?.toLocaleString()}</p>
                <p>• Application Fee: ${property.applicationFee?.toLocaleString()}</p>
                <p>• {property.isPetsAllowed ? 'Pets Allowed' : 'No Pets'}</p>
                <p>• {property.isParkingIncluded ? 'Parking Included' : 'No Parking'}</p>
              </div>
            </div>
          </div>

          {/* Calendar */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">Select Your Dates</h2>
            
            {isLoadingDates ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Loading calendar...</div>
              </div>
            ) : (
              <div className="space-y-6">
                <Calendar
                  onChange={handleDateClick}
                  value={checkIn && checkOut ? [checkIn, checkOut] : checkIn}
                  selectRange={false}
                  tileClassName={tileClassName}
                  tileDisabled={tileDisabled}
                  minDate={new Date()}
                  className="w-full"
                />

                {/* Selected dates display */}
                {checkIn && (
                  <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-3">Selected Dates</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Check-in:</span> {checkIn.toDateString()}</p>
                      {checkOut && (
                        <>
                          <p><span className="font-medium">Check-out:</span> {checkOut.toDateString()}</p>
                          <div className="pt-3 border-t border-blue-200">
                            <p className="text-lg font-bold text-blue-900">
                              {calculateNights()} nights - ${totalPrice.toLocaleString()} total
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Booking Form */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">Guest Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {[1,2,3,4,5,6,7,8].map(num => (
                    <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              {/* Booking Summary */}
              {checkIn && checkOut && (
                <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Booking Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>${dailyRate} × {calculateNights()} nights</span>
                      <span>${totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service fee</span>
                      <span>$0</span>
                    </div>
                    <hr className="my-3" />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={!checkIn || !checkOut || isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg"
              >
                {isSubmitting ? 'Submitting...' : checkIn && checkOut ? `Book ${calculateNights()} nights - $${totalPrice.toLocaleString()}` : 'Select dates to continue'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookingPage;