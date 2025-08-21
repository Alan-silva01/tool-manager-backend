
import * as React from "react"
import { Input } from "./input"
import { applyWhatsAppMask, formatWhatsAppForSave, convertDisplayToInput } from "@/utils/whatsappFormatter"
import { cn } from "@/lib/utils"

interface WhatsAppInputProps extends Omit<React.ComponentProps<"input">, "onChange" | "value"> {
  value?: string;
  onChange?: (value: string) => void;
  onRawValueChange?: (rawValue: string) => void;
}

const WhatsAppInput = React.forwardRef<HTMLInputElement, WhatsAppInputProps>(
  ({ className, value = "", onChange, onRawValueChange, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState("");

    // Inicializa o valor de exibição quando o componente monta ou o valor prop muda
    React.useEffect(() => {
      if (value) {
        // Se o valor vem do banco (com 55), converte para formato de entrada
        const inputFormat = convertDisplayToInput(value);
        const formatted = applyWhatsAppMask(inputFormat);
        setDisplayValue(formatted);
      } else {
        setDisplayValue("");
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      
      // Aplica a máscara para exibição
      const maskedValue = applyWhatsAppMask(inputValue);
      setDisplayValue(maskedValue);
      
      // Remove todos os caracteres não numéricos para o valor raw
      const rawValue = inputValue.replace(/\D/g, '');
      
      // Chama os callbacks com os valores apropriados
      if (onChange) {
        onChange(maskedValue);
      }
      
      if (onRawValueChange) {
        // Formata o valor raw para salvar no banco (adiciona 55)
        const valueForSave = formatWhatsAppForSave(rawValue);
        onRawValueChange(valueForSave);
      }
    };

    return (
      <Input
        {...props}
        ref={ref}
        value={displayValue}
        onChange={handleChange}
        placeholder="(99)99999-9999"
        className={cn(className)}
      />
    );
  }
);

WhatsAppInput.displayName = "WhatsAppInput";

export { WhatsAppInput };
