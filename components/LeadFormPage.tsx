import React, { useState, ChangeEvent, FormEvent } from 'react';

interface FormData {
  nome: string;
  email: string;
  telefone: string;
  bairro: string;
}

export default function Cadastro() {
  const [form, setForm] = useState<FormData>({
    nome: "",
    email: "",
    telefone: "",
    bairro: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [success, setSuccess] = useState(false);

  // Reset success message after 5 seconds
  React.useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Validações simples para os campos de contato
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!form.nome.trim() || form.nome.trim().length < 2) {
      newErrors.nome = "Nome deve ter pelo menos 2 caracteres";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      newErrors.email = "E-mail é obrigatório";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "E-mail inválido";
    }

    const telefoneRegex = /^\+?\d{10,13}$|^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
    if (!form.telefone.trim()) {
      newErrors.telefone = "Telefone é obrigatório";
    } else if (!telefoneRegex.test(form.telefone.replace(/\s|\(|\)|-/g, ''))) {
      newErrors.telefone = "Telefone inválido";
    }

    if (!form.bairro.trim() || form.bairro.trim().length < 2) {
      newErrors.bairro = "Bairro é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Limpar erro específico
  const clearError = (field: keyof FormData) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Atualizar campos
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : value,
    });

    // Limpar erro do campo quando usuário começa a digitar
    clearError(name as keyof FormData);
  };

  // Submit: valida e redireciona para WhatsApp com mensagem contendo os dados
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const nome = encodeURIComponent(form.nome.trim());
      const email = encodeURIComponent(form.email.trim());
      const telefone = encodeURIComponent(form.telefone.trim());
      const bairro = encodeURIComponent(form.bairro.trim());

      const message = `Ol%C3%A1%2C%20meu%20nome%20%C3%A9%20${nome}%2C%20meu%20e-mail%20%C3%A9%20${email}%2C%20meu%20telefone%20%C3%A9%20${telefone}%2C%20bairro%20${bairro}.`;

      // Número de destino fornecido: 85989500747 (BR -> country code 55)
      const whatsappNumber = '5585989500747';
      const waUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

      // Abrir em nova aba/janela
      window.open(waUrl, '_blank');

      // Limpar formulário
      setForm({ nome: '', email: '', telefone: '', bairro: '' });
      setErrors({});
      setSuccess(true);
    } catch (err) {
      console.error('Erro ao abrir WhatsApp:', err);
      alert('Erro ao abrir WhatsApp. Verifique seu navegador.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full min-h-screen flex items-center justify-center bg-slate-50 py-20 px-4">
      <div className="w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl p-6 md:p-10 border border-slate-200">

        <div className="text-center mb-8">
          <div className="text-brand-greenDark uppercase font-bold tracking-[0.3em] text-[11px] mb-4">JOBWAY</div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">
            Fale Conosco
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Deixe seus dados de contato e entraremos em contato via WhatsApp.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 w-[90%] mx-auto">

          {success && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
              <div className="text-emerald-600 text-2xl mb-2">✅</div>
              <h3 className="text-emerald-800 font-black text-lg mb-2">Perfil criado com sucesso!</h3>
              <p className="text-emerald-700">Seus dados foram salvos e em breve entraremos em contato.</p>
            </div>
          )}

          <div>
            <input name="nome" value={form.nome} onChange={handleChange}
              placeholder="Nome Completo" required
              className={`w-full p-4 rounded-2xl border bg-slate-50 text-slate-900 outline-none transition-all ${
                errors.nome ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-brand-green focus:ring-brand-green/20'
              }`} />
            {errors.nome && <p className="text-red-600 text-sm mt-1 font-medium">{errors.nome}</p>}
          </div>

          <div>
            <input name="email" value={form.email} onChange={handleChange}
              type="email" placeholder="E-mail" required
              className={`w-full p-4 rounded-2xl border bg-slate-50 text-slate-900 outline-none transition-all ${
                errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-brand-green focus:ring-brand-green/20'
              }`} />
            {errors.email && <p className="text-red-600 text-sm mt-1 font-medium">{errors.email}</p>}
          </div>

          <div>
            <input name="telefone" value={form.telefone} onChange={handleChange}
              placeholder="Telefone/WhatsApp (com DDD)" required
              className={`w-full p-4 rounded-2xl border bg-slate-50 text-slate-900 outline-none transition-all ${
                errors.telefone ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-brand-green focus:ring-brand-green/20'
              }`} />
            {errors.telefone && <p className="text-red-600 text-sm mt-1 font-medium">{errors.telefone}</p>}
          </div>

          <div>
            <input name="bairro" value={form.bairro} onChange={handleChange}
              placeholder="Bairro" required
              className={`w-full p-4 rounded-2xl border bg-slate-50 text-slate-900 outline-none transition-all ${
                errors.bairro ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-brand-green focus:ring-brand-green/20'
              }`} />
            {errors.bairro && <p className="text-red-600 text-sm mt-1 font-medium">{errors.bairro}</p>}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button type="submit" disabled={loading}
              className="flex-1 py-5 bg-brand-green text-white font-black rounded-2xl text-lg uppercase tracking-[0.1em] hover:bg-brand-greenDark transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl">
              {loading ? "Enviando..." : "Criar Meu Perfil"}
            </button>
            <button type="button" 
              onClick={() => {
                setForm({
                  nome: "",
                  email: "",
                  whatsapp: "",
                  cep: "",
                  cidade: "",
                  estado: "",
                  cargo: "",
                  experiencia: "",
                  habilidades: "",
                  softskills: "",
                  descricao: "",
                  ingles: "",
                  canada: false,
                });
                setErrors({});
                setSuccess(false);
              }}
              className="px-8 py-5 border-2 border-slate-200 text-slate-700 font-black rounded-2xl text-lg uppercase tracking-[0.1em] hover:border-brand-green hover:text-brand-green transition-all">
              Limpar
            </button>
          </div>

        </form>
      </div>
    </section>
  );
}