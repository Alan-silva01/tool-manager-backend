
import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

const data = [
  {
    id: "m5gr84i9",
    invoice: "INV-0001",
    paymentStatus: "paid",
    total: "$250.00",
    date: "2023-01-02",
  },
  {
    id: "9iz6g941",
    invoice: "INV-0002",
    paymentStatus: "pending",
    total: "$150.00",
    date: "2023-01-05",
  },
  {
    id: "1cju8fie",
    invoice: "INV-0003",
    paymentStatus: "unpaid",
    total: "$350.00",
    date: "2023-01-07",
  },
  {
    id: "f092oreu",
    invoice: "INV-0004",
    paymentStatus: "paid",
    total: "$450.00",
    date: "2023-01-10",
  },
]

type PaymentStatus = "paid" | "pending" | "unpaid"

interface DataTableProps {
  data: {
    id: string
    invoice: string
    paymentStatus: PaymentStatus
    total: string
    date: string
  }[]
}

const EstoqueManager = () => {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  // Estados do formulário de Adicionar Ferramenta
  const [openAddFerramenta, setOpenAddFerramenta] = useState(false)
  const [nomeFerramenta, setNomeFerramenta] = useState("")
  const [categoriaFerramenta, setCategoriaFerramenta] = useState("")
  const [tagFerramenta, setTagFerramenta] = useState("") // sempre string
  const [caracteristicasFerramenta, setCaracteristicasFerramenta] = useState("")

  const handleSubmitFerramenta = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const payload = {
      nome: (nomeFerramenta || "").trim(),
      categoria: (categoriaFerramenta || "").trim(),
      tag: String(tagFerramenta || "").trim(), // garante string e preserva zeros à esquerda
      // texto corrido: substitui quebras de linha por ", " e remove espaços extras
      caracteristicas: (caracteristicasFerramenta || "")
        .replace(/\s*\n+\s*/g, ", ")
        .replace(/\s{2,}/g, " ")
        .trim(),
    }

    console.log("[Adicionar Ferramenta] Enviando payload ao webhook:", payload)

    fetch("https://dinastia-n8n-webhook.ihslvn.easypanel.host/webhook/salvar-ferramenta", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // JSON válido com aspas duplas e sem vírgulas após o último campo
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (res.ok) {
          toast.success("Ferramenta adicionada com sucesso.")
          setOpenAddFerramenta(false)
          setNomeFerramenta("")
          setCategoriaFerramenta("")
          setTagFerramenta("")
          setCaracteristicasFerramenta("")
          return
        }

        // Não OK: tenta ler o corpo para log
        const text = await res.text().catch(() => "")
        console.error("[Adicionar Ferramenta] Webhook retornou erro:", res.status, text)
        toast.error("Falha ao adicionar ferramenta via webhook.")
      })
      .catch((err) => {
        console.error("[Adicionar Ferramenta] Erro de rede ao chamar webhook:", err)
        toast.error("Falha de rede ao enviar para o webhook.")
      })
  }

  return (
    <>
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Ferramentas</h1>
          <Button className="" onClick={() => setOpenAddFerramenta(true)}>Adicionar Ferramenta</Button>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.invoice}</TableCell>
                  <TableCell>
                    <Badge
                      variant={row.paymentStatus === "paid" ? "default" : row.paymentStatus === "pending" ? "secondary" : "destructive"}
                    >
                      {row.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>{row.total}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View invoice</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={openAddFerramenta} onOpenChange={setOpenAddFerramenta}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Adicionar Ferramenta</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmitFerramenta} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="nomeFerramenta">Nome</Label>
              <Input
                id="nomeFerramenta"
                placeholder="Ex.: Furadeira"
                value={nomeFerramenta}
                onChange={(e) => setNomeFerramenta(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="categoriaFerramenta">Categoria</Label>
              <Input
                id="categoriaFerramenta"
                placeholder="Ex.: Eletrica"
                value={categoriaFerramenta}
                onChange={(e) => setCategoriaFerramenta(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tagFerramenta">TAG</Label>
              <Input
                id="tagFerramenta"
                type="text" // mantém como string (preserva zeros à esquerda)
                placeholder="Ex.: 0000977556"
                value={tagFerramenta}
                onChange={(e) => setTagFerramenta(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="caracteristicasFerramenta">Características</Label>
              <Textarea
                id="caracteristicasFerramenta"
                placeholder="Ex.: cor: preta, marca: makita, tensao: 220V"
                value={caracteristicasFerramenta}
                onChange={(e) => setCaracteristicasFerramenta(e.target.value)}
                className="min-h-[100px]"
                required
              />
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="ghost" onClick={() => setOpenAddFerramenta(false)}>
                Cancelar
              </Button>
              <Button type="submit">Adicionar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default EstoqueManager
