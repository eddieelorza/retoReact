import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";

const USER_ID = process.env.REACT_APP_ID_KEY;


function App() {
  const [token, setToken] = useState("");
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [results, setResults] = useState([]);

  useEffect(function () {
    fetch(`http://api.mediastack.com/v1/news?access_key=${USER_ID}`, {
    })
      .then((response) => response.json())
      .then((data) => setToken(data.access_token));
  }, []);

  function search() {
    if (!query || !type) {
      alert("Por favor ingresa la búsqueda y selecciona el tipo de búsqueda");
      return;
    }

    fetch(`https://api.spotify.com/v1/search?q=${query}&type=${type}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.tracks) {
          setResults(data.tracks.items);
        } else if (data.artists) {
          setResults(data.artists.items);
        } else {
          setResults(data.albums.items);
        }
      });
  }

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          marginTop: "30px",
          flexWrap: "wrap",
        }}
      >
        <TextField
          id="outlined-basic"
          label="Búsqueda"
          variant="outlined"
          sx={{ width: "500px" }}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Autocomplete
          disablePortal
          options={[
            {
              label: "Canción",
              id: "track",
            },
            {
              label: "Artista",
              id: "artist",
            },
            {
              label: "Album",
              id: "album",
            },
          ]}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Tipo de búsqueda" />
          )}
          onChange={(e, option) => setType(option.id)}
        />
        <Button variant="contained" color="success" onClick={search}>
          Buscar
        </Button>
      </Box>

      {results.length > 0 ? (
        <List>
          {results.map(({ name }) => (
            <ListItem>
              <ListItemText primary={name} />
            </ListItem>
          ))}
        </List>
      ) : null}
    </Container>
  );
}

export default App;
