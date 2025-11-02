import React, { useState } from 'react';
import CardModal from './CardModal';
import ShareCardModal from './ShareCardModal';
import EditCardModal from './EditCardModal';
import BusinessCardModal from './BusinessCardModal';
import CreateBusinessCardModal from './CreateBusinessCardModal';
import CardAnalyticsModal from './CardAnalyticsModal';
import ViewProfileModal from './ViewProfileModal.js';

const Cards = () => {
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isShareCardModalOpen, setIsShareCardModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isEditCardModalOpen, setIsEditCardModalOpen] = useState(false);
  const [activeCardTab, setActiveCardTab] = useState('idCards');
  const [isBusinessCardModalOpen, setIsBusinessCardModalOpen] = useState(false);
  const [isCreateBusinessCardModalOpen, setIsCreateBusinessCardModalOpen] = useState(false);
  const [isCardAnalyticsModalOpen, setIsCardAnalyticsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handlePreviewClick = (card) => {
    setSelectedCard(card);
    if (activeCardTab === 'idCards') {
      setIsCardModalOpen(true);
    } else {
      setIsBusinessCardModalOpen(true);
    }
  };

  const handleCreateBusinessCard = () => {
    setIsCreateBusinessCardModalOpen(true);
  };

  const handleAnalyticsClick = (card) => {
    setSelectedCard(card);
    setIsCardAnalyticsModalOpen(true);
  };

  const handleDownloadClick = (card) => {
    setSelectedCard(card);
    setIsShareCardModalOpen(true);
  };

  const handleEditClick = (card) => {
    setSelectedCard(card);
    setIsEditCardModalOpen(true);
  };

  const sampleIdCards = [
    {
      id: 1,
      company: 'OnTap Technologies',
      name: 'Victor Smith',
      position: 'Product Designer',
      employeeId: '1003E84155',
      department: 'Design & UX',
      accessLevel: 'Standard',
      status: 'Active',
      expiryDate: '03/09/2028',
      bgColor: 'bg-red-700',
      hoverBgColor: 'hover:bg-red-800',
      borderColor: 'border-red-500',
    },
    {
      id: 2,
      company: 'OnTap Technologies',
      name: 'Sarah Johnson',
      position: 'Product Designer',
      employeeId: '1003E84155',
      department: 'Marketing',
      accessLevel: 'Standard',
      status: 'Active',
      expiryDate: '03/09/2028',
      bgColor: 'bg-teal-500',
      hoverBgColor: 'hover:bg-teal-600',
      borderColor: 'border-emerald-300',
    },
  ];

  const sampleBusinessCards = [
    {
      id: 1,
      name: 'Victor Smith',
      position: 'Product Designer',
      scans: 245,
      connections: 18,
      lastActivity: '2 hours ago',
      status: 'Active',
      bgColor: 'bg-red-700',
      borderColor: 'border-red-500',
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      position: 'Product Designer',
      scans: 189,
      connections: 24,
      lastActivity: '5 hours ago',
      status: 'Active',
      bgColor: 'bg-teal-500',
      borderColor: 'border-emerald-300',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Cards Header */}
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col justify-start items-start gap-1.5">
          <div className="text-lg text-neutral-900 font-semibold">My Cards</div>
          <div className="text-sm text-gray-600 font-normal">
            Manage your digital business cards and track their performance.
          </div>
        </div>
        {activeCardTab === 'businessCards' && (
          <button
            className="flex flex-row justify-center items-center gap-2 p-3 rounded-md h-12 bg-teal-500 hover:bg-teal-600 transition-colors"
            onClick={handleCreateBusinessCard}
          >
            <div className="flex justify-center items-center w-5 h-5">
              <img width="15.4px" height="15.3px" src="/images/addtask.png" alt="Add icon" />
            </div>
            <div className="text-sm text-white font-medium">Create New Business Card</div>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-row justify-center items-center rounded-lg border border-slate-100 h-10 bg-slate-50 overflow-hidden">
        <div
          className={`flex flex-row justify-center items-center h-10 min-w-[50%] cursor-pointer border-r border-slate-100 ${activeCardTab === 'idCards' ? 'bg-white' : 'hover:bg-gray-50 transition-colors'}`}
          onClick={() => setActiveCardTab('idCards')}
        >
          <div className="flex flex-row justify-center items-center gap-1">
            <div className="flex justify-center items-center h-5">
              <img width="16.6px" height="13.1px" src="/images/id.png" alt="ID Card icon" />
            </div>
            <div className="text-xs text-neutral-900 font-semibold tracking-wide">ID Cards</div>
          </div>
        </div>
        <div
          className={`flex flex-row justify-center items-center h-10 min-w-[50%] cursor-pointer ${activeCardTab === 'businessCards' ? 'bg-white' : 'hover:bg-gray-50 transition-colors'}`}
          onClick={() => setActiveCardTab('businessCards')}
        >
          <div className="flex flex-row justify-center items-center gap-1">
            <div className="flex justify-center items-center h-5">
              <img
                width="16.6px"
                height="13.1px"
                src="/images/business.png"
                alt="Business Card icon"
              />
            </div>
            <div className="text-xs text-neutral-900 font-semibold tracking-wide">
              Business Cards
            </div>
          </div>
        </div>
      </div>

      {/* Cards Display - DYNAMIC BASED ON SELECTED TAB */}
      {activeCardTab === 'idCards' && (
        <div className="grid grid-cols-3 gap-6 w-full">
          {sampleIdCards.map((card) => (
            <div
              key={card.id}
              className="flex flex-col justify-center items-center rounded-xl w-full shadow bg-white p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex flex-col justify-start items-start gap-4 w-full">
                <div
                  className={`flex flex-col justify-start items-start gap-4 p-4 rounded-xl w-full h-[153px] ${card.bgColor} ${card.hoverBgColor} transition-colors duration-200`}
                >
                  <div className="flex flex-row justify-between items-start w-full">
                    <div className="flex flex-col justify-start items-start gap-1">
                      <div className="text-base text-white font-bold">{card.company}</div>
                      <div className="text-sm text-rose-200 font-medium">Employee ID</div>
                    </div>
                    <div className="flex justify-center items-center rounded-md w-10 h-10 bg-white/40 hover:bg-white/60 transition-colors duration-200">
                      <img width="28px" height="28px" src="/images/qrcode.png" alt="QR Code icon" />
                    </div>
                  </div>
                  <div className="flex flex-row justify-center items-center gap-3">
                    <img
                      className={`rounded-full border-2 ${card.borderColor} overflow-hidden`}
                      src="/images/avatar.png"
                      alt="Profile"
                      width="45px"
                      height="45px"
                    />
                    <div className="flex flex-col justify-start items-start gap-0.5">
                      <div className="text-sm text-white font-bold">{card.name}</div>
                      <div className="text-xs text-rose-200 font-medium">{card.position}</div>
                      <div className="text-xs text-rose-200 font-medium">ID: {card.employeeId}</div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row justify-between items-start w-full">
                  <div className="text-base text-neutral-900 font-semibold">{card.name}</div>
                  <div className="flex justify-center items-center rounded-lg px-2 h-6 bg-teal-500">
                    <div className="text-xs text-white font-medium">{card.status}</div>
                  </div>
                </div>
                <div className="flex justify-center items-center rounded-lg w-full h-16 bg-gray-50">
                  <div className="flex flex-row justify-between items-center w-full px-4">
                    <div className="flex flex-col justify-start items-center gap-0.5">
                      <div className="text-sm text-neutral-900 font-semibold">
                        {card.department}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">Department</div>
                    </div>
                    <div className="flex flex-col justify-center items-center gap-0.5">
                      <div className="text-sm text-neutral-900 font-semibold">
                        {card.accessLevel}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">Access Level</div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-start items-start gap-4 w-full">
                  <div className="flex flex-row justify-start items-center gap-2">
                    <div className="flex justify-center items-center h-5">
                      <img
                        width="16.3px"
                        height="16.3px"
                        src="/images/expiry.png"
                        alt="Expiry icon"
                      />
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      Expires: {card.expiryDate}
                    </div>
                  </div>
                  <div className="flex flex-row justify-between items-center w-full">
                    <div className="flex flex-row justify-start items-center gap-4">
                      <div
                        className="flex justify-center items-center h-5 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors"
                        onClick={() => handleEditClick(card)}
                      >
                        <img
                          width="17.5px"
                          height="17.5px"
                          src="/images/pencil.png"
                          alt="Edit icon"
                        />
                      </div>

                      <div
                        className="flex justify-center items-center h-5 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors"
                        onClick={() => handleDownloadClick(card)}
                      >
                        <img
                          width="16.3px"
                          height="16.3px"
                          src="/images/download.png"
                          alt="Download icon"
                        />
                      </div>
                      <div className="flex justify-center items-center h-5 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors">
                        <img
                          width="15px"
                          height="17.5px"
                          src="/images/trash.png"
                          alt="Trash icon"
                        />
                      </div>
                    </div>
                    <div
                      className="flex flex-row justify-center items-center gap-1 px-4 py-1 rounded-lg border border-teal-500 h-7 cursor-pointer hover:bg-teal-50 transition-colors"
                      onClick={() => handlePreviewClick(card)}
                    >
                      <img
                        width="16px"
                        height="16px"
                        src="/images/preview.png"
                        alt="Preview icon"
                      />
                      <div className="text-xs text-teal-500 font-medium">Preview</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeCardTab === 'businessCards' && (
        <div className="grid grid-cols-3 gap-4 w-full">
          {sampleBusinessCards.map((card) => (
            <div
              key={card.id}
              className="flex flex-col justify-center items-center rounded-xl w-full shadow bg-white p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex flex-col justify-start items-start gap-4 w-full">
                {/* Card Header */}
                <div
                  className={`flex flex-col justify-start items-start gap-2 p-4 rounded-xl w-full h-28 ${card.bgColor} transition-colors duration-200`}
                >
                  <div className="flex flex-row justify-between items-center w-full">
                    <div className="flex flex-row justify-center items-center gap-3">
                      <img
                        className={`rounded-full border-2 ${card.borderColor} overflow-hidden`}
                        src="/images/avatar.png"
                        alt="Profile"
                        width="45px"
                        height="45px"
                      />
                      <div className="flex flex-col justify-start items-start gap-0.5">
                        <div className="text-sm text-white font-bold">{card.name}</div>
                        <div className="text-xs text-green-100 font-medium">{card.position}</div>
                      </div>
                    </div>
                    <div className="flex justify-center items-center rounded-md w-10 h-10 bg-white/40 hover:bg-white/60 transition-colors duration-200">
                      <img width="28px" height="28px" src="/images/qrcode.png" alt="QR Code icon" />
                    </div>
                  </div>
                  <div className="flex flex-row justify-start items-center gap-2">
                    <div className="flex justify-center items-center rounded w-[70px] h-5 bg-white/30">
                      <div className="flex flex-row justify-center items-center gap-1 h-3.5">
                        <div className="flex justify-center items-center h-3">
                          <img
                            width="12px"
                            height="9.8px"
                            src="/images/linkedin.png"
                            alt="LinkedIn icon"
                          />
                        </div>
                        <div className="text-[10px] text-white font-medium">LinkedIn</div>
                      </div>
                    </div>
                    <div className="flex justify-center items-center rounded w-[70px] h-5 bg-white/30">
                      <div className="flex flex-row justify-center items-center gap-1 h-3.5">
                        <div className="flex justify-center items-center h-3">
                          <img
                            width="12px"
                            height="9.8px"
                            src="/images/twitter.png"
                            alt="Twitter icon"
                          />
                        </div>
                        <div className="text-[10px] text-white font-medium">Twitter</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Info */}
                <div className="flex flex-row justify-between items-start w-full">
                  <div className="text-base text-neutral-900 font-semibold">
                    {card.name} - {card.position}
                  </div>
                  <div className="flex justify-center items-center rounded-lg px-2 h-6 bg-teal-500">
                    <div className="text-xs text-white font-medium">{card.status}</div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex justify-center items-center rounded-lg w-full h-16 bg-gray-50">
                  <div className="flex flex-row justify-between items-center w-full px-4">
                    <div className="flex flex-col justify-start items-center gap-0.5">
                      <div className="text-sm text-neutral-900 font-semibold">{card.scans}</div>
                      <div className="text-xs text-gray-500 font-medium">Scans</div>
                    </div>
                    <div className="flex flex-col justify-center items-center gap-0.5">
                      <div className="text-sm text-neutral-900 font-semibold">
                        {card.connections}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">Connections</div>
                    </div>
                    <div
                      className="flex flex-col justify-center items-center gap-0.5 cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors"
                      onClick={() => handleAnalyticsClick(card)}
                    >
                      <img
                        width="24px"
                        height="24px"
                        src="/images/analytics.png"
                        alt="Analytics icon"
                      />
                      <div className="text-xs text-gray-500 font-medium">Analytics</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col justify-start items-start gap-4 w-full">
                  <div className="flex flex-row justify-start items-center gap-2">
                    <div className="flex justify-center items-center h-5">
                      <img
                        width="16.3px"
                        height="16.3px"
                        src="/images/clock.png"
                        alt="Clock icon"
                      />
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      Last activity: {card.lastActivity}
                    </div>
                  </div>
                  <div className="flex flex-row justify-between items-center w-full">
                    <div className="flex flex-row justify-start items-center gap-4">
                      <div className="flex justify-center items-center h-5 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors">
                        <img
                          width="17.5px"
                          height="17.5px"
                          src="/images/pencil.png"
                          alt="Edit icon"
                        />
                      </div>
                      <div
                        className="flex justify-center items-center h-5 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors"
                        onClick={() => handleDownloadClick(card)}
                      >
                        <img
                          width="16.3px"
                          height="16.3px"
                          src="/images/download.png"
                          alt="Download icon"
                        />
                      </div>
                      <div className="flex justify-center items-center h-5 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors">
                        <img
                          width="15px"
                          height="17.5px"
                          src="/images/trash.png"
                          alt="Trash icon"
                        />
                      </div>
                    </div>
                    <div
                      className="flex flex-row justify-center items-center gap-1 px-4 py-1 rounded-lg border border-teal-500 h-7 cursor-pointer hover:bg-teal-50 transition-colors"
                      onClick={() => handlePreviewClick(card)}
                    >
                      <img
                        width="16px"
                        height="16px"
                        src="/images/preview.png"
                        alt="Preview icon"
                      />
                      <div className="text-xs text-teal-500 font-medium">Preview</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Card Modal */}
      <CardModal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        card={selectedCard}
      />

      {/* Share Card Modal */}
      <ShareCardModal
        isOpen={isShareCardModalOpen}
        onClose={() => setIsShareCardModalOpen(false)}
        card={selectedCard}
      />

      <EditCardModal
        isOpen={isEditCardModalOpen}
        onClose={() => setIsEditCardModalOpen(false)}
        card={selectedCard}
      />

      {/* Business Card Modal */}
      <BusinessCardModal
        isOpen={isBusinessCardModalOpen}
        onClose={() => setIsBusinessCardModalOpen(false)}
        card={selectedCard}
      />

      {/* Create Business Card Modal */}
      <CreateBusinessCardModal
        isOpen={isCreateBusinessCardModalOpen}
        onClose={() => setIsCreateBusinessCardModalOpen(false)}
      />

      {/* Card Analytics Modal */}
      <CardAnalyticsModal
        isOpen={isCardAnalyticsModalOpen}
        onClose={() => setIsCardAnalyticsModalOpen(false)}
        card={selectedCard}
      />
    </div>
  );
};

export default Cards;
