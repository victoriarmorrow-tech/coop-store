import React, { useState, useEffect } from 'react';
import { Check, Lock, Eye, EyeOff, ShieldAlert, ShoppingCart, Trash2, Plus } from 'lucide-react';

// --- Configuration ---
const MAX_BUDGET = 570;
const PRIMARY_GREEN = '#154734';
const PRIMARY_GOLD = '#D6A461';

const FarmLogo = () => (
  <svg width="48" height="48" viewBox="0 0 100 100" className="mr-3 shrink-0" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)">
    {/* Silo Body */}
    <path d="M10 35 V95 H30 V35 C30 25 10 25 10 35 Z" fill={PRIMARY_GOLD} />
    {/* Silo Stripes (Cutout effect using Green) */}
    <path d="M10 50 H30" stroke={PRIMARY_GREEN} strokeWidth="3" />
    <path d="M10 65 H30" stroke={PRIMARY_GREEN} strokeWidth="3" />
    <path d="M10 80 H30" stroke={PRIMARY_GREEN} strokeWidth="3" />

    {/* Barn Main Body */}
    <path d="M30 45 L60 15 L90 45 V95 H30 V45 Z" fill={PRIMARY_GOLD} />

    {/* Barn Door (Green Cutout) */}
    <path d="M50 95 V65 H70 V95" fill={PRIMARY_GREEN} />
    {/* Barn Door Cross detail */}
    <path d="M50 65 L70 95" stroke={PRIMARY_GOLD} strokeWidth="2" />
    <path d="M70 65 L50 95" stroke={PRIMARY_GOLD} strokeWidth="2" />

    {/* Loft Window (Green Cutout) */}
    <rect x="55" y="30" width="10" height="10" fill={PRIMARY_GREEN} />
  </svg>
);

// --- Product Data ---
const PRODUCTS = [
  { 
    id: 1, 
    name: "1TG UI Revamp", 
    desc: "Fully update UI to work more like TOC (include all tasks within measure view, update measure timeline, no more issues if someone doesn’t check the “confirm order” box).", 
    cost: 320 
  },
  { 
    id: 2, 
    name: "Allow Excel Uploads into Polaris", 
    desc: "“I found something interesting in reporting and have an excel file of X patient IDs and Y task ids; prioritize those items in Polaris.”", 
    cost: 50 
  },
  { 
    id: 3, 
    name: "Polaris Admin Page for Market Leaders", 
    desc: "Ability to create rules that prioritize by Payer, Measure, Task Type, or RPL. Also the ability to remove items currently in Polaris by the same criteria.", 
    cost: 150 
  },
  { 
    id: 4, 
    name: "Update “Manage Tasks” View", 
    desc: "Allows market leaders to dig in on a particular navigator to confirm that the results of any updates to rules or Polaris weightings are fully transparent.", 
    cost: 100 
  },
  { 
    id: 5, 
    name: "Daily Dial Flexibility", 
    desc: "Allow leaders to lower Polaris daily dial values; create reporting on any large discrepancies between assigned vs. recommended.", 
    cost: 20 
  },
  { 
    id: 6, 
    name: "Kairos VPO Admin Page", 
    desc: "Consolidated Kairos view tailored for VPOs to see team activity all in one place. Adds the ability to “mute” or downgrade certain criteria so that teams can focus on priority issues.", 
    cost: 100 
  },
  { 
    id: 7, 
    name: "Kairos Activity Removal", 
    desc: "Stop Kairos from flagging items that only matter in aggregate (e.g. unable to reach), keeping them fully out of the queue.", 
    cost: 20 
  },
  { 
    id: 8, 
    name: "Kairos Review / Polaris Task Integration", 
    desc: "Have Kairos tasks flag as Polaris task instead of in review tab for nav.", 
    cost: 100 
  },
  { 
    id: 9, 
    name: "Pre-Visit Planning", 
    desc: "Add Pre-Visit Planning into My Day so that navs can click any of the “decorators” and address gaps prior to patients coming in.", 
    cost: 50 
  },
  { 
    id: 10, 
    name: "Med Adherence Optimization", 
    desc: "Review all edge cases related to SureScripts vs. MCO data and resolve issues related to improper stacking.", 
    cost: 150 
  },
  { 
    id: 11, 
    name: "Med Adherence UI", 
    desc: "Update Med Adherence UI to be more user-friendly; include a visual timeline of all fills and show the impact of missed pickups.", 
    cost: 150 
  },
  { 
    id: 12, 
    name: "Texting Optimization", 
    desc: "Automatic replies and keyword routing/escalation for timely communication and reduced manual work.", 
    cost: 100 
  },
  { 
    id: 13, 
    name: "My Day Calendar", 
    desc: "Fix calendar in MyDay to make it look more like Outlook.", 
    cost: 50 
  },
  { 
    id: 14, 
    name: "Update Check-in Form", 
    desc: "Redesign the check-in form to match CAHPS expectations and quality needs; improves patient experience and documentation accuracy.", 
    cost: 50 
  },
  { 
    id: 15, 
    name: "Check-in Prioritization", 
    desc: "Improve logic to distinguish when full check-in is required vs. when a simple pop-in is sufficient.", 
    cost: 50 
  },
  { 
    id: 16, 
    name: "Quality for Y1 Navigators", 
    desc: "Create “Permanent Proxies” for navigators in Y1 clinics so that they can start quality work immediately and not have a difference between year 1 and year 2.", 
    cost: 150 
  },
  { 
    id: 17, 
    name: "Single Patient Task Workflow", 
    desc: "Combine all related tasks for a patient into a single cohesive workflow to reduce duplication and streamline follow-up.", 
    cost: 500 
  },
];

