import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useQuery } from '@tanstack/react-query';
import React, { use, useState } from 'react';
import { useParams } from 'react-router';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Spinner from '../../../components/Spinner';
import { AuthContext } from '../../../contexts/AuthContext';

const PaymentForm = () => {

    const stripe = useStripe();
    const elements = useElements();
    const { parcelId } = useParams();
    const axiosSecure = useAxiosSecure();
    const { user } = use(AuthContext);

    const [errorMessage, setErrorMessage] = useState('');

    const { isPending, data: parcelInfo = {}, isError, error } = useQuery({
        queryKey: ['parcels', parcelId],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels/${parcelId}`);
            return res.data;
        }
    })


    if (isPending) {
        return <Spinner></Spinner>
    }

    console.log(parcelInfo)
    const amount = parcelInfo.deliveryCost;
    const amountInCents = amount * 100;
    console.log(amountInCents);

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


        // step-2: create payment intent
        const res = await axiosSecure.post('/create-payment', {
            amountInCents,
            parcelId
        })

        const clientSecret = res.data.clientSecret;

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: user?.displayName || 'Guest',
                    email: user?.email || 'unknown@example.com',
                }
            },
        });

        if (result.error) {
            console.log(result.error.message);
        }
        else {
            if (result.paymentIntent.status === 'succeeded') {
                console.log('Payment Succeed');
                console.log(result);

                // mark parcel and create Payment History
                const paymentData = {
                    parcelId,
                    email: user?.email,
                    amount: amountInCents,
                    transactionId: result.paymentIntent.id,
                    paymentMethod: result.paymentIntent.payment_method_types,
                }

                await axiosSecure.post('/payments/confirm', paymentData);
            }
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className='space-y-4 bg-white p-6 rounded-xl shadow-md w-full max-w-md mx-auto'>
                <CardElement className='p-2 border rounded'></CardElement>
                <button type='submit'
                    className='btn btn-primary w-full'
                    disabled={!stripe}>
                    PAY ${amount}
                </button>
                {
                    errorMessage && <p className='text-red-500'>{errorMessage}</p>
                }
            </form>
        </div>
    );
};

export default PaymentForm;