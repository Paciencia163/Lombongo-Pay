import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Navigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Recycle, Users, Store, ArrowLeftRight, Settings, LogOut,
  Search, Trash2, Plus, Save, Shield, Download
} from "lucide-react";

const exportToCSV = (data: any[], filename: string) => {
  if (!data.length) { toast.error("Sem dados para exportar"); return; }
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(","),
    ...data.map(row => headers.map(h => {
      const val = String(row[h] ?? "").replace(/"/g, '""');
      return `"${val}"`;
    }).join(","))
  ].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success("Ficheiro CSV exportado!");
};

const AdminDashboard = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [settings, setSettings] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingSettings, setEditingSettings] = useState<Record<string, string>>({});
  const [newPartner, setNewPartner] = useState({ name: "", category: "supermercado", address: "", phone: "", nif: "", responsible: "" });
  const [showAddPartner, setShowAddPartner] = useState(false);

  useEffect(() => {
    if (isAdmin) fetchAll();
  }, [isAdmin]);

  const fetchAll = async () => {
    const [profilesRes, partnersRes, transactionsRes, settingsRes] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("partners").select("*").order("created_at", { ascending: false }),
      supabase.from("transactions").select("*").order("created_at", { ascending: false }).limit(100),
      supabase.from("system_settings").select("*").order("key"),
    ]);
    if (profilesRes.data) setProfiles(profilesRes.data);
    if (partnersRes.data) setPartners(partnersRes.data);
    if (transactionsRes.data) setTransactions(transactionsRes.data);
    if (settingsRes.data) {
      setSettings(settingsRes.data);
      const editMap: Record<string, string> = {};
      settingsRes.data.forEach((s: any) => { editMap[s.key] = s.value; });
      setEditingSettings(editMap);
    }
  };

  const handleDeleteProfile = async (id: string) => {
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (error) { toast.error("Erro ao eliminar perfil"); return; }
    toast.success("Perfil eliminado");
    setProfiles(profiles.filter(p => p.id !== id));
  };

  const handleAddPartner = async () => {
    if (!newPartner.name || !newPartner.address) { toast.error("Preencha nome e endereço"); return; }
    const { error } = await supabase.from("partners").insert(newPartner);
    if (error) { toast.error("Erro ao adicionar parceiro"); return; }
    toast.success("Parceiro adicionado");
    setNewPartner({ name: "", category: "supermercado", address: "", phone: "", nif: "", responsible: "" });
    setShowAddPartner(false);
    fetchAll();
  };

  const handleTogglePartner = async (id: string, currentActive: boolean) => {
    const { error } = await supabase.from("partners").update({ is_active: !currentActive }).eq("id", id);
    if (error) { toast.error("Erro"); return; }
    toast.success(currentActive ? "Parceiro desativado" : "Parceiro ativado");
    fetchAll();
  };

  const handleSaveSettings = async () => {
    for (const setting of settings) {
      if (editingSettings[setting.key] !== setting.value) {
        await supabase.from("system_settings").update({ value: editingSettings[setting.key] }).eq("id", setting.id);
      }
    }
    toast.success("Configurações salvas");
    fetchAll();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  if (!user || !isAdmin) return <Navigate to="/login" replace />;

  const filteredProfiles = profiles.filter(p =>
    p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-secondary">Painel Administrativo</h1>
            <p className="text-xs text-muted-foreground">Lombongo Pay</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={signOut}>
          <LogOut className="w-4 h-4 mr-1" /> Sair
        </Button>
      </header>

      {/* Stats */}
      <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center"><Users className="w-5 h-5 text-primary" /></div>
              <div><p className="text-2xl font-bold text-secondary">{profiles.length}</p><p className="text-xs text-muted-foreground">Usuários</p></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center"><Store className="w-5 h-5 text-primary" /></div>
              <div><p className="text-2xl font-bold text-secondary">{partners.length}</p><p className="text-xs text-muted-foreground">Parceiros</p></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center"><ArrowLeftRight className="w-5 h-5 text-primary" /></div>
              <div><p className="text-2xl font-bold text-secondary">{transactions.length}</p><p className="text-xs text-muted-foreground">Transações</p></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center"><Recycle className="w-5 h-5 text-primary" /></div>
              <div><p className="text-2xl font-bold text-secondary">{transactions.reduce((sum, t) => sum + Number(t.weight_kg || 0), 0).toFixed(0)} kg</p><p className="text-xs text-muted-foreground">Reciclado</p></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="px-6 pb-6">
        <Tabs defaultValue="users">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="users"><Users className="w-4 h-4 mr-1" /> Usuários</TabsTrigger>
            <TabsTrigger value="partners"><Store className="w-4 h-4 mr-1" /> Parceiros</TabsTrigger>
            <TabsTrigger value="transactions"><ArrowLeftRight className="w-4 h-4 mr-1" /> Transações</TabsTrigger>
            <TabsTrigger value="settings"><Settings className="w-4 h-4 mr-1" /> Configurações</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <CardTitle className="text-lg">Gestão de Usuários</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative w-full md:w-72">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input placeholder="Buscar..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                    <Button variant="outline" size="sm" onClick={() => exportToCSV(profiles, "usuarios")}>
                      <Download className="w-4 h-4 mr-1" /> CSV
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Localização</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProfiles.map(p => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.full_name || "—"}</TableCell>
                        <TableCell><Badge variant={p.user_type === "comercio" ? "secondary" : "default"}>{p.user_type === "comercio" ? "Comércio" : "Cidadão"}</Badge></TableCell>
                        <TableCell>{p.phone || "—"}</TableCell>
                        <TableCell>{p.location || "—"}</TableCell>
                        <TableCell>{new Date(p.created_at).toLocaleDateString("pt-AO")}</TableCell>
                        <TableCell><Button variant="ghost" size="icon" onClick={() => handleDeleteProfile(p.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button></TableCell>
                      </TableRow>
                    ))}
                    {filteredProfiles.length === 0 && (
                      <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Nenhum usuário encontrado</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Partners Tab */}
          <TabsContent value="partners">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Gestão de Parceiros</CardTitle>
                  <Button size="sm" onClick={() => setShowAddPartner(!showAddPartner)}>
                    <Plus className="w-4 h-4 mr-1" /> Adicionar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showAddPartner && (
                  <div className="mb-6 p-4 border rounded-xl space-y-3 bg-muted/30">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div><Label>Nome</Label><Input value={newPartner.name} onChange={e => setNewPartner({...newPartner, name: e.target.value})} /></div>
                      <div><Label>Categoria</Label><Input value={newPartner.category} onChange={e => setNewPartner({...newPartner, category: e.target.value})} /></div>
                      <div><Label>Endereço</Label><Input value={newPartner.address} onChange={e => setNewPartner({...newPartner, address: e.target.value})} /></div>
                      <div><Label>Telefone</Label><Input value={newPartner.phone} onChange={e => setNewPartner({...newPartner, phone: e.target.value})} /></div>
                      <div><Label>NIF</Label><Input value={newPartner.nif} onChange={e => setNewPartner({...newPartner, nif: e.target.value})} /></div>
                      <div><Label>Responsável</Label><Input value={newPartner.responsible} onChange={e => setNewPartner({...newPartner, responsible: e.target.value})} /></div>
                    </div>
                    <Button onClick={handleAddPartner}><Save className="w-4 h-4 mr-1" /> Salvar</Button>
                  </div>
                )}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Endereço</TableHead>
                      <TableHead>NIF</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {partners.map(p => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell>{p.category}</TableCell>
                        <TableCell>{p.address}</TableCell>
                        <TableCell>{p.nif || "—"}</TableCell>
                        <TableCell><Badge variant={p.is_active ? "default" : "secondary"}>{p.is_active ? "Ativo" : "Inativo"}</Badge></TableCell>
                        <TableCell><Button variant="ghost" size="sm" onClick={() => handleTogglePartner(p.id, p.is_active)}>{p.is_active ? "Desativar" : "Ativar"}</Button></TableCell>
                      </TableRow>
                    ))}
                    {partners.length === 0 && (
                      <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Nenhum parceiro</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Histórico de Transações</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => exportToCSV(transactions, "transacoes")}>
                    <Download className="w-4 h-4 mr-1" /> Exportar CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Valor (Kz)</TableHead>
                      <TableHead>Material</TableHead>
                      <TableHead>Peso (kg)</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map(t => (
                      <TableRow key={t.id}>
                        <TableCell><Badge variant={t.type === "descarte" ? "default" : "secondary"}>{t.type}</Badge></TableCell>
                        <TableCell className="font-medium">{Number(t.amount).toLocaleString("pt-AO")}</TableCell>
                        <TableCell>{t.material_type || "—"}</TableCell>
                        <TableCell>{t.weight_kg || "—"}</TableCell>
                        <TableCell>{t.description || "—"}</TableCell>
                        <TableCell>{new Date(t.created_at).toLocaleDateString("pt-AO")}</TableCell>
                      </TableRow>
                    ))}
                    {transactions.length === 0 && (
                      <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Nenhuma transação</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Configurações do Sistema</CardTitle>
                  <Button size="sm" onClick={handleSaveSettings}><Save className="w-4 h-4 mr-1" /> Salvar</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {settings.map(s => (
                    <div key={s.id} className="flex flex-col md:flex-row md:items-center gap-2 p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm text-secondary">{s.key}</p>
                        <p className="text-xs text-muted-foreground">{s.description}</p>
                      </div>
                      <Input className="md:w-48" value={editingSettings[s.key] || ""} onChange={e => setEditingSettings({ ...editingSettings, [s.key]: e.target.value })} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
