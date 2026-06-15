import React from 'react';

export interface ProfessionalProfile {
  name: string;
  role: string;
  location: string;
  distanceKm: string;
  status: string;
  discipline: string;
  searchHint: string;
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
  return (
    <div className="bg-slate-950 text-white rounded-[2rem] overflow-hidden shadow-2xl border border-slate-800">
      <div className="relative">
        <img
          src={profile.image}
          alt={profile.name}
          className="w-full h-56 object-cover"
        />
        <div className="absolute top-4 right-4 bg-white/10 backdrop-blur rounded-full px-4 py-2 text-sm font-black text-white border border-white/15">
          {profile.score}
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-2xl font-black tracking-tight">{profile.name}</h3>
          <p className="text-slate-300 text-sm mt-1">{profile.role}</p>
          <p className="text-slate-400 text-sm mt-1">{profile.location}</p>
          <p className="text-slate-400 text-sm mt-1">Distância: {profile.distanceKm}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-3xl border border-slate-800 bg-white/5 p-4">
            <p className="text-slate-400 uppercase text-[10px] tracking-[0.25em] mb-2">DISC</p>
            <p className="text-white font-black">{profile.discipline}</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-white/5 p-4">
            <p className="text-slate-400 uppercase text-[10px] tracking-[0.25em] mb-2">Busca</p>
            <p className="text-white font-black">{profile.searchHint}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {profile.tags.map((tag) => (
            <span key={tag} className="bg-white/10 text-slate-200 px-3 py-1 rounded-full text-xs font-semibold">
              {tag}
            </span>
          ))}
        </div>

        <div className="bg-slate-900 rounded-[2rem] border border-slate-800 p-5 space-y-3">
          <div className="flex items-center gap-3 text-slate-300">
            <span className="text-brand-green">📧</span>
            <span className="text-sm">{profile.email}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-300">
            <span className="text-brand-green">📱</span>
            <span className="text-sm">{profile.phone}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-300">
            <span className="text-brand-green">🔗</span>
            <span className="text-sm">{profile.linkedin}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalProfileCard;
