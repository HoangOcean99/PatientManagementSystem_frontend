import React from 'react';

const AccountantProfilePage = () => {
    return (
        <main className="flex-1 overflow-y-auto bg-gray-50/30 p-8">
            {/* Header Profile Section */}
            <div className="relative bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div className="absolute top-4 right-6 bg-blue-50 text-blue-600 text-[11px] font-semibold px-3 py-1.5 rounded-full border border-blue-100">
                    Finance Department Access
                </div>

                <div className="flex items-center gap-6 mt-6 md:mt-0">
                    <div className="relative">
                        <img className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm" src="https://i.pravatar.cc/150?img=32" alt="Sarah Jenkins" />
                        <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-gray-900">Sarah Jenkins</h1>
                            <span className="bg-blue-100 text-blue-600 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                                Senior Accountant
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                            <span className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                General Ledger Specialist
                            </span>
                            <span className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                                Finance Block - Room 402
                            </span>
                        </div>
                        <p className="text-sm text-gray-400 flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path></svg>
                            Acc ID: #FIN-2024-042
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors">
                        Edit Profile
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm shadow-sm transition-colors">
                        Security Logs
                    </button>
                </div>
            </div>

            {/* Financial Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-6">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        </div>
                        <span className="flex items-center gap-1 text-[11px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            On Track
                        </span>
                    </div>
                    <h3 className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Invoices Processed</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-1 mb-1">128</p>
                    <p className="text-xs text-gray-400">Month to date: 1,420</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                            High Vol
                        </span>
                    </div>
                    <h3 className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Pending Approvals</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-1 mb-1">24</p>
                    <p className="text-xs text-gray-400">Avg. 2.4h per request</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <span className="flex items-center gap-1 text-[11px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            100%
                        </span>
                    </div>
                    <h3 className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Dispute Resolution</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-1 mb-1">0</p>
                    <p className="text-xs text-gray-400">All discrepancies cleared</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        </div>
                        <span className="flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">
                            Critical
                        </span>
                    </div>
                    <h3 className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Unpaid Bad Debt</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-1 mb-1">08</p>
                    <p className="text-xs text-gray-400">Require immediate follow-up</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Activity Feed */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="font-bold text-gray-900 text-lg">Financial Activity Log</h2>
                                <p className="text-sm text-gray-400 mt-0.5">Records of billing adjustments and payment confirmations</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="relative flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 shadow-sm">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                </div>
                                <div className="pt-2">
                                    <h4 className="text-sm font-bold text-gray-900">Deposit Applied to Invoice #INV-882</h4>
                                    <p className="text-sm text-gray-500">Credited $200.00 from patient deposit to final billing.</p>
                                    <span className="text-[10px] text-gray-400 font-medium">10 mins ago</span>
                                </div>
                            </div>

                            <div className="relative flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0 shadow-sm">
                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                </div>
                                <div className="pt-2">
                                    <h4 className="text-sm font-bold text-gray-900">Daily Revenue Report Exported</h4>
                                    <p className="text-sm text-gray-500">Closing report for 02/03/2026 has been generated and filed.</p>
                                    <span className="text-[10px] text-gray-400 font-medium">2 hours ago</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Role Access */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h2 className="font-bold text-gray-900 text-lg mb-6">Accounting Permissions</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-700">Invoice Generation</span>
                                <span className="bg-blue-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">Full Access</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-700">Refund Processing</span>
                                <span className="bg-blue-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">Full Access</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-700">Tax Reporting</span>
                                <span className="bg-blue-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">Full Access</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-700">Patient Clinical Data</span>
                                <span className="border border-gray-200 text-gray-500 text-[10px] font-semibold px-2 py-0.5 rounded-full">No Access</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default AccountantProfilePage;