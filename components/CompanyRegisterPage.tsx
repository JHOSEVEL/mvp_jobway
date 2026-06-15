import React, { useState } from 'react';

interface CompanyFormData {
  nome: string;
  email: string;
  telefone: string;
  bairro: string;
  empresa: string;
}

interface CompanyRegisterPageProps {
  onNavigate: (page: string) => void;
}

const digitsOnly = (s: string) => s.replace(/\D/g, '');

const CompanyRegisterPage: React.FC<CompanyRegisterPageProps> = ({ onNavigate }) => {
  const [form, setForm] = useState<CompanyFormData>({
    nome: '',
    email: '',
    telefone: '',
    bairro: '',
    empresa: '',
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

    if (!form.nome.trim() || form.nome.trim().length < 2) newErrors.nome = 'Nome deve ter pelo menos 2 caracteres';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = 'E-mail inválido';
    }

    const telefoneRegex = /^\+?\d{10,13}$|^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
    if (!form.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    } else if (!telefoneRegex.test(form.telefone.replace(/\s|\(|\)|-/g, ''))) {
      newErrors.telefone = 'Telefone inválido';
    }

    if (!form.bairro.trim() || form.bairro.trim().length < 2) newErrors.bairro = 'Bairro é obrigatório';

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

  // No CEP lookup needed for simplified contact form

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const nome = encodeURIComponent(form.nome.trim());
      const email = encodeURIComponent(form.email.trim());
      const telefone = encodeURIComponent(form.telefone.trim());
      const bairro = encodeURIComponent(form.bairro.trim());
      const empresa = encodeURIComponent(form.empresa.trim() || '[Nome da sua Empresa]');

      const message = `Ol%C3%A1%2C%20tudo%20bem%3F%0A%0AMe%20chamo%20*${nome}*%2C%20sou%20da%20empresa%20*${empresa}*%20e%20estou%20entrando%20em%20contato%20pois%20temos%20uma%20vaga%20de%20emprego%20aberta%20em%20nossa%20organiza%C3%A7%C3%A3o.%0A%0AGostar%C3%ADamos%20muito%20de%20contar%20com%20a%20expertise%20de%20voc%C3%AAs%20para%20nos%20ajudar%20a%20buscar%20e%20selecionar%20os%20melhores%20talentos%20para%20essa%20oportunidade.%0A%0A*Nossos%20dados%20para%20in%C3%ADcio%20do%20atendimento*%3A%0A%0A-%20%F0%9F%93%A7%20*E-mail*%3A%20${email}%0A-%20%F0%9F%93%B1%20*Telefone*%3A%20${telefone}%0A-%20%F0%9F%8C%8D%20*Localiza%C3%A7%C3%A3o*%3A%20${bairro}%0A%0AComo%20funciona%20o%20processo%20de%20voc%C3%AAs%20para%20alinharmos%20o%20perfil%20da%20vaga%20e%20iniciarmos%20a%20divulga%C3%A7%C3%A3o%3F%20Ficamos%20no%20aguardo!%0A%0AAtenciosamente%2C%0A*${nome}*`;

      const whatsappNumber = '5585989500747';
      const waUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

      window.open(waUrl, '_blank');

      setForm({ nome: '', email: '', telefone: '', bairro: '', empresa: '' });
      setErrors({});
      setSuccess(true);
    } catch (err) {
      console.error('Erro ao abrir WhatsApp:', err);
      alert('Erro ao abrir WhatsApp. Verifique seu navegador.');
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
          <h2 className="text-3xl font-black text-slate-900 mb-4">Contato Profissional</h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Use este formulário para enviar uma mensagem profissional via WhatsApp.
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
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Nome completo"
              className={inputClass('nome')}
            />
            {errors.nome && <p className="text-red-600 text-sm mt-1 font-medium">{errors.nome}</p>}
          </div>

          <div>
            <input
              name="empresa"
              value={form.empresa}
              onChange={handleChange}
              placeholder="Nome da sua empresa"
              className={inputClass('empresa')}
            />
          </div>

          <div>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="E-mail"
              className={inputClass('email')}
            />
            {errors.email && <p className="text-red-600 text-sm mt-1 font-medium">{errors.email}</p>}
          </div>

          <div>
            <input
              name="telefone"
              value={form.telefone}
              onChange={handleChange}
              placeholder="Telefone/WhatsApp (com DDD)"
              className={inputClass('telefone')}
            />
            {errors.telefone && <p className="text-red-600 text-sm mt-1 font-medium">{errors.telefone}</p>}
          </div>

          <div>
            <input
              name="bairro"
              value={form.bairro}
              onChange={handleChange}
              placeholder="Bairro"
              className={inputClass('bairro')}
            />
            {errors.bairro && <p className="text-red-600 text-sm mt-1 font-medium">{errors.bairro}</p>}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-5 bg-brand-green text-white font-black rounded-2xl text-lg uppercase tracking-[0.1em] hover:bg-brand-greenDark transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? 'Enviando...' : 'Enviar via WhatsApp'}
            </button>
            <button
              type="button"
              onClick={() => {
                setForm({ nome: '', email: '', telefone: '', bairro: '', empresa: '' });
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
