import React, { useState } from 'react';
import CardPreviewModal from './CardPreviewModal';
import StatsModal from './StatsModal';

export default function Cards() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [selectedName, setSelectedName] = useState('');
  const [activeActionId, setActiveActionId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const cardsData = [
    {
      id: 1,
      name: 'Sarah Johnson',
      department: 'Engineering',
      image: '/images/sarah.png',
      cardname: 'Sarah Johnson – Senior Developer',
      template: 'Modern Professional',
      status: 'Active',
      totalScans: 80,
    },
    {
      id: 2,
      name: 'Victor Josh',
      department: 'Design',
      image: '/images/michael.png',
      cardname: 'Victor Josh - Senior Designer',
      template: 'Creative',
      status: 'Pending',
      totalScans: 0,
    },
    {
      id: 3,
      name: 'David Wilson',
      department: 'Engineering',
      image: '/images/david.png',
      cardname: 'Victor Josh - Senior Designer',
      template: 'Creative',
      status: 'Revoked',
      totalScans: 0,
    },
    {
      id: 4,
      name: 'Lisa Anderson',
      department: 'Engineering',
      image: '/images/lisa.png',
      cardname: 'Lisa Anderson - Senior Designer',
      template: 'Creative',
      status: 'Active',
      totalScans: 223,
    },
  ];

  const toggleActionMenu = (id) => {
    setActiveActionId(activeActionId === id ? null : id);
  };

  const handleStatusChange = (id, newStatus) => {
    console.log(`Changing status for ${id} to ${newStatus}`);
    setActiveActionId(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header section */}
      <div className="flex flex-col gap-1.5">
        <div className="text-lg text-neutral-900 font-semibold">Digital Cards Management</div>
        <div className="text-sm text-gray-600 font-normal">
          Manage employee digital business cards and analytics.
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {/* Total Cards Card */}
        <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="text-sm text-gray-600 font-medium">Total Cards</div>
              <div className="mt-2 text-lg text-neutral-900 font-semibold">32</div>
            </div>
            <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-blue-100 shadow-sm">
              <img
                className="h-5 w-5 object-contain"
                src="/images/total_cards.png"
                alt="Total Cards icon"
              />
            </div>
          </div>
        </div>

        {/* Active Cards Card */}
        <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="text-sm text-gray-600 font-medium">Active Cards</div>
              <div className="mt-2 text-lg text-neutral-900 font-semibold">32</div>
            </div>
            <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-green-100 shadow-sm">
              <img
                className="h-5 w-5 object-contain"
                src="/images/approved.png"
                alt="Active Cards icon"
              />
            </div>
          </div>
        </div>

        {/* Total Scans Card */}
        <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="text-sm text-gray-600 font-medium">Total Scans</div>
              <div className="mt-2 text-lg text-neutral-900 font-semibold">7,000</div>
            </div>
            <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-orange-100 shadow-sm">
              <img
                className="h-5 w-5 object-contain"
                src="/images/scans.png"
                alt="Total Scans icon"
              />
            </div>
          </div>
        </div>

        {/* Average Scans Card */}
        <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="text-sm text-gray-600 font-medium">Avg. Scans/Card</div>
              <div className="mt-2 text-lg text-neutral-900 font-semibold">7,000</div>
            </div>
            <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-blue-100 shadow-sm">
              <img
                className="h-5 w-5 object-contain"
                src="/images/average_attendance.png"
                alt="Average Scans icon"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Template Usage Section */}
      <div className="flex flex-col gap-4 p-4 rounded-xl shadow-sm bg-white">
        <div className="text-sm text-neutral-900 font-semibold">Template Usage</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Modern Professional */}
          <div className="flex flex-col justify-between p-4 rounded-xl shadow-sm bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600 font-medium">Modern Professional</div>
              <img src="/images/departments_dot.png" alt="Template icon" className="w-5 h-5" />
            </div>
            <div className="text-lg text-neutral-900 font-semibold">45%</div>
            <div className="text-xs text-gray-600">of total cards</div>
          </div>

          {/* Creative */}
          <div className="flex flex-col justify-between p-4 rounded-xl shadow-sm bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600 font-medium">Creative</div>
              <img src="/images/onleave_dot.png" alt="Template icon" className="w-5 h-5" />
            </div>
            <div className="text-lg text-neutral-900 font-semibold">26%</div>
            <div className="text-xs text-gray-600">of total cards</div>
          </div>

          {/* Professional */}
          <div className="flex flex-col justify-between p-4 rounded-xl shadow-sm bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600 font-medium">Professional</div>
              <img src="/images/active_dot.png" alt="Template icon" className="w-5 h-5" />
            </div>
            <div className="text-lg text-neutral-900 font-semibold">14%</div>
            <div className="text-xs text-gray-600">of total cards</div>
          </div>

          {/* Minimal */}
          <div className="flex flex-col justify-between p-4 rounded-xl shadow-sm bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600 font-medium">Minimal</div>
              <img src="/images/minimal_dot.png" alt="Template icon" className="w-5 h-5" />
            </div>
            <div className="text-lg text-neutral-900 font-semibold">14%</div>
            <div className="text-xs text-gray-600">of total cards</div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 h-10 shadow-md bg-white flex-1">
          <div className="flex justify-center items-center h-5">
            <img width="16.5px" height="16.5px" src="/images/search.png" alt="Search icon" />
          </div>
          <input
            type="text"
            placeholder="Search digital cards"
            className="flex-1 text-xs text-gray-400 font-normal outline-none"
          />
        </div>

        <div className="flex flex-row justify-center items-center gap-2">
          <div className="flex flex-row justify-center items-center gap-2 p-2 rounded-lg border border-neutral-200 w-[120px] h-10 bg-white cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="text-xs text-neutral-900 font-semibold">All Status</div>
            <div className="flex flex-col justify-center items-center w-4 h-4">
              <img width="9.5px" height="5.1px" src="/images/dropdown.png" alt="Dropdown icon" />
            </div>
          </div>

          <div className="flex flex-row justify-center items-center gap-2 p-2 rounded-lg border border-neutral-200 w-[150px] h-10 bg-white cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex flex-row items-center gap-1">
              <div className="flex justify-center items-center h-5">
                <img width="16.3px" height="16.3px" src="/images/filter.png" alt="Filter icon" />
              </div>
              <div className="text-xs text-neutral-900 font-semibold">All Departments</div>
            </div>
            <div className="flex flex-col justify-center items-center w-4 h-4">
              <img width="9.5px" height="5.1px" src="/images/dropdown.png" alt="Dropdown icon" />
            </div>
          </div>
        </div>
      </div>

      {/* Digital Cards Table */}
      <div className="flex flex-col gap-4 p-4 rounded-xl shadow-sm bg-white">
        <div className="text-lg text-neutral-900 font-semibold">
          Digital Cards Management ({cardsData.length})
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-gray-500 border-b">
              <tr>
                <th className="py-3 font-medium">Employee</th>
                <th className="py-3 font-medium">Card Name</th>
                <th className="py-3 font-medium">Template</th>
                <th className="py-3 font-medium">Status</th>
                <th className="py-3 font-medium">Total Scans</th>
                <th className="py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cardsData
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((card) => (
                  <tr key={card.id} className="border-b">
                    <td className="flex items-center gap-3 py-4">
                      <img
                        src={card.image}
                        alt={card.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-sm text-neutral-900 font-medium">{card.name}</div>
                        <div className="text-xs text-gray-600">{card.department}</div>
                      </div>
                    </td>
                    <td className="text-sm text-gray-600">{card.cardname}</td>
                    <td className="text-sm text-gray-600">{card.template}</td>
                    <td>
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          card.status === 'Pending'
                            ? 'bg-gray-100 text-gray-800'
                            : card.status === 'Active'
                              ? 'bg-teal-100 text-teal-800'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {card.status}
                      </span>
                    </td>
                    <td className="text-sm text-gray-600">{card.totalScans}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        {/* View Button */}
                        <button
                          className="text-gray-600 hover:text-gray-900"
                          onClick={() => setSelectedCard(card)}
                          aria-label="View details"
                        >
                          <img src="/images/eye_icon.png" alt="View" className="w-5 h-5" />
                        </button>

                        {/* Stats Button */}
                        <button
                          className="text-gray-600 hover:text-gray-900"
                          onClick={() => {
                            setSelectedName(card.name);
                            setIsStatsOpen(true);
                          }}
                          aria-label="View stats"
                        >
                          <img src="/images/stats.png" alt="Stats" className="w-5 h-5" />
                        </button>

                        {/* Actions Menu */}
                        <div className="relative">
                          <button
                            className="text-gray-600 text-xl"
                            onClick={() => toggleActionMenu(card.id)}
                            aria-label="Open actions menu"
                          >
                            ⋯
                          </button>

                          {activeActionId === card.id && (
                            <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 shadow-lg z-40 rounded-md">
                              <button
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                                onClick={() => handleStatusChange(card.id, 'Active')}
                              >
                                <img
                                  src="/images/issued_card.png"
                                  alt="Issue Card"
                                  className="w-4 h-4"
                                />
                                Issue Card
                              </button>

                              <button
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 border-t border-gray-100 hover:bg-red-50"
                                onClick={() => handleStatusChange(card.id, 'Revoked')}
                              >
                                <img
                                  src="/images/revoke_card.png"
                                  alt="Revoke Card"
                                  className="w-4 h-4"
                                />
                                Revoke Card
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div>
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, cardsData.length)} of {cardsData.length} entries
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-lg border border-gray-200 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
            >
              Previous
            </button>

            {Array.from({ length: Math.ceil(cardsData.length / itemsPerPage) }, (_, index) => {
              const pageNum = index + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 rounded-lg ${currentPage === pageNum ? 'bg-teal-500 text-white' : 'border border-gray-200 hover:bg-gray-50'}`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  prev < Math.ceil(cardsData.length / itemsPerPage) ? prev + 1 : prev
                )
              }
              disabled={currentPage >= Math.ceil(cardsData.length / itemsPerPage)}
              className={`px-3 py-1 rounded-lg border border-gray-200 ${currentPage >= Math.ceil(cardsData.length / itemsPerPage) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CardPreviewModal
        isOpen={!!selectedCard}
        onClose={() => setSelectedCard(null)}
        cardData={selectedCard}
      />

      <StatsModal isOpen={isStatsOpen} onClose={() => setIsStatsOpen(false)} name={selectedName} />
    </div>
  );
}
