import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { Plus, Users, Edit, Trash2 } from 'lucide-react';

const CadastroUsuarios = ({ user }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [lojas, setLojas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    tipo: 'gerente',
    loja_id: ''
  });

  useEffect(() => {
    if (user?.tipo === 'admin') {
      fetchUsuarios();
      fetchLojas();
    }
  }, [user]);

  const fetchUsuarios = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/usuarios', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  const fetchLojas = async () => {
    try {
      const response = await fetch('/api/lojas');
      if (response.ok) {
        const data = await response.json();
        setLojas(data);
      }
    } catch (error) {
      console.error('Erro ao buscar lojas:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const dataToSend = {
        ...formData,
        loja_id: formData.tipo === 'gerente' ? parseInt(formData.loja_id) : null
      };

      const url = editingUser ? `/api/usuarios/${editingUser.id}` : '/api/usuarios';
      const method = editingUser ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });

      if (response.ok) {
        setSuccess(editingUser ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!');
        setShowForm(false);
        setEditingUser(null);
        setFormData({
          nome: '',
          email: '',
          senha: '',
          tipo: 'gerente',
          loja_id: ''
        });
        fetchUsuarios();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Erro ao salvar usuário');
      }
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      setError('Erro ao salvar usuário. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (usuario) => {
    setEditingUser(usuario);
    setFormData({
      nome: usuario.nome || '',
      email: usuario.email || '',
      senha: '', // Não preencher senha por segurança
      tipo: usuario.tipo || 'gerente',
      loja_id: usuario.loja_id?.toString() || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/usuarios/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          setSuccess('Usuário excluído com sucesso!');
          fetchUsuarios();
        } else {
          setError('Erro ao excluir usuário');
        }
      } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        setError('Erro ao excluir usuário. Tente novamente.');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingUser(null);
    setFormData({
      nome: '',
      email: '',
      senha: '',
      tipo: 'gerente',
      loja_id: ''
    });
    setError('');
    setSuccess('');
  };

  const getLojaName = (lojaId) => {
    const loja = lojas.find(l => l.id === lojaId);
    return loja ? loja.nome : 'N/A';
  };

  // Verificar se usuário é admin
  if (user?.tipo !== 'admin') {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Acesso restrito a administradores.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-6 w-6" />
            Gerenciar Usuários
          </h2>
          <p className="text-gray-600 mt-1">Cadastre e gerencie usuários do sistema</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Novo Usuário
        </Button>
      </div>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
            </CardTitle>
            <CardDescription>
              Preencha os dados do novo usuário
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="senha">Senha</Label>
                  <Input
                    id="senha"
                    type="password"
                    value={formData.senha}
                    onChange={(e) => setFormData({...formData, senha: e.target.value})}
                    required={!editingUser}
                    placeholder={editingUser ? "Deixe em branco para manter a atual" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="tipo">Tipo de Usuário</Label>
                  <Select 
                    value={formData.tipo} 
                    onValueChange={(value) => setFormData({...formData, tipo: value, loja_id: value === 'admin' ? '' : formData.loja_id})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="gerente">Gerente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.tipo === 'gerente' && (
                <div>
                  <Label htmlFor="loja">Loja (para gerentes)</Label>
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
              )}

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
          <CardTitle>Usuários Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          {usuarios.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Nenhum usuário cadastrado. Clique em "Novo Usuário" para começar.
            </p>
          ) : (
            <div className="space-y-4">
              {usuarios.map((usuario) => (
                <div key={usuario.id} className="border rounded-lg p-4 flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{usuario.nome}</h3>
                    <div className="flex gap-4 mt-2 text-sm text-gray-600">
                      <span>📧 {usuario.email}</span>
                      <span>👤 {usuario.tipo === 'admin' ? 'Administrador' : 'Gerente'}</span>
                      {usuario.tipo === 'gerente' && usuario.loja_id && (
                        <span>🏪 {getLojaName(usuario.loja_id)}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(usuario)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {usuario.id !== user?.id && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(usuario.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
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

export default CadastroUsuarios;

