import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useState } from 'react';

const PaymentForm = () => {

    const stripe = useStripe();
    const elements = useElements();

    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const card = elements.getElement(CardElement);

        if (!card) {
            return;
        }

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card
        })

        if (error) {
            setErrorMessage(error.message)
        }
        else {
            setErrorMessage('');
            console.log('payment method', paymentMethod);
        }
    }

    return (
        <div>
            <form onClick={handleSubmit} className='space-y-4 bg-white p-6 rounded-xl shadow-md w-full max-w-md mx-auto'>
                <CardElement className='p-2 border rounded'></CardElement>
                <button type='submit'
                    className='btn btn-primary w-full'
                    disabled={!stripe}>
                    PAY for pickup parcel
                </button>
                {
                    errorMessage && <p className='text-red-500'>{errorMessage}</p>
                }
            </form>
        </div>
    );
};

export default PaymentForm;