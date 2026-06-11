import { useState, useEffect } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

export function useEstoque() {
  const [estoque, setEstoque] = useState([]);
  const [modalEstoque, setModalEstoque] = useState(false);
  const [formEstoque, setFormEstoque] = useState({ nome: '', quantidade: '' });

  const carregarEstoque = async () => {
    try {
      const resEstoque = await api.get('/produtos');
      // O seu fallback caso o banco esteja vazio
      const estoqueData = resEstoque.data && resEstoque.data.length > 0 ? resEstoque.data : [
        { id: 1, nome: 'Seringa 5ml', quantidade: 450, status: 'Normal' },
        { id: 2, nome: 'Soro Fisiológico 500ml', quantidade: 12, status: 'Baixo' },
        { id: 3, nome: 'Luvas de Procedimento (M)', quantidade: 5, status: 'Critico' }
      ];
      setEstoque(estoqueData);
    } catch (error) {
      toast.error('Erro ao carregar o estoque.');
    }
  };

  useEffect(() => {
    carregarEstoque();
  }, []);

  const salvarEstoque = async (e) => {
    e.preventDefault();
    try {
      await api.post('/produtos', {
        nome: formEstoque.nome,
        quantidade: Number(formEstoque.quantidade)
      });
      setModalEstoque(false);
      setFormEstoque({ nome: '', quantidade: '' });
      carregarEstoque();
      toast.success('Nota fiscal registrada no estoque!');
    } catch (error) {
      toast.error('Erro ao registrar nota fiscal.');
    }
  };

  return { 
    estoque, 
    modalEstoque, 
    setModalEstoque, 
    formEstoque, 
    setFormEstoque, 
    salvarEstoque 
  };
}