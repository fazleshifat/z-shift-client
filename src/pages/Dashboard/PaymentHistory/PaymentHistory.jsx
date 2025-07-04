import React, { use } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Spinner from '../../../components/Spinner';

const PaymentHistory = () => {

    const { user } = use(AuthContext);
    const axiosSecure = useAxiosSecure();

    const { isPending, data: payments = [] } = useQuery({
        queryKey: ['payments', user.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/payments?email=${user?.email}`);
            return res.data;
        }
    })

    if (isPending) {
        return <Spinner></Spinner>
    }

    return (
        <div className="overflow-x-auto rounded-xl shadow-md p-4">
            <h2 className="text-xl font-semibold mb-4">Payment History</h2>

            {payments.length === 0 ? (
                <div className="text-center py-8">
                    No payment history found.
                </div>
            ) : (
                <table className="table table-zebra w-full text-sm">
                    <thead>
                        <tr className="bg-base-200 text-base-content">
                            <th>Serial</th>
                            <th>Parcel ID</th>
                            <th>Email</th>
                            <th>Amount</th>
                            <th>Method</th>
                            <th>Transaction ID</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((payment, index) => (
                            <tr key={payment._id}>
                                <td>{index + 1}</td>
                                <td title={payment.parcelId}>
                                    {String(payment.parcelId).slice(-6)}
                                </td>
                                <td>{payment.email}</td>
                                <td>{(payment.amount / 100).toFixed(2)} {payment.currency}</td>
                                <td>{payment.paymentMethod?.[0]}</td>
                                <td className="text-xs break-all">{payment.transactionId}</td>
                                <td>{new Date(payment.paid_at).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default PaymentHistory;