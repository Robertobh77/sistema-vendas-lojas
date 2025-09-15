import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Users, Edit, Trash2 } from 'lucide-react';
import { operadoresAPI, lojasAPI } from '../lib/api';

const CadastroFuncionarios = ({ user }) => {
  const [funcionarios, setFuncionarios] = useState([]);
  const [lojas, setLojas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingFuncionario, setEditingFuncionario] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    loja_id: '',
    cargo: 'operador',
    meta_mensal: 2000,
    ativo: true
  });

  useEffect(() => {
    fetchFuncionarios();
    fetchLojas();
  }, []);

  const fetchFuncionarios = async () => {
    try {
      const response = await operadoresAPI.getAll();
      setFuncionarios(response.data);
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
    }
  };

  const fetchLojas = async () => {
    try {
      const response = await lojasAPI.getAll();
      setLojas(response.data);
    } catch (error) {
      console.error('Erro ao carregar lojas:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        meta_mensal: parseFloat(formData.meta_mensal)
      };

      if (editingFuncionario) {
        await api.put(`/api/operadores/${editingFuncionario.id}`, payload);
      } else {
        await api.post('/api/operadores', payload);
      }
      
      await fetchFuncionarios();
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar funcionário:', error);
      alert('Erro ao salvar funcionário. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (funcionario) => {
    setEditingFuncionario(funcionario);
    setFormData({
      nome: funcionario.nome,
      loja_id: funcionario.loja_id?.toString() || '',
      cargo: funcionario.cargo || 'operador',
      meta_mensal: funcionario.meta_mensal || 2000,
      ativo: funcionario.ativo !== false
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este funcionário?')) return;

    try {
      await api.delete(`/api/operadores/${id}`);
      await fetchFuncionarios();
    } catch (error) {
      console.error('Erro ao excluir funcionário:', error);
      alert('Erro ao excluir funcionário. Tente novamente.');
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      loja_id: '',
      cargo: 'operador',
      meta_mensal: 2000,
      ativo: true
    });
    setEditingFuncionario(null);
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const getLojaName = (lojaId) => {
    const loja = lojas.find(l => l.id === lojaId);
    return loja ? loja.nome : 'Loja não encontrada';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Cadastro de Funcionários</h2>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Novo Funcionário</span>
        </Button>
      </div>

      {/* Formulário */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingFuncionario ? 'Editar Funcionário' : 'Novo Funcionário'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome do Funcionário *</Label>
                  <Input
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    placeholder="Ex: RENATO, ONLINE 2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="loja_id">Loja *</Label>
                  <Select 
                    value={formData.loja_id} 
                    onValueChange={(value) => handleSelectChange('loja_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma loja" />
                    </SelectTrigger>
                    <SelectContent>
                      {lojas.map((loja) => (
                        <SelectItem key={loja.id} value={loja.id.toString()}>
                          {loja.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cargo">Cargo</Label>
                  <Select 
                    value={formData.cargo} 
                    onValueChange={(value) => handleSelectChange('cargo', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operador">Operador</SelectItem>
                      <SelectItem value="gerente">Gerente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="meta_mensal">Meta Mensal (R$)</Label>
                  <Input
                    id="meta_mensal"
                    name="meta_mensal"
                    type="number"
                    step="0.01"
                    value={formData.meta_mensal}
                    onChange={handleInputChange}
                    placeholder="2000.00"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="ativo"
                  name="ativo"
                  checked={formData.ativo}
                  onChange={handleInputChange}
                  className="rounded"
                />
                <Label htmlFor="ativo">Funcionário ativo</Label>
              </div>

              <div className="flex space-x-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Salvando...' : (editingFuncionario ? 'Atualizar' : 'Salvar')}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de Funcionários */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {funcionarios.map((funcionario) => (
          <Card key={funcionario.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{funcionario.nome}</CardTitle>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(funcionario)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(funcionario.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Loja:</strong> {getLojaName(funcionario.loja_id)}</p>
                <p><strong>Cargo:</strong> {funcionario.cargo === 'gerente' ? 'Gerente' : 'Operador'}</p>
                <p><strong>Meta Mensal:</strong> R$ {funcionario.meta_mensal?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}</p>
                <p><strong>Status:</strong> 
                  <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                    funcionario.ativo !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {funcionario.ativo !== false ? 'Ativo' : 'Inativo'}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {funcionarios.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum funcionário cadastrado ainda.</p>
            <p className="text-sm text-gray-400 mt-2">
              Clique em "Novo Funcionário" para começar.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CadastroFuncionarios;

