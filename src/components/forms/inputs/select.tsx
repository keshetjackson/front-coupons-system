import { useField } from 'formik';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface FormikSelectProps {
  name: string;
  label?: string;
  placeholder?: string;
  options: Array<{
    value: string;
    label: string;
  }>;
  [key: string]: any;
}

export function FormikSelect({ 
  name, 
  placeholder = "Select an option", 
  options,
  ...props 
}: FormikSelectProps) {
  const [field, , helpers] = useField(name);
  
  return (
    <Select
      onValueChange={(value) => helpers.setValue(value)}
      value={field.value}
      {...props}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}