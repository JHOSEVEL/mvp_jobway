import React from 'react';
import ProfessionalProfileCard, { ProfessionalProfile } from './ProfessionalProfileCard';

interface Props {
  onNavigate: (page: string) => void;
  profile?: any;
}

function DashboardCompany({ onNavigate, profile }: Props) {
  const companyName = profile?.full_name || 'Empresa Parceira';
  const companyCity = profile?.city || 'Florianópolis';

  const professionalProfiles: ProfessionalProfile[] = [
    {
      name: 'Larissa Campos',
      role: 'UX Designer & Produto | Mobile First',
      location: 'Florianópolis, SC',
      distanceKm: '2 km',
      status: 'Talento',
      discipline: 'Estável',
      searchHint: 'Projeto desafiador com impacto real. Aberta a trabalho remoto.',
      tags: ['Figma', 'Design System', 'UX Research', 'Prototipação'],
      email: 'larissa@exemplo.com',
      phone: '+55 48 95678-1234',
      linkedin: 'linkedin.com/in/larissacampos',
      score: '74%',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80',
    },
    {
      name: 'Mateus Oliveira',
      role: 'Product Manager | Growth',
      location: 'Joinville, SC',
      distanceKm: '5 km',
      status: 'Talento',
      discipline: 'Empático',
      searchHint: 'Busca posição estratégica em produto digital.',
      tags: ['Roadmap', 'Métricas', 'User Research', 'OKRs'],
      email: 'mateus@exemplo.com',
      phone: '+55 47 99999-9876',
      linkedin: 'linkedin.com/in/mateusoliveira',
      score: '81%',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80',
    },
    {
      name: 'Bruna Almeida',
      role: 'Front-End Engineer | React',
      location: 'Blumenau, SC',
      distanceKm: '8 km',
      status: 'Talento',
      discipline: 'Focado',
      searchHint: 'Disponível para times ágeis e squads remotos.',
      tags: ['React', 'TypeScript', 'Next.js', 'Acessibilidade'],
      email: 'bruna@exemplo.com',
      phone: '+55 47 98888-1122',
      linkedin: 'linkedin.com/in/brunaalmeida',
      score: '89%',
      image: 'https://images.unsplash.com/photo-1502767089025-6572583495b4?auto=format&fit=crop&w=900&q=80',
    },
  ];

  // Mock data baseado no contexto da landing page
  const activeJobs = [
    { id: 1, title: 'Desenvolvedor Full Stack Sênior', applicants: 12, status: 'Ativa', posted: '3 dias atrás', matches: 3 },
    { id: 2, title: 'Designer de UX/UI', applicants: 8, status: 'Ativa', posted: '1 semana atrás', matches: 2 },
    { id: 3, title: 'Analista de Marketing Digital', applicants: 15, status: 'Pausada', posted: '2 semanas atrás', matches: 1 },
  ];

  const recentCandidates = [
    { name: 'João Silva', job: 'Desenvolvedor Full Stack Sênior', match: 95, status: 'Entrevista agendada', distance: '2 km' },
    { name: 'Maria Santos', job: 'Designer de UX/UI', match: 88, status: 'Em análise', distance: '5 km' },
    { name: 'Pedro Costa', job: 'Desenvolvedor Full Stack Sênior', match: 92, status: 'Novo candidato', distance: '3 km' },
  ];

  const metrics = {
    totalJobs: 8,
    activeJobs: 5,
    totalApplicants: 127,
    avgTimeToHire: '3.2 dias',
    successRate: 78
  };

  return (
    <div className="pt-32 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-slate-900 mb-2">Olá, {companyName}!</h1>
          <p className="text-slate-600 text-lg">Painel de recrutamento em {companyCity}, SC</p>
        </div>

        {/* Métricas Rápidas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 text-center">
            <div className="text-2xl font-black text-slate-900">{metrics.totalJobs}</div>
            <div className="text-sm text-slate-600 font-bold">Vagas Totais</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 text-center">
            <div className="text-2xl font-black text-brand-green">{metrics.activeJobs}</div>
            <div className="text-sm text-slate-600 font-bold">Vagas Ativas</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 text-center">
            <div className="text-2xl font-black text-slate-900">{metrics.totalApplicants}</div>
            <div className="text-sm text-slate-600 font-bold">Candidatos</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 text-center">
            <div className="text-2xl font-black text-emerald-600">{metrics.avgTimeToHire}</div>
            <div className="text-sm text-slate-600 font-bold">Tempo Médio</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 text-center">
            <div className="text-2xl font-black text-brand-green">{metrics.successRate}%</div>
            <div className="text-sm text-slate-600 font-bold">Taxa Sucesso</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Vagas Ativas */}
            <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  <span className="text-3xl">💼</span>
                  Minhas Vagas
                </h2>
                <button className="px-6 py-3 bg-brand-green text-white rounded-xl font-black hover:bg-brand-greenDark transition-colors">
                  + Nova Vaga
                </button>
              </div>
              <div className="space-y-4">
                {activeJobs.map((job) => (
                  <div key={job.id} className="border border-slate-200 rounded-2xl p-6 hover:border-brand-green transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-black text-slate-900 mb-1">{job.title}</h3>
                        <p className="text-slate-600">{job.posted} • {job.applicants} candidatos</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm font-black ${
                          job.status === 'Ativa' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {job.status}
                        </span>
                        <div className="text-sm text-slate-500 mt-1">{job.matches} matches IA</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-bold hover:bg-slate-200 transition-colors">
                        Ver Candidatos
                      </button>
                      <button className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-bold hover:border-brand-green transition-colors">
                        Editar Vaga
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Candidatos Recentes */}
            <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-200">
              <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <span className="text-3xl">👥</span>
                Candidatos Recentes
              </h2>
              <div className="space-y-4">
                {recentCandidates.map((candidate, idx) => (
                  <div key={idx} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border border-slate-200 rounded-xl gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-brand-green text-white rounded-full flex items-center justify-center font-black text-lg">
                        {candidate.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900">{candidate.name}</h3>
                        <p className="text-slate-600 text-sm">{candidate.job}</p>
                        <p className="text-slate-500 text-xs mt-1">{candidate.distance} da empresa</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-bold text-slate-600">Match:</span>
                        <span className="px-2 py-1 bg-brand-green text-white rounded-full text-xs font-black">{candidate.match}%</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-black ${
                        candidate.status === 'Entrevista agendada' ? 'bg-emerald-100 text-emerald-800' :
                        candidate.status === 'Em análise' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {candidate.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Perfis de Profissionais */}
            <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  <span className="text-3xl">⭐</span>
                  Perfis de Profissionais
                </h2>
                <span className="text-sm text-slate-500">Talentos prontos para abordagem</span>
              </div>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {professionalProfiles.map((profile) => (
                  <ProfessionalProfileCard key={profile.email} profile={profile} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Geolocalização Ativa */}
            <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-200">
              <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">📍</span>
                Geolocalização Ativa
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-600">Raio de Busca:</span>
                  <span className="font-black text-brand-green">15km</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-600">Candidatos Locais:</span>
                  <span className="font-black text-slate-900">89%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-600">Redução Turnover:</span>
                  <span className="font-black text-emerald-600">34%</span>
                </div>
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-bold hover:bg-slate-200 transition-colors">
                Ajustar Raio
              </button>
            </div>

            {/* Termômetro Cultural */}
            <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-200">
              <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">🌡️</span>
                Termômetro Cultural
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                Análise de 12 traços comportamentais dos candidatos
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-600">Compatibilidade:</span>
                  <span className="font-black text-emerald-600">87%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-600">Valores Alinhados:</span>
                  <span className="font-black text-emerald-600">92%</span>
                </div>
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-bold hover:bg-slate-200 transition-colors">
                Ver Relatório Completo
              </button>
            </div>

            {/* Ações Rápidas */}
            <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-200">
              <h3 className="text-xl font-black text-slate-900 mb-4">Ações Rápidas</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-brand-green transition-colors">
                  <div className="font-bold text-slate-900">Relatórios</div>
                  <div className="text-sm text-slate-600">Métricas de recrutamento detalhadas</div>
                </button>
                <button className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-brand-green transition-colors">
                  <div className="font-bold text-slate-900">Banco de Talentos</div>
                  <div className="text-sm text-slate-600">Candidatos salvos para futuras vagas</div>
                </button>
                <button className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-brand-green transition-colors">
                  <div className="font-bold text-slate-900">Integrações</div>
                  <div className="text-sm text-slate-600">Conectar com ATS e ferramentas</div>
                </button>
              </div>
            </div>

            {/* Voltar */}
            <button
              onClick={() => onNavigate('home')}
              className="w-full px-6 py-4 bg-slate-100 text-slate-700 rounded-2xl font-black hover:bg-slate-200 transition-colors"
            >
              ← Voltar para Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardCompany;
