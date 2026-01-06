import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { supabase } from '../services/supabase';

interface Props {
  onNavigate: (page: string) => void;
  profile?: any;
}

interface GeneratedJobData {
  title: string;
  description: string;
  requirements: string[];
  softSkills: string[];
}

interface FormData {
  city: string;
  cep: string;
  type: 'Presencial' | 'Híbrido' | 'Remoto (SC)';
  jobRole: string;
  salary: string;
  userInput: string;
  benefits?: string;
  experience?: string;
}

const PostJobPage: React.FC<Props> = ({ onNavigate, profile }) => {
  const [loadingIA, setLoadingIA] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [generatedData, setGeneratedData] = useState<GeneratedJobData | null>(null);
  const [editedData, setEditedData] = useState<GeneratedJobData | null>(null);

  const [formData, setFormData] = useState<FormData>({
    city: profile?.city || 'Florianópolis',
    cep: '',
    type: 'Presencial',
    jobRole: '',
    salary: '',
    userInput: '',
    benefits: '',
    experience: ''
  });

  const cities = [
    'Florianópolis',
    'Joinville',
    'Blumenau',
    'Itajaí',
    'Balneário Camboriú',
    'Itapema',
    'Chapecó',
    'Criciúma',
    'Lages',
    'Rio do Sul',
    'Brusque',
    'Outra'
  ];

  const jobTypes = ['Presencial', 'Híbrido', 'Remoto (SC)'];

  const experienceLevels = ['Estagiário', 'Junior', 'Pleno', 'Senior', 'Especialista', 'Não especificado'];

  const handleFormChange = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const validateStep = (stepNumber: number): boolean => {
    switch (stepNumber) {
      case 1:
        if (!formData.city || !formData.type) {
          alert('Por favor, preencha a cidade e o modelo de trabalho.');
          return false;
        }
        return true;
      case 2:
        if (!formData.jobRole || formData.userInput.length < 10) {
          alert('Por favor, informe a função e descreva as atividades (mínimo 10 caracteres).');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const generateJobDetails = async () => {
    if (!validateStep(2)) return;

    setLoadingIA(true);
    try {
      const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY || process.env.API_KEY;
      if (!apiKey) {
        throw new Error("API key do Gemini não configurada. Configure VITE_GEMINI_API_KEY no arquivo .env");
      }
      const ai = new GoogleGenAI({ apiKey });
      
      const benefitsText = formData.benefits ? `\nBenefícios oferecidos: ${formData.benefits}` : '';
      const experienceText = formData.experience ? `\nNível de experiência: ${formData.experience}` : '';

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Aja como um recrutador sênior especialista no mercado de Santa Catarina (SC). 
        Baseado nos seguintes dados, gere uma vaga de emprego completa, profissional, atrativa e persuasiva.
        
        Função desejada: ${formData.jobRole}
        Salário/Faixa: ${formData.salary || 'A combinar'}
        Resumo das atividades: ${formData.userInput}${benefitsText}${experienceText}
        Cidade de atuação: ${formData.city}
        Modelo: ${formData.type}
        
        O tom deve ser profissional, tecnológico e focado na cultura local de SC. 
        Crie uma descrição envolvente que atraia os melhores talentos.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Título otimizado para a vaga" },
              description: { type: Type.STRING, description: "Descrição detalhada, atrativa e persuasiva da oportunidade" },
              requirements: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lista de requisitos técnicos essenciais" },
              softSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lista de competências comportamentais desejadas" }
            },
            required: ["title", "description", "requirements", "softSkills"]
          }
        }
      });

      if (response.text) {
        const data = JSON.parse(response.text);
        setGeneratedData(data);
        setEditedData(data);
        setStep(3);
      }
    } catch (error: any) {
      console.error("Erro ao gerar vaga:", error);
      alert(`Erro na IA: ${error.message || "Tente novamente em instantes."}`);
    } finally {
      setLoadingIA(false);
    }
  };

  const handleEditField = (field: keyof GeneratedJobData, value: any) => {
    if (editedData) {
      setEditedData({ ...editedData, [field]: value });
    }
  };

  const handlePublish = async () => {
    if (!profile) {
      alert("Erro: Sessão do usuário não encontrada. Por favor, faça login novamente.");
      onNavigate('login');
      return;
    }

    if (!editedData) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('jobs_database').insert({
        company_id: profile.id,
        title: editedData.title,
        description: editedData.description,
        salary: formData.salary.trim() || 'A combinar',
        city: formData.city,
        cep: formData.cep.trim() || null,
        job_type: formData.type,
        status: 'Ativa',
        requirements: editedData.requirements,
        soft_skills: editedData.softSkills
      });

      if (error) {
        throw new Error(error.message);
      }

      alert("Vaga publicada com sucesso! 🎉");
      setStep(1);
      setFormData({
        city: profile?.city || 'Florianópolis',
        cep: '',
        type: 'Presencial',
        jobRole: '',
        salary: '',
        userInput: '',
        benefits: '',
        experience: ''
      });
      setGeneratedData(null);
      setEditedData(null);
      onNavigate('dashboard-company');
    } catch (err: any) {
      console.error("Erro detalhado ao publicar vaga:", err);
      alert(`Erro ao publicar: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderProgressBar = () => {
    const steps = ['Localização', 'Detalhes', 'Preview'];
    return (
      <div className="mb-12">
        <div className="flex justify-between mb-4">
          {steps.map((stepName, idx) => (
            <div key={idx} className="flex-1">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  idx + 1 <= step ? 'bg-brand-green text-slate-900' : 'bg-slate-700 text-slate-400'
                }`}>
                  {idx + 1}
                </div>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 transition-all ${idx + 1 < step ? 'bg-brand-green' : 'bg-slate-700'}`}></div>
                )}
              </div>
              <p className={`text-xs font-bold mt-2 uppercase tracking-widest ${idx + 1 <= step ? 'text-brand-green' : 'text-slate-500'}`}>
                {stepName}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="pt-32 pb-24 bg-slate-900 min-h-screen animate-fade-in text-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <button 
            onClick={() => onNavigate('dashboard-company')}
            className="text-slate-400 hover:text-white font-bold text-sm flex items-center gap-2 transition-colors"
          >
            ← Voltar ao Painel
          </button>
          <div className="text-right">
            <h1 className="text-3xl font-black text-white tracking-tight">Publicar Vaga Inteligente</h1>
            <p className="text-brand-green text-xs font-black uppercase tracking-widest mt-1">IA Powered Recruitment SC</p>
          </div>
        </div>

        {renderProgressBar()}

        <div className="space-y-8">
          {/* STEP 1: Localização */}
          {step === 1 && (
            <div className="animate-fade-in space-y-8">
              <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] shadow-2xl">
                <h2 className="text-2xl font-black text-white mb-8">Onde você está buscando talentos?</h2>
                
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Cidade em Santa Catarina</label>
                    <select 
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-5 py-4 text-white outline-none focus:border-brand-green transition-all font-bold"
                      value={formData.city}
                      onChange={e => handleFormChange('city', e.target.value)}
                    >
                      {cities.map(city => (
                        <option key={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">CEP (Opcional)</label>
                    <input 
                      type="text"
                      placeholder="00000-000"
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-5 py-4 text-white outline-none focus:border-brand-green transition-all"
                      value={formData.cep}
                      onChange={e => handleFormChange('cep', e.target.value)}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Modelo de Trabalho</label>
                    <select 
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-5 py-4 text-white outline-none focus:border-brand-green transition-all font-bold"
                      value={formData.type}
                      onChange={e => handleFormChange('type', e.target.value as any)}
                    >
                      {jobTypes.map(type => (
                        <option key={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button 
                  onClick={() => {
                    if (validateStep(1)) setStep(2);
                  }}
                  className="px-10 py-4 bg-brand-green text-slate-900 rounded-2xl font-bold text-lg hover:bg-brand-greenDark transition-all active:scale-95"
                >
                  Próximo →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Detalhes da Vaga */}
          {step === 2 && (
            <div className="animate-fade-in space-y-8">
              <div className="bg-gradient-to-br from-brand-green/20 to-transparent border border-brand-green/30 p-10 rounded-[3rem] shadow-2xl space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-20 text-6xl rotate-12 pointer-events-none">✨</div>
                
                <h2 className="text-2xl font-black text-white relative z-10">Conte-nos sobre a oportunidade</h2>

                <div className="grid md:grid-cols-2 gap-8 relative z-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Função / Cargo *</label>
                    <input 
                      type="text"
                      placeholder="Ex: Dev React Senior, Gerente de Loja..."
                      className="w-full bg-brand-dark/50 border border-brand-green/20 rounded-xl px-5 py-4 text-white outline-none focus:border-brand-green transition-all font-bold"
                      value={formData.jobRole}
                      onChange={e => handleFormChange('jobRole', e.target.value)}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Salário Previsto (Opcional)</label>
                    <input 
                      type="text"
                      placeholder="Ex: R$ 4.500 ou A combinar"
                      className="w-full bg-brand-dark/50 border border-brand-green/20 rounded-xl px-5 py-4 text-white outline-none focus:border-brand-green transition-all font-bold"
                      value={formData.salary}
                      onChange={e => handleFormChange('salary', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 relative z-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nível de Experiência</label>
                    <select 
                      className="w-full bg-brand-dark/50 border border-brand-green/20 rounded-xl px-5 py-4 text-white outline-none focus:border-brand-green transition-all font-bold"
                      value={formData.experience}
                      onChange={e => handleFormChange('experience', e.target.value)}
                    >
                      <option value="">Selecionar...</option>
                      {experienceLevels.map(level => (
                        <option key={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Benefícios Oferecidos</label>
                    <input 
                      type="text"
                      placeholder="Ex: Vale refeição, Flex time, Home office"
                      className="w-full bg-brand-dark/50 border border-brand-green/20 rounded-xl px-5 py-4 text-white outline-none focus:border-brand-green transition-all font-bold"
                      value={formData.benefits}
                      onChange={e => handleFormChange('benefits', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4 relative z-10">
                  <h3 className="text-lg font-black text-white">O que o profissional fará? *</h3>
                  <textarea 
                    rows={6}
                    placeholder="Descreva as principais responsabilidades, projetos e atividades do dia a dia..."
                    className="w-full bg-brand-dark/50 border border-brand-green/20 rounded-2xl p-6 text-white outline-none focus:border-brand-green transition-all resize-none font-medium text-base leading-relaxed placeholder:text-slate-600"
                    value={formData.userInput}
                    onChange={e => handleFormChange('userInput', e.target.value)}
                  />
                  <p className="text-xs text-slate-400">Mínimo 10 caracteres. Quanto mais detalhado, melhor a IA compreenderá sua vaga.</p>
                </div>
              </div>

              <div className="flex justify-between gap-4">
                <button 
                  onClick={() => setStep(1)}
                  className="px-10 py-4 bg-slate-800 text-white rounded-2xl font-bold text-lg hover:bg-slate-700 transition-all active:scale-95"
                >
                  ← Voltar
                </button>
                <button 
                  onClick={generateJobDetails}
                  disabled={loadingIA || !formData.jobRole || formData.userInput.length < 10}
                  className="px-10 py-4 bg-brand-green text-slate-900 rounded-2xl font-bold text-lg hover:bg-brand-greenDark transition-all active:scale-95 flex items-center gap-3 disabled:opacity-50 disabled:grayscale"
                >
                  {loadingIA ? (
                    <>
                      <div className="w-5 h-5 border-3 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                      Gerando...
                    </>
                  ) : (
                    <>✨ Gerar Anúncio com IA</>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Preview e Edição */}
          {step === 3 && editedData && (
            <div className="animate-fade-in space-y-8">
              <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border-l-[12px] border-brand-green text-slate-900">
                <div className="mb-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black text-brand-greenDark uppercase tracking-[0.3em] block">Anúncio Gerado por IA</span>
                    <span className="text-[10px] font-black bg-slate-100 px-3 py-1 rounded-full text-slate-400 uppercase tracking-widest">Editável</span>
                  </div>
                  
                  <input
                    type="text"
                    value={editedData.title}
                    onChange={(e) => handleEditField('title', e.target.value)}
                    className="text-4xl font-[900] text-slate-900 leading-tight mb-4 bg-slate-50 border-2 border-slate-200 rounded-lg p-3 w-full focus:outline-none focus:border-brand-green"
                  />
                  
                  <div className="flex flex-wrap gap-4 mt-4">
                    <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                      📍 {formData.city}, SC
                    </span>
                    <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                      💼 {formData.type}
                    </span>
                    <span className="text-brand-greenDark font-black uppercase tracking-widest text-[10px] flex items-center gap-2 bg-brand-green/10 px-3 py-1.5 rounded-lg border border-brand-green/20">
                      💰 {formData.salary || 'A combinar'}
                    </span>
                  </div>
                </div>

                <div className="space-y-10">
                  <div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 border-b border-slate-100 pb-2">A Oportunidade</h3>
                    <textarea
                      value={editedData.description}
                      onChange={(e) => handleEditField('description', e.target.value)}
                      rows={8}
                      className="w-full text-slate-700 leading-relaxed font-medium text-base bg-slate-50 border-2 border-slate-200 rounded-lg p-4 focus:outline-none focus:border-brand-green resize-none"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-10">
                    <div>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 border-b border-slate-100 pb-2">Requisitos Técnicos</h3>
                      <div className="space-y-3">
                        {editedData.requirements.map((req, i) => (
                          <input
                            key={i}
                            type="text"
                            value={req}
                            onChange={(e) => {
                              const newReqs = [...editedData.requirements];
                              newReqs[i] = e.target.value;
                              handleEditField('requirements', newReqs);
                            }}
                            className="w-full text-slate-600 font-bold text-sm bg-slate-50 border-2 border-slate-200 rounded-lg p-3 focus:outline-none focus:border-brand-green"
                          />
                        ))}
                        <button
                          onClick={() => handleEditField('requirements', [...editedData.requirements, 'Novo requisito'])}
                          className="text-brand-green font-bold text-sm hover:underline mt-2"
                        >
                          + Adicionar Requisito
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 border-b border-slate-100 pb-2">Perfil Comportamental</h3>
                      <div className="space-y-3">
                        {editedData.softSkills.map((skill, i) => (
                          <input
                            key={i}
                            type="text"
                            value={skill}
                            onChange={(e) => {
                              const newSkills = [...editedData.softSkills];
                              newSkills[i] = e.target.value;
                              handleEditField('softSkills', newSkills);
                            }}
                            className="w-full text-slate-600 font-bold text-sm bg-slate-50 border-2 border-slate-200 rounded-lg p-3 focus:outline-none focus:border-brand-green"
                          />
                        ))}
                        <button
                          onClick={() => handleEditField('softSkills', [...editedData.softSkills, 'Nova competência'])}
                          className="text-brand-green font-bold text-sm hover:underline mt-2"
                        >
                          + Adicionar Competência
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <button 
                  onClick={() => {
                    setStep(2);
                    setGeneratedData(null);
                    setEditedData(null);
                  }}
                  disabled={isSubmitting}
                  className="flex-1 py-6 bg-slate-800 text-white rounded-[2rem] font-black text-lg hover:bg-slate-700 transition-all active:scale-95 disabled:opacity-50"
                >
                  ← Editar Detalhes
                </button>
                <button 
                  onClick={handlePublish}
                  disabled={isSubmitting}
                  className="flex-[2] py-6 bg-brand-green text-slate-900 rounded-[2rem] font-black text-xl hover:bg-brand-greenDark shadow-2xl shadow-brand-green/20 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-3 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                      Publicando...
                    </>
                  ) : (
                    <>🚀 Publicar Vaga em SC</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostJobPage;
