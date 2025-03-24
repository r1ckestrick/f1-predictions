import * as React from "react";
import Paper from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import RestoreIcon from "@mui/icons-material/Restore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const BottomNavBar = () => {
  const [value, setValue] = React.useState(0);

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction
          label="Recents"
          icon={<RestoreIcon />}
          sx={{
            "&.Mui-selected": {
              color: "red", // Ensure selected state is blue
            },
          }}
        />
        <BottomNavigationAction
          label="Favorites"
          icon={<FavoriteIcon />}
          sx={{
            "&.Mui-selected": {
              color: "red", // Ensure selected state is blue
            },
          }}
        />
        <BottomNavigationAction
          label="Nearby"
          icon={<LocationOnIcon />}
          sx={{
            "&.Mui-selected": {
              color: "red", // Ensure selected state is blue
            },
          }}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNavBar;
