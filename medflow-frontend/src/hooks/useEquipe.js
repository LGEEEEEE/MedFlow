import { useState, useEffect } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

export function useEquipe() {
  const [usuarios, setUsuarios] = useState([]);
  const [modalUsuario, setModalUsuario] = useState(false);
  const [formUsuario, setFormUsuario] = useState({
    nome: '', email: '', senha: '', cargo: 'RECEPCAO',
    cpf: '', registro: '', telefone: '', especialidade: ''
  });

  const mascaraCPF = (valor) => {
    return valor.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').replace(/(-\d{2})\d+?$/, '$1');
  };

  const mascaraTelefone = (valor) => {
    return valor.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2').replace(/(-\d{4})\d+?$/, '$1');
  };

  const carregarUsuarios = async () => {
    try {
      const res = await api.get('/usuarios');
      setUsuarios(res.data || []);
    } catch (error) {
      toast.error('Erro ao carregar os usuários.');
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const salvarUsuario = async (e) => {
    e.preventDefault();
    try {
      if (formUsuario.id) {
        await api.put(`/usuarios/${formUsuario.id}`, formUsuario);
        toast.success('Usuário atualizado!');
      } else {
        await api.post('/usuarios', formUsuario);
        toast.success('Usuário cadastrado!');
      }
      setModalUsuario(false);
      setFormUsuario({ nome: '', email: '', senha: '', cargo: 'RECEPCAO', cpf: '', registro: '', telefone: '', especialidade: '' });
      carregarUsuarios();
    } catch (error) {
      toast.error('Erro ao salvar usuário.');
    }
  };

  const excluirUsuario = async (id) => {
    if (window.confirm('Tem certeza que deseja bloquear este usuário?')) {
      try {
        await api.delete(`/usuarios/${id}`);
        carregarUsuarios();
        toast.success('Acesso bloqueado com sucesso.');
      } catch (error) {
        toast.error('Erro ao bloquear usuário.');
      }
    }
  };

  const handleChange = (campo) => (e) => {
    let valor = e.target.value;
    if (campo === 'cpf') valor = mascaraCPF(valor);
    if (campo === 'telefone') valor = mascaraTelefone(valor);
    setFormUsuario(prev => ({ ...prev, [campo]: valor }));
  };

  const abrirEdicao = (usuario) => {
    setFormUsuario(usuario);
    setModalUsuario(true);
  };

  return {
    usuarios, modalUsuario, setModalUsuario, formUsuario,
    handleChange, salvarUsuario, excluirUsuario, abrirEdicao
  };
}