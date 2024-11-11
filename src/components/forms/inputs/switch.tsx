import { useField } from 'formik';
import { Switch } from "@/components/ui/switch";

interface FormikSwitchProps {
  name: string;
  [key: string]: any;
}

export function FormikSwitch({ name, ...props }: FormikSwitchProps) {
  const [field, , helpers] = useField(name);
  
  return (
    <Switch
      checked={field.value}
      onCheckedChange={(checked) => {
        helpers.setValue(checked);
      }}
      {...props}
    />
  );
}