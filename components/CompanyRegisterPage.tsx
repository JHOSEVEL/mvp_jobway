import React, { useState } from 'react';

interface CompanyFormData {
  nomeEmpresa: string;
  cnpj: string;
  nomeContato: string;
  email: string;
  whatsapp: string;
  cep: string;
  cidade: string;
  estado: string;
  segmento: string;
  porte: string;
  descricao: string;
  site: string;
}

interface CompanyRegisterPageProps {
  onNavigate: (page: string) => void;
}

const digitsOnly = (s: string) => s.replace(/\D/g, '');

const CompanyRegisterPage: React.FC<CompanyRegisterPageProps> = ({ onNavigate }) => {
  const [form, setForm] = useState<CompanyFormData>({
    nomeEmpresa: '',
    cnpj: '',
    nomeContato: '',
    email: '',
    whatsapp: '',
    cep: '',
    cidade: '',
    estado: '',
    segmento: '',
    porte: '',
    descricao: '',
    site: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof CompanyFormData, string>>>({});
  const [success, setSuccess] = useState(false);

  React.useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(false), 6000);
      return () => clearTimeout(t);
    }
  }, [success]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CompanyFormData, string>> = {};

    if (!form.nomeEmpresa.trim() || form.nomeEmpresa.trim().length < 2) {
      newErrors.nomeEmpresa = 'Informe o nome ou razão social da empresa';
    }

    const cnpjDigits = digitsOnly(form.cnpj);
    if (cnpjDigits.length !== 14) {
      newErrors.cnpj = 'CNPJ deve conter 14 dígitos';
    }

    if (!form.nomeContato.trim() || form.nomeContato.trim().length < 2) {
      newErrors.nomeContato = 'Informe o nome do responsável';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = 'E-mail inválido';
    }

    const whatsappRegex = /^\(\d{2}\)\s?\d{4,5}-\d{4}$|^\d{2}\s?\d{4,5}-\d{4}$|^\d{10,11}$/;
    if (!form.whatsapp.trim()) {
      newErrors.whatsapp = 'WhatsApp é obrigatório';
    } else if (!whatsappRegex.test(form.whatsapp.replace(/\s/g, ''))) {
      newErrors.whatsapp = 'Formato: (48) 99999-9999';
    }

    const cepRegex = /^\d{5}-?\d{3}$/;
    if (!form.cep.trim()) {
      newErrors.cep = 'CEP é obrigatório';
    } else if (!cepRegex.test(digitsOnly(form.cep))) {
      newErrors.cep = 'CEP inválido';
    }

    if (!form.cidade.trim()) newErrors.cidade = 'Cidade é obrigatória';
    if (!form.estado.trim()) newErrors.estado = 'UF é obrigatória';
    if (!form.segmento) newErrors.segmento = 'Selecione o segmento';
    if (!form.porte) newErrors.porte = 'Selecione o porte';
    if (!form.descricao.trim() || form.descricao.trim().length < 20) {
      newErrors.descricao = 'Descreva suas necessidades (mín. 20 caracteres)';
    }

    if (form.site.trim()) {
      try {
        const u = form.site.trim().startsWith('http') ? form.site.trim() : `https://${form.site.trim()}`;
        void new URL(u);
      } catch {
        newErrors.site = 'URL inválida';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field: keyof CompanyFormData) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    clearError(name as keyof CompanyFormData);
  };

  const buscarCEP = async () => {
    const cep = digitsOnly(form.cep);
    if (cep.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setForm((prev) => ({
          ...prev,
          cidade: data.localidade,
          estado: data.uf,
        }));
      }
    } catch {
      console.error('Erro ao buscar CEP');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Cadastro B2B: integrar com backend ou Google Sheets quando houver endpoint dedicado
      await new Promise((r) => setTimeout(r, 600));
      setSuccess(true);
      setForm({
        nomeEmpresa: '',
        cnpj: '',
        nomeContato: '',
        email: '',
        whatsapp: '',
        cep: '',
        cidade: '',
        estado: '',
        segmento: '',
        porte: '',
        descricao: '',
        site: '',
      });
      setErrors({});
    } catch {
      alert('Não foi possível enviar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: keyof CompanyFormData) =>
    `w-full p-4 rounded-2xl border bg-slate-50 text-slate-900 outline-none transition-all ${
      errors[field]
        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
        : 'border-slate-200 focus:border-brand-green focus:ring-brand-green/20'
    }`;

  return (
    <section className="w-full min-h-screen flex items-center justify-center bg-slate-50 py-24 px-4">
      <div className="w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl p-6 md:p-10 border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="text-sm font-bold text-slate-500 hover:text-brand-greenDark self-start order-2 sm:order-1"
          >
            ← Voltar ao início
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="text-brand-greenDark uppercase font-bold tracking-[0.3em] text-[11px] mb-4">JOBWAY</div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">Cadastro de Empresa</h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Preencha os dados da sua empresa para receber contato da nossa equipe e acesso à plataforma de recrutamento.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 w-[90%] mx-auto">
          {success && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
              <div className="text-emerald-600 text-2xl mb-2">✅</div>
              <h3 className="text-emerald-800 font-black text-lg mb-2">Cadastro recebido!</h3>
              <p className="text-emerald-700">
                Em breve nossa equipe entra em contato pelo e-mail ou WhatsApp informados.
              </p>
            </div>
          )}

          <div>
            <input
              name="nomeEmpresa"
              value={form.nomeEmpresa}
              onChange={handleChange}
              placeholder="Razão social ou nome fantasia"
              className={inputClass('nomeEmpresa')}
            />
            {errors.nomeEmpresa && (
              <p className="text-red-600 text-sm mt-1 font-medium">{errors.nomeEmpresa}</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <input
                name="cnpj"
                value={form.cnpj}
                onChange={handleChange}
                placeholder="CNPJ (apenas números ou com máscara)"
                className={inputClass('cnpj')}
              />
              {errors.cnpj && <p className="text-red-600 text-sm mt-1 font-medium">{errors.cnpj}</p>}
            </div>
            <div>
              <input
                name="nomeContato"
                value={form.nomeContato}
                onChange={handleChange}
                placeholder="Nome do responsável"
                className={inputClass('nomeContato')}
              />
              {errors.nomeContato && (
                <p className="text-red-600 text-sm mt-1 font-medium">{errors.nomeContato}</p>
              )}
            </div>
          </div>

          <div>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="E-mail corporativo"
              className={inputClass('email')}
            />
            {errors.email && <p className="text-red-600 text-sm mt-1 font-medium">{errors.email}</p>}
          </div>

          <div>
            <input
              name="whatsapp"
              value={form.whatsapp}
              onChange={handleChange}
              placeholder="WhatsApp (com DDD)"
              className={inputClass('whatsapp')}
            />
            {errors.whatsapp && (
              <p className="text-red-600 text-sm mt-1 font-medium">{errors.whatsapp}</p>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <input
                name="cep"
                value={form.cep}
                onChange={handleChange}
                onBlur={buscarCEP}
                placeholder="CEP"
                className={inputClass('cep')}
              />
              {errors.cep && <p className="text-red-600 text-sm mt-1 font-medium">{errors.cep}</p>}
            </div>
            <div>
              <input
                name="cidade"
                value={form.cidade}
                onChange={handleChange}
                placeholder="Cidade"
                className={inputClass('cidade')}
              />
              {errors.cidade && (
                <p className="text-red-600 text-sm mt-1 font-medium">{errors.cidade}</p>
              )}
            </div>
            <div>
              <input
                name="estado"
                value={form.estado}
                onChange={handleChange}
                placeholder="UF"
                maxLength={2}
                className={inputClass('estado')}
              />
              {errors.estado && (
                <p className="text-red-600 text-sm mt-1 font-medium">{errors.estado}</p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <select
                name="segmento"
                value={form.segmento}
                onChange={handleChange}
                className={inputClass('segmento')}
              >
                <option value="">Segmento da empresa</option>
                <option value="industria">Indústria</option>
                <option value="comercio">Comércio</option>
                <option value="servicos">Serviços</option>
                <option value="tecnologia">Tecnologia</option>
                <option value="saude">Saúde</option>
                <option value="educacao">Educação</option>
                <option value="outro">Outro</option>
              </select>
              {errors.segmento && (
                <p className="text-red-600 text-sm mt-1 font-medium">{errors.segmento}</p>
              )}
            </div>
            <div>
              <select name="porte" value={form.porte} onChange={handleChange} className={inputClass('porte')}>
                <option value="">Porte (funcionários)</option>
                <option value="1-10">1 a 10</option>
                <option value="11-50">11 a 50</option>
                <option value="51-200">51 a 200</option>
                <option value="201+">Mais de 200</option>
              </select>
              {errors.porte && <p className="text-red-600 text-sm mt-1 font-medium">{errors.porte}</p>}
            </div>
          </div>

          <div>
            <input
              name="site"
              value={form.site}
              onChange={handleChange}
              placeholder="Site da empresa (opcional)"
              className={inputClass('site')}
            />
            {errors.site && <p className="text-red-600 text-sm mt-1 font-medium">{errors.site}</p>}
          </div>

          <div>
            <textarea
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              rows={4}
              placeholder="Quais vagas ou perfis você precisa contratar? Contexto ajuda nosso time a preparar a demo."
              className={`${inputClass('descricao')} resize-none`}
            />
            {errors.descricao && (
              <p className="text-red-600 text-sm mt-1 font-medium">{errors.descricao}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-5 bg-brand-green text-white font-black rounded-2xl text-lg uppercase tracking-[0.1em] hover:bg-brand-greenDark transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? 'Enviando...' : 'Enviar cadastro'}
            </button>
            <button
              type="button"
              onClick={() => {
                setForm({
                  nomeEmpresa: '',
                  cnpj: '',
                  nomeContato: '',
                  email: '',
                  whatsapp: '',
                  cep: '',
                  cidade: '',
                  estado: '',
                  segmento: '',
                  porte: '',
                  descricao: '',
                  site: '',
                });
                setErrors({});
                setSuccess(false);
              }}
              className="px-8 py-5 border-2 border-slate-200 text-slate-700 font-black rounded-2xl text-lg uppercase tracking-[0.1em] hover:border-brand-green hover:text-brand-green transition-all"
            >
              Limpar
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CompanyRegisterPage;
