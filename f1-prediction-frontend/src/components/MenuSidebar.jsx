import { Drawer, List, ListItemButton, ListItemText, Divider, Typography, IconButton, Avatar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function MenuSidebar({ open, onClose, user, isAdmin, onAdminMode, onLogout }) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <div style={{ width: 260, padding: 20, display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#1c1c1e' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Avatar src={user?.image} alt={user?.name} />
            <div>
              <Typography variant="h6" sx={{ fontFamily: "'Barlow Condensed'", color: 'white' }}>
                {user?.name || "Jugador"}
              </Typography>
              <Typography variant="body2" sx={{ color: "#aaa" }}>
                {user?.points || 0} puntos
              </Typography>
            </div>
          </div>
          <IconButton onClick={onClose}>
            <CloseIcon sx={{ color: "white" }} />
          </IconButton>
        </div>

        <Divider sx={{ my: 2, borderColor: "#444" }} />

        {/* Opciones */}
        <List>

          {isAdmin && (
            <ListItemButton onClick={onAdminMode}>
              <ListItemText 
                primary="Admin Mode" 
                slotProps={{ primary: { sx: { fontFamily: "'Barlow Condensed'", color: 'white' } } }} 
              />
            </ListItemButton>
          )}

          <ListItemButton onClick={onLogout}>
            <ListItemText 
              primary="Cerrar sesión" 
              slotProps={{ primary: { sx: { fontFamily: "'Barlow Condensed'", color: 'white' } } }} 
            />
          </ListItemButton>

          <ListItemButton>
            <ListItemText 
              primary="Ajustes" 
              slotProps={{ primary: { sx: { fontFamily: "'Barlow Condensed'", color: 'white' } } }} 
            />
          </ListItemButton>

          <ListItemButton>
            <ListItemText 
              primary="Contacto" 
              slotProps={{ primary: { sx: { fontFamily: "'Barlow Condensed'", color: 'white' } } }} 
            />
          </ListItemButton>

        </List>

        {/* Footer */}
        <div style={{ marginTop: 'auto', textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: "#666" }}>PredictionParty v0.8</Typography>
        </div>
      </div>
    </Drawer>
  );
}
