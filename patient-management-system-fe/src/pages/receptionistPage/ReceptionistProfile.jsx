import React from 'react';

const ReceptionistProfile = () => {
    return (
        <main className="flex-1 overflow-y-auto bg-gray-50/30 p-8">

            <div className="relative bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div className="absolute top-4 right-6 bg-gray-100 text-gray-600 text-[11px] font-semibold px-3 py-1.5 rounded-full">
                    System Admin View
                </div>

                <div className="flex items-center gap-6 mt-6 md:mt-0">
                    <div className="relative">
                        <img className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm" src="https://i.pravatar.cc/150?img=32" alt="Sarah Jenkins" />
                        <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-gray-900">Sarah Jenkins</h1>
                            <span className="bg-green-100 text-green-600 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                                Verified Employee
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                            <span className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                Head Receptionist
                            </span>
                            <span className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                West Wing - Front Desk A
                            </span>
                        </div>
                        <p className="text-sm text-gray-400 flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path></svg>
                            Emp ID: #RECP-2024-008
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                        Edit Profile
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 font-medium text-sm shadow-sm shadow-indigo-200 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        Manage Access
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                        </div>
                        <span className="flex items-center gap-1 text-[11px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                            +12%
                        </span>
                    </div>
                    <h3 className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Check-ins Today</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-1 mb-1">42</p>
                    <p className="text-xs text-gray-400">Target: 50 | 8 remaining</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <span className="flex items-center gap-1 text-[11px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                            +12%
                        </span>
                    </div>
                    <h3 className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Avg. Wait Time</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-1 mb-1">8.4m</p>
                    <p className="text-xs text-gray-400">Efficient flow maintained</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <span className="flex items-center gap-1 text-[11px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                            +12%
                        </span>
                    </div>
                    <h3 className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Complaints Handled</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-1 mb-1">0</p>
                    <p className="text-xs text-gray-400">100% resolution rate</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                        </div>
                        <span className="flex items-center gap-1 text-[11px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                            +12%
                        </span>
                    </div>
                    <h3 className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Pending Tasks</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-1 mb-1">15</p>
                    <p className="text-xs text-gray-400">Priority: High (3), Med (12)</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="lg:col-span-2 space-y-6">

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="font-bold text-gray-900 text-lg">Recent Activity History</h2>
                                <p className="text-sm text-gray-400 mt-0.5">Live feed of your system interactions and patient handling</p>
                            </div>
                            <button className="text-indigo-500 text-sm font-semibold flex items-center gap-1 hover:text-indigo-600">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                                View All Logs
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="relative flex gap-4 timeline-item">
                                <div className="relative z-10 w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm timeline-line">
                                    <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                                <div className="pt-2 pb-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h4 className="text-sm font-bold text-gray-900">Patient Check-in Completed</h4>
                                        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded uppercase font-semibold tracking-wide">10 mins ago</span>
                                    </div>
                                    <p className="text-sm text-gray-500">Successfully checked in Mr. Robert Harrison for Dr. Miller's appointment.</p>
                                </div>
                            </div>

                            <div className="relative flex gap-4 timeline-item">
                                <div className="relative z-10 w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm timeline-line">
                                    <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                </div>
                                <div className="pt-2 pb-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h4 className="text-sm font-bold text-gray-900">Schedule Change: Shift Swap</h4>
                                        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded uppercase font-semibold tracking-wide">2 hours ago</span>
                                    </div>
                                    <p className="text-sm text-gray-500">Swapped morning shift with Michael Davis for next Thursday.</p>
                                </div>
                            </div>

                            <div className="relative flex gap-4 timeline-item">
                                <div className="relative z-10 w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm timeline-line">
                                    <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                </div>
                                <div className="pt-2 pb-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h4 className="text-sm font-bold text-gray-900">New Patient Assignment</h4>
                                        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded uppercase font-semibold tracking-wide">4 hours ago</span>
                                    </div>
                                    <p className="text-sm text-gray-500">Assigned 3 walk-in patients to the Urgent Care queue.</p>
                                </div>
                            </div>

                            <div className="relative flex gap-4 timeline-item">
                                <div className="relative z-10 w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm timeline-line">
                                    <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
                                </div>
                                <div className="pt-2 pb-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h4 className="text-sm font-bold text-gray-900">Password Security Update</h4>
                                        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded uppercase font-semibold tracking-wide">1 day ago</span>
                                    </div>
                                    <p className="text-sm text-gray-500">Updated account security questions and recovery email.</p>
                                </div>
                            </div>

                            <div className="relative flex gap-4 timeline-item">
                                <div className="relative z-10 w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm timeline-line">
                                    <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                </div>
                                <div className="pt-2 pb-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h4 className="text-sm font-bold text-gray-900">Profile Information Updated</h4>
                                        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded uppercase font-semibold tracking-wide">2 days ago</span>
                                    </div>
                                    <p className="text-sm text-gray-500">Updated home address and emergency contact information.</p>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="mb-6">
                            <h2 className="font-bold text-gray-900 text-lg">Work Location & Shift Schedule</h2>
                            <p className="text-sm text-gray-400 mt-0.5">Your current assignment and planned working hours</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-[#fafbfd] border border-gray-200 rounded-xl p-5">
                                <div className="flex items-center gap-2 text-indigo-600 mb-4">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                    <span className="font-bold text-sm">Primary Location</span>
                                </div>
                                <div className="mb-4">
                                    <h4 className="font-bold text-gray-900 text-[15px] mb-1">Central General Hospital</h4>
                                    <p className="text-[13px] text-gray-500">Building B, Level 1, Main Lobby Reception</p>
                                </div>
                                <div className="border-t border-gray-200 pt-4">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Desk Assignment</p>
                                    <p className="font-bold text-gray-900 text-sm">Station Alpha-01 (Priority Queue)</p>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-bold text-sm text-gray-900">Current Week Shift</h4>
                                    <span className="text-[10px] text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full font-bold border border-teal-100 uppercase tracking-wide">Active Shift</span>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500 w-8">Mon</span>
                                        <div className="flex-1 mx-4 h-1.5 bg-indigo-50 rounded-full relative">
                                            <div className="absolute left-[10%] right-[30%] h-full bg-indigo-500 rounded-full"></div>
                                        </div>
                                        <span className="text-gray-500 text-xs w-[85px] text-right">08:00 - 16:00</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500 w-8">Tue</span>
                                        <div className="flex-1 mx-4 h-1.5 bg-indigo-50 rounded-full relative">
                                            <div className="absolute left-[10%] right-[30%] h-full bg-indigo-500 rounded-full"></div>
                                        </div>
                                        <span className="text-gray-500 text-xs w-[85px] text-right">08:00 - 16:00</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500 w-8">Wed</span>
                                        <div className="flex-1 mx-4 h-1.5 bg-indigo-50 rounded-full relative">
                                            <div className="absolute left-[10%] right-[30%] h-full bg-indigo-500 rounded-full"></div>
                                        </div>
                                        <span className="text-gray-500 text-xs w-[85px] text-right">08:00 - 16:00</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500 w-8">Thu</span>
                                        <div className="flex-1 mx-4 h-1.5 bg-indigo-50 rounded-full relative">
                                            <div className="absolute left-[10%] right-[30%] h-full bg-indigo-500 rounded-full"></div>
                                        </div>
                                        <span className="text-gray-500 text-xs w-[85px] text-right">08:00 - 16:00</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500 w-8">Fri</span>
                                        <div className="flex-1 mx-4 h-1.5 bg-indigo-50 rounded-full relative">
                                            <div className="absolute left-[10%] right-[30%] h-full bg-indigo-500 rounded-full"></div>
                                        </div>
                                        <span className="text-gray-500 text-xs w-[85px] text-right">08:00 - 16:00</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="space-y-6">

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h2 className="font-bold text-gray-900 text-lg mb-6">Contact Information</h2>
                        <div className="space-y-5">
                            <div className="flex gap-4 items-start">
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0 mt-0.5">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Email Address</p>
                                    <p className="text-sm font-semibold text-gray-900">s.jenkins@medflowpro.com</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0 mt-0.5">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Direct Phone</p>
                                    <p className="text-sm font-semibold text-gray-900">+1 (555) 092-4822</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0 mt-0.5">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Emergency Contact</p>
                                    <p className="text-sm font-semibold text-gray-900">David Jenkins (Husband)</p>
                                    <p className="text-xs text-gray-400">+1 (555) 883-1290</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h2 className="font-bold text-gray-900 text-lg mb-6">Role & Access Control</h2>

                        <div className="bg-[#f8fafc] border border-indigo-100 rounded-xl p-4 mb-6">
                            <div className="flex items-center gap-2 text-indigo-600 mb-1.5">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                                <span className="font-bold text-sm">Standard Receptionist Tier</span>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">Assigned to primary intake and triage operations. Subject to clinical oversight.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full border border-green-200 bg-green-50 flex items-center justify-center text-green-500"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                    <span className="font-medium text-gray-700">Dashboard Access</span>
                                </div>
                                <span className="bg-indigo-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">Allowed</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full border border-green-200 bg-green-50 flex items-center justify-center text-green-500"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                    <span className="font-medium text-gray-700">Patient Records</span>
                                </div>
                                <span className="bg-indigo-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">Allowed</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full border border-green-200 bg-green-50 flex items-center justify-center text-green-500"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                    <span className="font-medium text-gray-700">Queue Management</span>
                                </div>
                                <span className="bg-indigo-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">Allowed</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full border border-green-200 bg-green-50 flex items-center justify-center text-green-500"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                                    <span className="font-medium text-gray-700">Appointment Booking</span>
                                </div>
                                <span className="bg-indigo-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">Allowed</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-400"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg></div>
                                    <span className="font-medium text-gray-700">Staff Profiles</span>
                                </div>
                                <span className="border border-gray-200 text-gray-500 text-[10px] font-semibold px-2 py-0.5 rounded-full">Restricted</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-400"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg></div>
                                    <span className="font-medium text-gray-700">System Billing</span>
                                </div>
                                <span className="border border-gray-200 text-gray-500 text-[10px] font-semibold px-2 py-0.5 rounded-full">Restricted</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h2 className="font-bold text-gray-900 text-lg mb-4">Administrative Actions</h2>
                        <div className="space-y-3">
                            <button className="w-full flex items-center gap-3 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                Edit Account Info
                            </button>
                            <button className="w-full flex items-center gap-3 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
                                Change Password
                            </button>
                            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#cd4e4e] text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors mt-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                                Secure Logout
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm mt-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    </div>
                    <div>
                        <h2 className="font-bold text-gray-900 text-lg">Settings & Preferences</h2>
                        <p className="text-sm text-gray-400">Personalize your experience and notification workflows</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    <div>
                        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-5">Communication</h3>
                        <div className="space-y-5">
                            <label className="flex items-start justify-between cursor-pointer group">
                                <div>
                                    <span className="text-sm font-bold text-gray-900">Email Notifications</span>
                                    <p className="text-[13px] text-gray-500 mt-0.5">Receive daily summaries and emergency schedule changes via email.</p>
                                </div>
                                <input type="checkbox" defaultChecked className="w-4 h-4 mt-1 accent-indigo-500 rounded border-gray-300" />
                            </label>
                            <div className="h-px bg-gray-100"></div>
                            <label className="flex items-start justify-between cursor-pointer group">
                                <div>
                                    <span className="text-sm font-bold text-gray-900">SMS Alerts</span>
                                    <p className="text-[13px] text-gray-500 mt-0.5">Real-time text alerts for high-priority patient arrivals.</p>
                                </div>
                                <input type="checkbox" className="w-4 h-4 mt-1 accent-indigo-500 rounded border-gray-300" />
                            </label>
                            <div className="h-px bg-gray-100"></div>
                            <label className="flex items-start justify-between cursor-pointer group">
                                <div>
                                    <span className="text-sm font-bold text-gray-900">System Sound Alerts</span>
                                    <p className="text-[13px] text-gray-500 mt-0.5">Enable audible 'ping' for new queue assignments.</p>
                                </div>
                                <input type="checkbox" defaultChecked className="w-4 h-4 mt-1 accent-indigo-500 rounded border-gray-300" />
                            </label>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-5">Privacy & Security</h3>
                        <div className="space-y-5">
                            <label className="flex items-start justify-between cursor-pointer group">
                                <div>
                                    <span className="text-sm font-bold text-gray-900">Two-Factor Authentication</span>
                                    <p className="text-[13px] text-gray-500 mt-0.5">Require mobile confirmation for every login attempt.</p>
                                </div>
                                <input type="checkbox" defaultChecked className="w-4 h-4 mt-1 accent-indigo-500 rounded border-gray-300" />
                            </label>
                            <div className="h-px bg-gray-100"></div>
                            <label className="flex items-start justify-between cursor-pointer group">
                                <div>
                                    <span className="text-sm font-bold text-gray-900">Public Profile Visibility</span>
                                    <p className="text-[13px] text-gray-500 mt-0.5">Allow other hospital departments to see your contact info.</p>
                                </div>
                                <input type="checkbox" defaultChecked className="w-4 h-4 mt-1 accent-indigo-500 rounded border-gray-300" />
                            </label>
                            <div className="h-px bg-gray-100"></div>
                            <label className="flex items-start justify-between cursor-pointer group">
                                <div>
                                    <span className="text-sm font-bold text-gray-900">Activity Log Sharing</span>
                                    <p className="text-[13px] text-gray-500 mt-0.5">Share your performance metrics with the department head.</p>
                                </div>
                                <input type="checkbox" defaultChecked className="w-4 h-4 mt-1 accent-indigo-500 rounded border-gray-300" />
                            </label>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-400 font-medium italic">Last synchronized: Today at 09:12 AM</p>
                    <button className="bg-indigo-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-600 text-sm shadow-sm shadow-indigo-200 transition-colors w-full sm:w-auto">
                        Save Changes
                    </button>
                </div>
            </div>
        </main>
    );
};

export default ReceptionistProfile;