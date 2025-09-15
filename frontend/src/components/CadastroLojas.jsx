import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Store, Edit, Trash2 } from 'lucide-react';
import { api } from '../lib/api';

const CadastroLojas = ({ user }) => {
  const [lojas, setLojas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingLoja, setEditingLoja] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    endereco: '',
    telefone: '',
    email: '',
    observacoes: ''
  });

  useEffect(() => {
    fetchLojas();
  }, []);

  const fetchLojas = async () => {
    try {
      const response = await api.get('/api/lojas');
      setLojas(response.data);
    } catch (error) {
      console.error('Erro ao buscar lojas:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingLoja) {
        await api.put(`/api/lojas/${editingLoja.id}`, formData);
      } else {
        await api.post('/api/lojas', formData);
      }
      
      setShowForm(false);
      setEditingLoja(null);
      setFormData({
        nome: '',
        endereco: '',
        telefone: '',
        email: '',
        observacoes: ''
      });
      fetchLojas();
    } catch (error) {
      console.error('Erro ao salvar loja:', error);
      alert('Erro ao salvar loja. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (loja) => {
    setEditingLoja(loja);
    setFormData({
      nome: loja.nome || '',
      endereco: loja.endereco || '',
      telefone: loja.telefone || '',
      email: loja.email || '',
      observacoes: loja.observacoes || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta loja?')) {
      try {
        await api.delete(`/api/lojas/${id}`);
        fetchLojas();
      } catch (error) {
        console.error('Erro ao excluir loja:', error);
        alert('Erro ao excluir loja. Tente novamente.');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingLoja(null);
    setFormData({
      nome: '',
      endereco: '',
      telefone: '',
      email: '',
      observacoes: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Store className="h-6 w-6" />
            Cadastro de Lojas
          </h2>
          <p className="text-gray-600 mt-1">Gerencie as lojas do sistema</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nova Loja
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingLoja ? 'Editar Loja' : 'Nova Loja'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome da Loja *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Lojas Cadastradas</CardTitle>
        </CardHeader>
        <CardContent>
          {lojas.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Nenhuma loja cadastrada. Clique em "Nova Loja" para começar.
            </p>
          ) : (
            <div className="space-y-4">
              {lojas.map((loja) => (
                <div key={loja.id} className="border rounded-lg p-4 flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{loja.nome}</h3>
                    {loja.endereco && (
                      <p className="text-gray-600 text-sm">{loja.endereco}</p>
                    )}
                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                      {loja.telefone && <span>📞 {loja.telefone}</span>}
                      {loja.email && <span>📧 {loja.email}</span>}
                    </div>
                    {loja.observacoes && (
                      <p className="text-gray-600 text-sm mt-2">{loja.observacoes}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(loja)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(loja.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CadastroLojas;

