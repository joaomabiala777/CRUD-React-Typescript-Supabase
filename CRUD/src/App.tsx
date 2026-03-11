import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import Navbar from "./components/Navbar";
import "./App.css";

interface Produto {
  id?: number;
  nome: string;
  quantidade: number;
  preco: number;
}

export default function App() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Produto | null>(null);
  const [formData, setFormData] = useState<Produto>({
    nome: "",
    quantidade: 0,
    preco: 0,
  });

  // Buscar produtos
  const fetchProdutos = async () => {
    const { data } = await supabase
      .from("produtos")
      .select("*")
      .order("id", { ascending: true });
    if (data) setProdutos(data);
  };

  useEffect(() => {
    // Criamos uma função interna para lidar com o async de forma limpa
    const carregarDados = async () => {
      await fetchProdutos();
    };

    carregarDados();
  }, []); // O array vazio garante que só roda uma vez ao montar

  // Salvar ou Atualizar
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      await supabase
        .from("produtos")
        .update(formData)
        .eq("id", editingProduct.id);
    } else {
      await supabase.from("produtos").insert([formData]);
    }
    closeModal();
    fetchProdutos();
  };

  const deleteProduct = async (id: number) => {
    if (confirm("Deseja eliminar este produto?")) {
      await supabase.from("produtos").delete().eq("id", id);
      fetchProdutos();
    }
  };

  const openModal = (produto?: Produto) => {
    if (produto) {
      setEditingProduct(produto);
      setFormData(produto);
    } else {
      setEditingProduct(null);
      setFormData({ nome: "", quantidade: 0, preco: 0 });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      
      {/* Navbar */}
      <Navbar />
      
      <div className="max-w-4xl mt-16 mx-auto bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between mb-6">
          
          <button
            onClick={() => openModal()}
            className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded"
          >
            Adicionar Produto
          </button>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2">Nome</th>
              <th className="p-2">Qtd</th>
              <th className="p-2">Preço</th>
              <th className="p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{p.nome}</td>
                <td className="p-2">{p.quantidade}</td>
                <td className="p-2">{p.preco}kz</td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => openModal(p)}
                    className="cursor-pointer text-yellow-600 font-medium"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deleteProduct(p.id!)}
                    className="cursor-pointer text-red-600 font-medium"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#3103039f] bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg w-96 shadow-xl">
            <h2 className="text-xl font-bold mb-4">
              {editingProduct ? "Editar Produto" : "Novo Produto"}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <input
                type="text"
                placeholder="Nome"
                className="w-full border p-2 rounded"
                value={formData.nome}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
                required
              />
              <input
                type="number"
                placeholder="Quantidade"
                className="w-full border p-2 rounded"
                value={formData.quantidade}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantidade: Number(e.target.value),
                  })
                }
                required
              />
              <input
                type="number"
                step="0.01"
                placeholder="Preço"
                className="w-full border p-2 rounded"
                value={formData.preco}
                onChange={(e) =>
                  setFormData({ ...formData, preco: Number(e.target.value) })
                }
                required
              />
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="cursor-pointer text-gray-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {editingProduct ? "Salvar" : "Cadastrar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