export default function App() {
  // State
  const [cart, setCart] = useState([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [voteCounts, setVoteCounts] = useState({});

  useEffect(() => {
    // Check if user already submitted this session
    const submitted = localStorage.getItem('budget_app_submitted');
    if (submitted) setHasSubmitted(true);

    // Load mock votes (Reset if empty)
    const storedVotes = JSON.parse(localStorage.getItem('budget_app_votes') || '{}');
    setVoteCounts(storedVotes);
  }, []);

  const totalSpent = cart.reduce((acc, id) => {
    const item = PRODUCTS.find(p => p.id === id);
    return acc + (item ? item.cost : 0);
  }, 0);

  const remainingBudget = MAX_BUDGET - totalSpent;

  const toggleItem = (id) => {
    if (hasSubmitted) return;

    if (cart.includes(id)) {
      setCart(cart.filter(itemId => itemId !== id));
    } else {
      const item = PRODUCTS.find(p => p.id === id);
      if (item.cost <= remainingBudget) {
        setCart([...cart, id]);
      }
    }
  };

  const handleSubmit = () => {
    if (hasSubmitted) return;

    setHasSubmitted(true);
    localStorage.setItem('budget_app_submitted', 'true');

    const newVotes = { ...voteCounts };
    cart.forEach(id => {
      newVotes[id] = (newVotes[id] || 0) + 1;
    });
    setVoteCounts(newVotes);
    localStorage.setItem('budget_app_votes', JSON.stringify(newVotes));
  };

  const handleResetVotes = () => {
    if (window.confirm("ADMIN ONLY: Are you sure you want to reset ALL vote tallies?")) {
      // 1. Clear LocalStorage
      localStorage.removeItem('budget_app_votes');
      localStorage.removeItem('budget_app_submitted');

      // 2. Reset React State immediately (UI updates without reload)
      setVoteCounts({});
      setHasSubmitted(false);
      setCart([]);
    }
  };

  // Sort products by vote count (descending) for the tally view
  const sortedProducts = [...PRODUCTS].sort((a, b) => {
    const votesA = voteCounts[a.id] || 0;
    const votesB = voteCounts[b.id] || 0;
    return votesB - votesA;
  });

  return (
    <div 
      className="min-h-screen bg-gray-50 pb-20" 
      style={{ fontFamily: '"Century Gothic", CenturyGothic, AppleGothic, sans-serif' }}
    >
      {/* Header - Solid Green Background */}
      <header 
        className="sticky top-0 z-50 shadow-md"
        style={{ backgroundColor: PRIMARY_GREEN }}
      >
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-3">
            <div className="flex items-center">
              <FarmLogo />
              <h1 
                className="text-2xl font-bold tracking-wide uppercase"
                style={{ color: PRIMARY_GOLD }}
              >
                Co-Op General Store
              </h1>
            </div>

            <div className="flex flex-col items-center sm:items-end text-white">
              <span className="text-xs font-bold opacity-80 uppercase tracking-widest">Available Budget</span>
              <div className="flex items-baseline gap-1">
                <span className={`text-3xl font-bold transition-colors duration-300 ${remainingBudget < 50 ? 'text-red-300' : 'text-white'}`}>
                  ${remainingBudget}
                </span>
                <span className="text-white/60 text-sm">/ ${MAX_BUDGET}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-black/20 h-3 rounded-full overflow-hidden backdrop-blur-sm">
            <div 
              className="h-full transition-all duration-500 ease-out"
              style={{ 
                width: `${(totalSpent / MAX_BUDGET) * 100}%`,
                backgroundColor: PRIMARY_GOLD 
              }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">

        {!hasSubmitted && (
          <div className="mb-6 p-4 bg-white border-l-4 rounded shadow-sm text-gray-600 text-sm" style={{ borderLeftColor: PRIMARY_GOLD }}>
            <p><strong>Instructions:</strong> Select the initiatives you wish to prioritize. You have a budget cap of <strong>${MAX_BUDGET}</strong>.</p>
          </div>
        )}

        {hasSubmitted && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 text-[#154734] rounded-lg flex items-center gap-3 animate-pulse">
            <Check size={24} className="shrink-0" />
            <div>
              <p className="font-bold">Allocation Submitted</p>
              <p className="text-sm">Thank you for your input. Scroll down to view global results.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PRODUCTS.map((product) => {
            const isSelected = cart.includes(product.id);
            const canAfford = product.cost <= remainingBudget;
            const isDisabled = hasSubmitted || (!isSelected && !canAfford);

            return (
              <div 
                key={product.id}
                className={`
                  relative flex flex-col justify-between p-5 rounded-xl border transition-all duration-200
                  ${isSelected 
                    ? 'bg-white shadow-lg ring-1 ring-[#D6A461]' 
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'}
                  ${isDisabled && !isSelected ? 'opacity-60 grayscale-[0.8]' : ''}
                `}
                style={{
                  borderColor: isSelected ? PRIMARY_GOLD : undefined
                }}
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-800 text-lg leading-tight pr-2">{product.name}</h3>
                    <div 
                      className="shrink-0 px-3 py-1 rounded-full font-bold text-sm text-white"
                      style={{ backgroundColor: PRIMARY_GREEN }}
                    >
                      ${product.cost}
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                    {product.desc}
                  </p>
                </div>

                {/* Purchase Button Area */}
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                   <div className="text-xs text-gray-400 font-medium">
                      {isSelected ? "Added to Cart" : "Available"}
                   </div>

                   <button
                    onClick={() => !isDisabled && toggleItem(product.id)}
                    disabled={isDisabled}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all
                      ${isSelected
                        ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                        : 'text-white hover:opacity-90 shadow-sm'}
                      ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}
                    `}
                    style={{
                      backgroundColor: isSelected ? undefined : PRIMARY_GREEN
                    }}
                   >
                     {isSelected ? (
                       <>
                         <Trash2 size={16} /> Remove
                       </>
                     ) : (
                       <>
                         <Plus size={16} /> Add to Cart
                       </>
                     )}
                   </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer Controls */}
      <footer className="bg-white border-t border-gray-200 mt-12 pb-12 pt-8">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center gap-6">

          {/* Submit Button */}
          {!hasSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={totalSpent === 0}
              className={`
                w-full md:w-auto px-16 py-4 rounded-full font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-3
                ${totalSpent > 0 
                  ? 'hover:transform hover:-translate-y-1 hover:shadow-2xl' 
                  : 'opacity-50 cursor-not-allowed'}
              `}
              style={{ 
                backgroundColor: totalSpent > 0 ? PRIMARY_GOLD : '#ccc',
                color: totalSpent > 0 ? PRIMARY_GREEN : 'white'
              }}
            >
              <ShoppingCart size={20} />
              Checkout (${totalSpent})
            </button>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <button disabled className="px-12 py-3 rounded-full font-bold text-lg bg-gray-100 text-gray-400 cursor-not-allowed flex items-center gap-2 border border-gray-200">
                <Lock size={20} /> Checkout Closed
              </button>
              <p className="text-xs text-gray-400">Refresh to start a new session (your vote is saved)</p>
            </div>
          )}

          {/* Toggle Results */}
          <button 
            onClick={() => setShowResults(!showResults)}
            className="text-gray-500 text-sm flex items-center gap-2 hover:text-[#154734] transition-colors py-2 px-4 rounded hover:bg-gray-50"
          >
            {showResults ? <EyeOff size={16} /> : <Eye size={16} />}
            {showResults ? "Hide Global Results" : "Reveal Global Results"}
          </button>

          {/* Global Tally Table */}
          {showResults && (
             <div className="w-full mt-4 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in-up">
               <div 
                 className="p-4 flex justify-between items-center text-white"
                 style={{ backgroundColor: PRIMARY_GREEN }}
               >
                 <h3 className="font-bold" style={{ color: PRIMARY_GOLD }}>Global Leaderboard</h3>
                 <span className="text-xs opacity-70 uppercase tracking-wide text-white">Most Requested Features</span>
               </div>
               <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                 {sortedProducts.map((p, index) => (
                   <div key={p.id} className="flex justify-between items-center p-4 text-sm hover:bg-gray-50 transition-colors">
                     <div className="flex items-center gap-3">
                        <span className="text-gray-300 font-bold text-xl w-6 text-center">{index + 1}</span>
                        <div>
                          <span className="text-gray-800 font-bold block">{p.name}</span>
                          <span className="text-xs text-gray-400">${p.cost}</span>
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="h-2 w-24 bg-gray-100 rounded-full overflow-hidden hidden sm:block">
                          <div 
                            className="h-full" 
                            style={{ 
                              width: `${Math.min(100, (voteCounts[p.id] || 0) * 10)}%`,
                              backgroundColor: PRIMARY_GOLD
                            }} 
                          />
                        </div>
                        <span 
                          className="font-bold px-3 py-1 rounded-full min-w-[3rem] text-center"
                          style={{ backgroundColor: '#f0fdf4', color: PRIMARY_GREEN }}
                        >
                          {voteCounts[p.id] || 0}
                        </span>
                     </div>
                   </div>
                 ))}
                 {Object.keys(voteCounts).length === 0 && (
                   <div className="p-8 text-center text-gray-400 italic">No votes have been cast yet.</div>
                 )}
               </div>
             </div>
          )}

          {/* Admin Reset */}
          <div className="mt-8 pt-8 w-full text-center">
            <button 
              onClick={handleResetVotes}
              className="text-gray-300 text-[10px] hover:text-red-500 transition-colors flex items-center gap-1 mx-auto uppercase tracking-widest"
            >
              <ShieldAlert size={10} />
              Reset System Data
            </button>
          </div>

        </div>
      </footer>
    </div>
  );
}
