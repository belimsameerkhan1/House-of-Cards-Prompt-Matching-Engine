import React, { useState } from 'react';
import { Users, Building2, MapPin, Mail, Phone, ExternalLink, ShieldCheck, Award } from 'lucide-react';
import FacilitatorModal from '../components/FacilitatorModal';
import { translations } from '../utils/translations';

const FACILITATORS = [
  {
    id: "f_01",
    name: "Dr. Ananya Varma",
    role: "Senior Patent Attorney & ASU Specialist",
    org: "AYUSH Innovation & IP Cell (Empaneled)",
    location: "New Delhi / Online",
    specialization: "Section 3(p) TK Bar, TKDL Clearance & Formulation Synergy Proofs",
    experience: "14+ Years in Ayurvedic Patent Prosecution",
    email: "ananya.varma@ayush-ipcell.gov.in"
  },
  {
    id: "f_02",
    name: "Adv. K. R. Namboodiri",
    role: "Biodiversity & ABS Nodal Legal Advisor",
    org: "National Biodiversity Authority Legal Panel",
    location: "Chennai / Thiruvananthapuram",
    specialization: "Form I / III NBA Filings, State Biodiversity Board Clearances & Section 6(1A)",
    experience: "18+ Years in Environmental & Traditional Knowledge Law",
    email: "kr.namboodiri@nba-legal.org"
  },
  {
    id: "f_03",
    name: "Dr. Sandeep Deshmukh",
    role: "Phytopharmaceutical Regulatory Consultant",
    org: "CDSCO Herbal & Phytopharma Advisory Desk",
    location: "Mumbai / Pune",
    specialization: "Rule 122E New Drug Applications, Botanical Standardization & Clinical Protocol Design",
    experience: "12+ Years in ASU Drug Standardization & Schedule M",
    email: "sandeep.d@herbal-pharma.res.in"
  },
  {
    id: "f_04",
    name: "Pooja Hegde & Associates",
    role: "Geographical Indications & Trademark Attorneys",
    org: "Intellectual Property Appellate Bar (Ayurveda Division)",
    location: "Bengaluru",
    specialization: "Ayurvedic Brand Protection (Class 5/3), GI Collective Marks & Export Packaging Designs",
    experience: "10+ Years in GI & Traditional Artisan IP",
    email: "contact@hegde-ip.com"
  }
];

export default function Facilitator({ currentLang = 'en' }) {
  const t = translations[currentLang] || translations.en;
  const [selectedFacilitator, setSelectedFacilitator] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenConsultation = (fac) => {
    setSelectedFacilitator(fac);
    setIsModalOpen(true);
  };

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="pb-4 mb-6 border-b border-borderLight">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-forest-800 flex items-center justify-center text-cream-50">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-charcoal-900">
              {t.facilitator}
            </h1>
            <p className="text-[11px] text-charcoal-500">
              Empaneled AYUSH patent attorneys, ABS consultants, and regulatory specialists
            </p>
          </div>
        </div>
      </div>

      {/* Info notice banner */}
      <div className="p-4 bg-white rounded-2xl border border-borderLight shadow-2xs mb-6 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-forest-700 shrink-0 mt-0.5" />
        <div className="text-xs text-charcoal-700 leading-relaxed">
          <p className="font-semibold text-charcoal-900 mb-0.5">
            Ministry of AYUSH Scheme for IP Facilitation
          </p>
          <p className="text-[11.5px] text-charcoal-600">
            Ayurveda startups, MSMEs, and individual researchers registered on Udyam or recognized by DPIIT are eligible for government-sponsored professional attorney fee facilitation. Official filing fees remain subject to statutory schedules.
          </p>
        </div>
      </div>

      {/* Facilitator Directory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FACILITATORS.map((fac) => (
          <div
            key={fac.id}
            className="p-5 bg-white rounded-2xl border border-borderLight hover:border-sage-300 transition-all duration-150 shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="text-sm font-semibold text-charcoal-900">
                    {fac.name}
                  </h3>
                  <p className="text-xs font-medium text-forest-800 mt-0.5">
                    {fac.role}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-sage-50 text-forest-800 text-[10px] font-semibold rounded-full">
                  <Award className="w-3 h-3 text-forest-700" />
                  <span>Verified</span>
                </span>
              </div>

              <p className="text-[11px] text-charcoal-500 mb-3 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                <span>{fac.org}</span>
                <span className="text-charcoal-300">•</span>
                <MapPin className="w-3 h-3" />
                <span>{fac.location}</span>
              </p>

              <div className="p-2.5 bg-cream-50/70 rounded-xl border border-borderLight/80 text-[11px] text-charcoal-700 mb-3 space-y-1">
                <p>
                  <strong>Domain Focus:</strong> {fac.specialization}
                </p>
                <p className="text-charcoal-500">
                  {fac.experience}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-cream-100 flex items-center justify-between">
              <span className="text-[11px] text-charcoal-500 flex items-center gap-1">
                <Mail className="w-3 h-3 text-forest-700" />
                <span>{fac.email}</span>
              </span>

              <button
                type="button"
                onClick={() => handleOpenConsultation(fac)}
                className="px-3 py-1.5 bg-forest-800 hover:bg-forest-900 text-cream-50 text-xs font-medium rounded-lg shadow-sm transition-all"
              >
                Request Brief
              </button>
            </div>
          </div>
        ))}
      </div>

      <FacilitatorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentLang={currentLang}
        querySummary={selectedFacilitator ? `Direct inquiry for ${selectedFacilitator.name} (${selectedFacilitator.specialization})` : ''}
      />
    </div>
  );
}
