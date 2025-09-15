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
      const dataToSend = {
        ...formData,
        loja_id: parseInt(formData.loja_id),
        meta_mensal: parseFloat(formData.meta_mensal)
      };

      if (editingFuncionario) {
        await operadoresAPI.update(editingFuncionario.id, dataToSend);
      } else {
        await operadoresAPI.create(dataToSend);
      }
      
      setShowForm(false);
      setEditingFuncionario(null);
      setFormData({
        nome: '',
        loja_id: '',
        cargo: 'operador',
        meta_mensal: 2000,
        ativo: true
      });
      fetchFuncionarios();
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
      nome: funcionario.nome || '',
      loja_id: funcionario.loja_id?.toString() || '',
      cargo: funcionario.cargo || 'operador',
      meta_mensal: funcionario.meta_mensal || 2000,
      ativo: funcionario.ativo !== false
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este funcionário?')) {
      try {
        await operadoresAPI.delete(id);
        fetchFuncionarios();
      } catch (error) {
        console.error('Erro ao excluir funcionário:', error);
        alert('Erro ao excluir funcionário. Tente novamente.');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingFuncionario(null);
    setFormData({
      nome: '',
      loja_id: '',
      cargo: 'operador',
      meta_mensal: 2000,
      ativo: true
    });
  };

  const getLojaName = (lojaId) => {
    const loja = lojas.find(l => l.id === lojaId);
    return loja ? loja.nome : 'N/A';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-6 w-6" />
            Cadastro de Funcionários
          </h2>
          <p className="text-gray-600 mt-1">Gerencie os funcionários do sistema</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Novo Funcionário
        </Button>
      </div>

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
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="loja">Loja *</Label>
                  <Select 
                    value={formData.loja_id} 
                    onValueChange={(value) => setFormData({...formData, loja_id: value})}
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
                    onValueChange={(value) => setFormData({...formData, cargo: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operador">Operador</SelectItem>
                      <SelectItem value="supervisor">Supervisor</SelectItem>
                      <SelectItem value="gerente">Gerente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="meta_mensal">Meta Mensal (R$)</Label>
                  <Input
                    id="meta_mensal"
                    type="number"
                    step="0.01"
                    value={formData.meta_mensal}
                    onChange={(e) => setFormData({...formData, meta_mensal: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="ativo"
                  checked={formData.ativo}
                  onChange={(e) => setFormData({...formData, ativo: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="ativo">Funcionário ativo</Label>
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
          <CardTitle>Funcionários Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          {funcionarios.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Nenhum funcionário cadastrado. Clique em "Novo Funcionário" para começar.
            </p>
          ) : (
            <div className="space-y-4">
              {funcionarios.map((funcionario) => (
                <div key={funcionario.id} className="border rounded-lg p-4 flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{funcionario.nome}</h3>
                    <div className="flex gap-4 mt-2 text-sm text-gray-600">
                      <span>🏪 {getLojaName(funcionario.loja_id)}</span>
                      <span>👤 {funcionario.cargo}</span>
                      <span>🎯 R$ {funcionario.meta_mensal?.toFixed(2) || '0,00'}</span>
                      <span className={funcionario.ativo ? 'text-green-600' : 'text-red-600'}>
                        {funcionario.ativo ? '✅ Ativo' : '❌ Inativo'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
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
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CadastroFuncionarios;

