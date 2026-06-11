import { useState } from 'react';
import axios from 'axios';
import { api } from '../services/api';
import { aplicarMascaraCpf, aplicarMascaraWhatsApp, calcularIdade } from '../utils/formatters';

export function useCadastro(fecharModal, atualizarFila) {
  const [form, setForm] = useState({
    nome: '', cpf: '', dataNascimento: '', sexo: '', email: '', whatsapp: '',
    cep: '', endereco: '', numero: '', bairro: '', cidade: '', uf: '',
    nomeMae: '', responsavel: '', cpfResponsavel: '', parentesco: '',
    convenio: 'PARTICULAR', numCarteirinha: ''
  });

  const handleChange = (campo) => (e) => {
    let valor = e.target.value;
    if (campo === 'cpf' || campo === 'cpfResponsavel') valor = aplicarMascaraCpf(valor);
    if (campo === 'whatsapp') valor = aplicarMascaraWhatsApp(valor);
    
    setForm(prev => ({ ...prev, [campo]: valor }));
  };

  const handleCep = async (e) => {
    let valor = e.target.value.replace(/\D/g, '');
    if (valor.length > 8) valor = valor.slice(0, 8);
    const cepMascarado = valor.replace(/^(\d{5})(\d)/, '$1-$2');
    
    setForm(prev => ({ ...prev, cep: cepMascarado }));

    if (valor.length === 8) {
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${valor}/json/`);
        if (!response.data.erro) {
          setForm(prev => ({
            ...prev,
            endereco: response.data.logradouro,
            bairro: response.data.bairro,
            cidade: response.data.localidade,
            uf: response.data.uf
          }));
        }
      } catch (error) {
        alert('Erro ao buscar CEP na base dos Correios.');
      }
    }
  };

  const handleSalvar = async (e) => {
    e.preventDefault();

    if (!form.dataNascimento) return alert('A data de nascimento é obrigatória.');

    const idade = calcularIdade(form.dataNascimento);

    if (idade < 18 && (!form.nomeMae.trim() || !form.responsavel.trim())) {
      return alert('Para pacientes menores de 18 anos, os campos Nome da Mãe e Responsável são obrigatórios.');
    }
    if (idade >= 60 && !form.responsavel.trim()) {
      return alert('Para pacientes com 60 anos ou mais, o campo Responsável/Acompanhante é obrigatório.');
    }

    try {
      await api.post('/atendimentos', {
        nome: form.nome,
        cpf: form.cpf.replace(/\D/g, ''),
        data_nascimento: new Date(form.dataNascimento).toISOString(),
        sexo: form.sexo,
        whatsapp: form.whatsapp.replace(/\D/g, ''),
        cep: form.cep.replace(/\D/g, ''),
        endereco: form.endereco,
        numero: form.numero,
        bairro: form.bairro,
        cidade: form.cidade,
        uf: form.uf,
        nome_mae: form.nomeMae,
        nome_responsavel: form.responsavel,
        cpf_responsavel: form.cpfResponsavel.replace(/\D/g, ''),
        parentesco: form.parentesco,
        convenio: form.convenio,
        numero_guia: form.numCarteirinha,
        status: 'AGUARDANDO_TRIAGEM',
        categoria: 'GERAL',
        paciente: { nome: form.nome }
      });
      atualizarFila();
      fecharModal();
    } catch (error) {
      const mensagemErro = error.response?.data?.error || 'Verifique o terminal do backend para mais detalhes.';
      alert(`Falha ao salvar o paciente: ${mensagemErro}`);
    }
  };

  return { form, handleChange, handleCep, handleSalvar };
}