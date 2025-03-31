import { Switch, FormControlLabel } from "@mui/material";

export default function AdminToggle({ isAdmin, isEditing, setIsEditing }) {
  if (!isAdmin) return null;

  return (
    <FormControlLabel
      control={
        <Switch
          checked={isEditing}
          onChange={(e) => setIsEditing(e.target.checked)}
          color="primary"
        />
      }
      label="Modo Admin"
      sx={{ ml: 2 }}
    />
  );
}
