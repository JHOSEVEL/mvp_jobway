import React from 'react';

interface Props {
  onNavigate: (page: string) => void;
  profile?: any;
}

function DashboardProfessional({ onNavigate, profile }: Props) {
  const userName = profile?.full_name || 'Talento';
  const userCity = profile?.city || 'Florianópolis';

  // Mock data baseado no contexto da landing page
  const recommendedJobs = [
    { id: 1, title: 'Desenvolvedor Full Stack Sênior', company: 'TechFloripa PME', city: 'Florianópolis', salary: 'R$ 12.000 - 16.000', distance: '2km', match: 95 },
    { id: 2, title: 'Designer de UX/UI', company: 'CreativeBC', city: 'Balneário Camboriú', salary: 'R$ 7.000', distance: '45km', match: 88 },
    { id: 3, title: 'Analista de Logística Portuária', company: 'Porto Seguro SC', city: 'Itajaí', salary: 'R$ 5.500', distance: '65km', match: 82 },
  ];

  const canadaMiles = 1250;
  const nextReward = 2000 - canadaMiles;

  const recentApplications = [
    { job: 'Desenvolvedor Full Stack Sênior', company: 'TechFloripa PME', status: 'Em análise', date: '2 dias atrás' },
    { job: 'Designer de UX/UI', company: 'CreativeBC', status: 'Entrevista agendada', date: '1 semana atrás' },
  ];

  return (
    <div className="pt-32 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-slate-900 mb-2">Olá, {userName}!</h1>
          <p className="text-slate-600 text-lg">Bem-vindo ao seu painel profissional em {userCity}, SC</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Vagas Recomendadas */}
            <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-200">
              <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <span className="text-3xl">🎯</span>
                Vagas Recomendadas para Você
              </h2>
              <div className="space-y-4">
                {recommendedJobs.map((job) => (
                  <div key={job.id} className="border border-slate-200 rounded-2xl p-6 hover:border-brand-green transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-black text-slate-900 mb-1">{job.title}</h3>
                        <p className="text-brand-green font-bold">{job.company} • {job.city}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-black text-slate-900">{job.salary}</div>
                        <div className="text-sm text-slate-500">{job.distance}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-600">Match:</span>
                          <span className="px-3 py-1 bg-brand-green text-white rounded-full text-sm font-black">{job.match}%</span>
                        </div>
                      </div>
                      <button className="px-6 py-2 bg-brand-green text-white rounded-xl font-black hover:bg-brand-greenDark transition-colors">
                        Candidatar-se
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Aplicações Recentes */}
            <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-200">
              <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <span className="text-3xl">📋</span>
                Minhas Aplicações
              </h2>
              <div className="space-y-4">
                {recentApplications.map((app, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                    <div>
                      <h3 className="font-black text-slate-900">{app.job}</h3>
                      <p className="text-slate-600">{app.company} • {app.date}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-black ${
                      app.status === 'Entrevista agendada' ? 'bg-emerald-100 text-emerald-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Milhas Canadá */}
            <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-200">
              <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">🇨🇦</span>
                Milhas Canadá
              </h3>
              <div className="text-center mb-4">
                <div className="text-4xl font-black text-brand-green mb-2">{canadaMiles.toLocaleString()}</div>
                <p className="text-slate-600 text-sm">pontos acumulados</p>
              </div>
              <div className="bg-slate-100 rounded-full h-3 mb-4">
                <div
                  className="bg-brand-green h-3 rounded-full transition-all"
                  style={{ width: `${(canadaMiles / 2000) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-slate-600 text-center">
                Faltam {nextReward} pontos para o próximo intercâmbio
              </p>
            </div>

            {/* Ações Rápidas */}
            <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-200">
              <h3 className="text-xl font-black text-slate-900 mb-4">Ações Rápidas</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-brand-green transition-colors">
                  <div className="font-bold text-slate-900">Atualizar Perfil</div>
                  <div className="text-sm text-slate-600">Complete seu perfil para melhores matches</div>
                </button>
                <button className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-brand-green transition-colors">
                  <div className="font-bold text-slate-900">Ver Feedback IA</div>
                  <div className="text-sm text-slate-600">Análise detalhada dos seus matches</div>
                </button>
                <button className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-brand-green transition-colors">
                  <div className="font-bold text-slate-900">Cursos Disponíveis</div>
                  <div className="text-sm text-slate-600">Ganhe pontos Canadá com capacitação</div>
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

export default DashboardProfessional;
