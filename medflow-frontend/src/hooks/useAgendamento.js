import { useState, useEffect } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

export function useAgendamento(fecharModal, atualizarFila, tipoAgendamento) {
  const [form, setForm] = useState({
    cpf: '', pacienteNome: '', celular: '',
    cep: '', endereco: '', numero: '', bairro: '', cidade: '', uf: '',
    convenio: 'PARTICULAR',
    // Específicos de Consulta
    medicoResponsavel: '', data: '', hora: '', motivo: '', encaixe: false,
    // Específicos de Exame
    tipoExame: '', preparo: ''
  });

  const [medicos, setMedicos] = useState([]);

  useEffect(() => {
    // Só carrega a lista de médicos se for um modal de consulta
    if (tipoAgendamento === 'consulta') {
      api.get('/usuarios').then(res => {
        setMedicos(res.data.filter(u => u.cargo === 'MEDICO'));
      }).catch(() => toast.error('Erro ao carregar médicos'));
    }
  }, [tipoAgendamento]);

  const buscarPacientePorCpf = async (cpfDigitado) => {
    const cpf = cpfDigitado.replace(/\D/g, '');
    if (cpf.length === 11) {
      try {
        const res = await api.get(`/pacientes/${cpf}`);
        if (res.data) {
          const p = res.data;
          setForm(prev => ({
            ...prev,
            pacienteNome: p.nome || '', celular: p.whatsapp || '',
            cep: p.cep || '', endereco: p.endereco || '', numero: p.numero || '',
            bairro: p.bairro || '', cidade: p.cidade || '', uf: p.uf || ''
          }));
        }
      } catch (error) {
        // Silencioso, apenas deixa o usuário digitar manualmente se não achar
      }
    }
  };

  const buscarCep = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setForm(prev => ({
          ...prev, endereco: data.logradouro, bairro: data.bairro,
          cidade: data.localidade, uf: data.uf
        }));
      } else {
        toast.error('CEP não encontrado.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const salvarAgendamento = async (e) => {
    e.preventDefault();
    try {
      await api.post('/atendimentos', {
        nome: form.pacienteNome,
        cpf: form.cpf.replace(/\D/g, ''),
        whatsapp: form.celular.replace(/\D/g, ''),
        cep: form.cep, endereco: form.endereco, numero: form.numero,
        bairro: form.bairro, cidade: form.cidade, uf: form.uf,
        convenio: form.convenio,
        status: 'AGENDADO'
      });
      toast.success('Agendamento salvo com sucesso!');
      fecharModal();
      atualizarFila();
    } catch (error) {
      toast.error('Erro ao salvar agendamento.');
    }
  };

  return { form, setForm, medicos, buscarPacientePorCpf, buscarCep, salvarAgendamento };
}