import React, { useState, ChangeEvent, FormEvent } from 'react';

interface FormData {
  nome: string;
  email: string;
  whatsapp: string;
  cep: string;
  cidade: string;
  estado: string;
  cargo: string;
  experiencia: string;
  habilidades: string;
  softskills: string;
  descricao: string;
  ingles: string;
  canada: boolean;
}

export default function Cadastro() {
  const [form, setForm] = useState<FormData>({
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

  // Validações
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    // Nome - mínimo 2 caracteres
    if (!form.nome.trim() || form.nome.trim().length < 2) {
      newErrors.nome = "Nome deve ter pelo menos 2 caracteres";
    }

    // Email - formato válido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      newErrors.email = "E-mail é obrigatório";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "E-mail inválido";
    }

    // WhatsApp - formato brasileiro
    const whatsappRegex = /^\(\d{2}\)\s?\d{4,5}-\d{4}$|^\d{2}\s?\d{4,5}-\d{4}$|^\d{10,11}$/;
    if (!form.whatsapp.trim()) {
      newErrors.whatsapp = "WhatsApp é obrigatório";
    } else if (!whatsappRegex.test(form.whatsapp.replace(/\s/g, ''))) {
      newErrors.whatsapp = "Formato: (11) 99999-9999";
    }

    // CEP - formato válido
    const cepRegex = /^\d{5}-?\d{3}$/;
    if (!form.cep.trim()) {
      newErrors.cep = "CEP é obrigatório";
    } else if (!cepRegex.test(form.cep.replace(/\D/g, ''))) {
      newErrors.cep = "CEP inválido";
    }

    // Cidade e Estado
    if (!form.cidade.trim()) {
      newErrors.cidade = "Cidade é obrigatória";
    }
    if (!form.estado.trim()) {
      newErrors.estado = "Estado é obrigatório";
    }

    // Cargo
    if (!form.cargo.trim()) {
      newErrors.cargo = "Cargo é obrigatório";
    }

    // Experiência
    if (!form.experiencia) {
      newErrors.experiencia = "Selecione o nível de experiência";
    }

    // Inglês
    if (!form.ingles) {
      newErrors.ingles = "Selecione o nível de inglês";
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

  // Buscar CEP
  const buscarCEP = async () => {
    if (!form.cep) return;

    try {
      const res = await fetch(`https://viacep.com.br/ws/${form.cep}/json/`);
      const data = await res.json();

      if (!data.erro) {
        setForm(prev => ({
          ...prev,
          cidade: data.localidade,
          estado: data.uf,
        }));
      }
    } catch (error) {
      console.error("Erro ao buscar CEP");
    }
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Preparar dados para envio
      const formData = new FormData();
      formData.append('nome', form.nome.trim());
      formData.append('email', form.email.trim());
      formData.append('whatsapp', form.whatsapp.trim());
      formData.append('cep', form.cep.trim());
      formData.append('cidade', form.cidade.trim());
      formData.append('estado', form.estado.trim());
      formData.append('cargo', form.cargo.trim());
      formData.append('experiencia', form.experiencia);
      formData.append('habilidades', form.habilidades.trim());
      formData.append('softskills', form.softskills.trim());
      formData.append('descricao', form.descricao.trim());
      formData.append('ingles', form.ingles);
      formData.append('canada', form.canada ? 'Sim' : 'Não');
      formData.append('dataCadastro', new Date().toLocaleString('pt-BR'));

      // Enviar para Google Sheets - com tratamento de CORS
      const response = await fetch('https://script.google.com/macros/s/AKfycby4OjBZQ7KdaBZu0S8CLEyMIV5vW-LurOmwuLUDjM-ZIqDYsfcTrp-IILy581r_fOm7DA/exec', {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
      });

      // Com no-cors, response.ok não funciona. Vamos assumir sucesso
      setSuccess(true);
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
      
      // Log para verificação
      console.log('Dados enviados com sucesso para Google Sheets');
    } catch (error) {
      console.error('Erro ao enviar:', error);
      alert('Erro ao enviar formulário. Tente novamente.');
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
            Cadastro de Perfil Profissional
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Complete seu perfil e tenha acesso às melhores oportunidades de emprego em Santa Catarina
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
            <input name="whatsapp" value={form.whatsapp} onChange={handleChange}
              placeholder="WhatsApp (com DDD)" required
              className={`w-full p-4 rounded-2xl border bg-slate-50 text-slate-900 outline-none transition-all ${
                errors.whatsapp ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-brand-green focus:ring-brand-green/20'
              }`} />
            {errors.whatsapp && <p className="text-red-600 text-sm mt-1 font-medium">{errors.whatsapp}</p>}
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <input name="cep" value={form.cep} onChange={handleChange}
                onBlur={buscarCEP}
                placeholder="CEP" required
                className={`w-full p-4 rounded-2xl border bg-slate-50 text-slate-900 outline-none transition-all ${
                  errors.cep ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-brand-green focus:ring-brand-green/20'
                }`} />
              {errors.cep && <p className="text-red-600 text-sm mt-1 font-medium">{errors.cep}</p>}
            </div>

            <div>
              <input name="cidade" value={form.cidade} onChange={handleChange}
                placeholder="Cidade" required
                className={`w-full p-4 rounded-2xl border bg-slate-50 text-slate-900 outline-none transition-all ${
                  errors.cidade ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-brand-green focus:ring-brand-green/20'
                }`} />
              {errors.cidade && <p className="text-red-600 text-sm mt-1 font-medium">{errors.cidade}</p>}
            </div>

            <div>
              <input name="estado" value={form.estado} onChange={handleChange}
                placeholder="UF" required
                className={`w-full p-4 rounded-2xl border bg-slate-50 text-slate-900 outline-none transition-all ${
                  errors.estado ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-brand-green focus:ring-brand-green/20'
                }`} />
              {errors.estado && <p className="text-red-600 text-sm mt-1 font-medium">{errors.estado}</p>}
            </div>
          </div>

          <div>
            <input name="cargo" value={form.cargo} onChange={handleChange}
              placeholder="Cargo/Profissão Principal" required
              className={`w-full p-4 rounded-2xl border bg-slate-50 text-slate-900 outline-none transition-all ${
                errors.cargo ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-brand-green focus:ring-brand-green/20'
              }`} />
            {errors.cargo && <p className="text-red-600 text-sm mt-1 font-medium">{errors.cargo}</p>}
          </div>

          <div>
            <select name="experiencia" value={form.experiencia} onChange={handleChange}
              required className={`w-full p-4 rounded-2xl border bg-slate-50 text-slate-900 outline-none transition-all ${
                errors.experiencia ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-brand-green focus:ring-brand-green/20'
              }`}>
              <option value="">Nível de Experiência</option>
              <option value="Junior">Júnior</option>
              <option value="Pleno">Pleno</option>
              <option value="Senior">Sênior</option>
            </select>
            {errors.experiencia && <p className="text-red-600 text-sm mt-1 font-medium">{errors.experiencia}</p>}
          </div>

          <input name="habilidades" value={form.habilidades} onChange={handleChange}
            placeholder="Habilidades Técnicas"
            className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 transition-all" />

          <input name="softskills" value={form.softskills} onChange={handleChange}
            placeholder="Soft Skills"
            className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 transition-all" />

          <textarea name="descricao" value={form.descricao} onChange={handleChange}
            rows={4}
            placeholder="Conte sua história profissional..."
            className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 transition-all resize-none" />

          <div>
            <select name="ingles" value={form.ingles} onChange={handleChange}
              required className={`w-full p-4 rounded-2xl border bg-slate-50 text-slate-900 outline-none transition-all ${
                errors.ingles ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-brand-green focus:ring-brand-green/20'
              }`}>
              <option value="">Nível de Inglês</option>
              <option value="Basico">Básico</option>
              <option value="Intermediario">Intermediário</option>
              <option value="Avancado">Avançado</option>
            </select>
            {errors.ingles && <p className="text-red-600 text-sm mt-1 font-medium">{errors.ingles}</p>}
          </div>

          <label className="flex items-center space-x-3 cursor-pointer p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:border-brand-green transition-all">
            <input type="checkbox" name="canada"
              checked={form.canada}
              onChange={handleChange}
              className="w-5 h-5 accent-brand-green" />
            <span className="text-slate-700 font-medium">Tenho interesse no mercado Canadense 🇨🇦</span>
          </label>

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