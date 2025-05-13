import React, { useState } from 'react';
import axios from 'axios';
import './PaymentForm.css';

const PaymentForm = ({ phoneNumber, onPaymentComplete }) => {
    const [paymentMethod, setPaymentMethod] = useState('');
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        cvv: '',
        expiryDate: ''
    });
    const [otp, setOtp] = useState('');
    const [showOtpField, setShowOtpField] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
        setShowOtpField(false);
        setOtpSent(false);
    };

    const handleCardDetailsChange = (e) => {
        const { name, value } = e.target;
        setCardDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSendOTP = async () => {
        try {
            setLoading(true);
            setError('');
            
            // Validate phone number
            if (!phoneNumber) {
                setError('Phone number is required');
                return;
            }

            console.log('Sending OTP request for phone number:', phoneNumber);
            
            const response = await axios.post('/api/otp/send', {
                phoneNumber: phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`
            });

            console.log('OTP response:', response.data);

            if (response.data.message === 'OTP sent successfully') {
                setOtpSent(true);
                setShowOtpField(true);
            }
        } catch (err) {
            console.error('Error sending OTP:', err.response?.data || err);
            setError(err.response?.data?.message || err.response?.data?.error || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (paymentMethod === 'card' && !otpSent) {
            setError('Please send and verify OTP first');
            return;
        }

        // Here you would typically process the payment
        // For now, we'll just call the onPaymentComplete callback
        onPaymentComplete({
            paymentMethod,
            cardDetails: paymentMethod === 'card' ? cardDetails : null,
            otpVerified: paymentMethod === 'card' ? otpSent : true
        });
    };

    return (
        <div className="payment-form">
            <h2>Payment Details</h2>
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Payment Method</label>
                    <select 
                        value={paymentMethod}
                        onChange={handlePaymentMethodChange}
                        required
                    >
                        <option value="">Select Payment Method</option>
                        <option value="card">Credit/Debit Card</option>
                        <option value="cash">Cash on Delivery</option>
                    </select>
                </div>

                {paymentMethod === 'card' && (
                    <>
                        <div className="form-group">
                            <label>Card Number</label>
                            <input
                                type="text"
                                name="cardNumber"
                                value={cardDetails.cardNumber}
                                onChange={handleCardDetailsChange}
                                placeholder="1234 5678 9012 3456"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>CVV</label>
                            <input
                                type="text"
                                name="cvv"
                                value={cardDetails.cvv}
                                onChange={handleCardDetailsChange}
                                placeholder="123"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Expiry Date</label>
                            <input
                                type="text"
                                name="expiryDate"
                                value={cardDetails.expiryDate}
                                onChange={handleCardDetailsChange}
                                placeholder="MM/YY"
                                required
                            />
                        </div>

                        {!otpSent ? (
                            <button
                                type="button"
                                onClick={handleSendOTP}
                                disabled={loading}
                                className="send-otp-btn"
                            >
                                {loading ? 'Sending...' : 'Send OTP'}
                            </button>
                        ) : (
                            <div className="form-group">
                                <label>OTP</label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="Enter 6-digit OTP"
                                    required
                                />
                            </div>
                        )}
                    </>
                )}

                <button type="submit" className="submit-btn">
                    Complete Payment
                </button>
            </form>
        </div>
    );
};

export default PaymentForm; 