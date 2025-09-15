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
      console.error('Erro ao carregar lojas:', error);
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
      
      await fetchLojas();
      resetForm();
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
      nome: loja.nome,
      endereco: loja.endereco || '',
      telefone: loja.telefone || '',
      email: loja.email || '',
      observacoes: loja.observacoes || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir esta loja?')) return;

    try {
      await api.delete(`/api/lojas/${id}`);
      await fetchLojas();
    } catch (error) {
      console.error('Erro ao excluir loja:', error);
      alert('Erro ao excluir loja. Verifique se não há funcionários associados.');
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      endereco: '',
      telefone: '',
      email: '',
      observacoes: ''
    });
    setEditingLoja(null);
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Store className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Cadastro de Lojas</h2>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nova Loja</span>
        </Button>
      </div>

      {/* Formulário */}
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
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    placeholder="Ex: Loja Barão"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    placeholder="(31) 99999-9999"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleInputChange}
                  placeholder="Rua, número, bairro, cidade"
                />
              </div>

              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="loja@exemplo.com"
                />
              </div>

              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleInputChange}
                  placeholder="Informações adicionais sobre a loja"
                  rows={3}
                />
              </div>

              <div className="flex space-x-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Salvando...' : (editingLoja ? 'Atualizar' : 'Salvar')}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de Lojas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lojas.map((loja) => (
          <Card key={loja.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{loja.nome}</CardTitle>
                <div className="flex space-x-1">
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
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 text-sm text-gray-600">
                {loja.endereco && (
                  <p><strong>Endereço:</strong> {loja.endereco}</p>
                )}
                {loja.telefone && (
                  <p><strong>Telefone:</strong> {loja.telefone}</p>
                )}
                {loja.email && (
                  <p><strong>E-mail:</strong> {loja.email}</p>
                )}
                {loja.observacoes && (
                  <p><strong>Observações:</strong> {loja.observacoes}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {lojas.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma loja cadastrada ainda.</p>
            <p className="text-sm text-gray-400 mt-2">
              Clique em "Nova Loja" para começar.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CadastroLojas;

