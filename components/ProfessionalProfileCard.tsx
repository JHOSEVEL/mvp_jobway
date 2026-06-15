import React, { useState } from 'react';

export interface ProfessionalProfile {
  name: string;
  role: string;
  location: string;
  distanceKm: string;
  status: string;
  discipline: string;
  searchHint: string;
  bio: string;
  tags: string[];
  email: string;
  phone: string;
  linkedin: string;
  score: string;
  image: string;
}

interface Props {
  profile: ProfessionalProfile;
}

const ProfessionalProfileCard: React.FC<Props> = ({ profile }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-full bg-slate-950 text-white rounded-[2rem] overflow-hidden shadow-2xl border border-slate-800">
      <div className="relative">
        <img
          src={profile.image}
          alt={profile.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4 bg-white/10 backdrop-blur rounded-full px-4 py-2 text-sm font-black text-white border border-white/15">
          {profile.score}
        </div>
      </div>

      <div className="p-5 space-y-3">
        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-xl font-black tracking-tight">{profile.name}</h3>
              <p className="text-slate-300 text-sm mt-1">{profile.role}</p>
              <p className="text-slate-400 text-sm mt-1">{profile.location}</p>
              <p className="text-slate-400 text-sm mt-1">Distância: {profile.distanceKm}</p>
            </div>
            <span className="text-xs rounded-full px-3 py-1 bg-white/10 text-slate-200 font-bold uppercase tracking-[0.2em] mt-1">
              {profile.status}
            </span>
          </div>
        </div>

        <p className="text-slate-400 text-sm leading-6">{profile.bio}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-3xl border border-slate-800 bg-white/5 p-3">
            <p className="text-slate-400 uppercase text-[10px] tracking-[0.25em] mb-2">DISC</p>
            <p className="text-white font-black text-sm">{profile.discipline}</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-white/5 p-3">
            <p className="text-slate-400 uppercase text-[10px] tracking-[0.25em] mb-2">Busca</p>
            <p className="text-white font-black text-sm">{profile.searchHint}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="w-full text-left rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-sm font-bold text-white hover:bg-slate-800 transition-colors"
        >
          {expanded ? 'Ocultar detalhes' : 'Ver detalhes do profissional'}
        </button>

        {expanded && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {profile.tags.map((tag) => (
                <span key={tag} className="bg-white/10 text-slate-200 px-3 py-1 rounded-full text-xs font-semibold">
                  {tag}
                </span>
              ))}
            </div>
            <div className="bg-slate-900 rounded-[1.5rem] border border-slate-800 p-4 space-y-2">
              <div className="flex items-center gap-3 text-slate-300 text-sm">
                <span className="text-brand-green">📧</span>
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300 text-sm">
                <span className="text-brand-green">📱</span>
                <span>{profile.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300 text-sm">
                <span className="text-brand-green">🔗</span>
                <span>{profile.linkedin}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalProfileCard;
