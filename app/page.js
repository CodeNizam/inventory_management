"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  Modal,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { firestore } from "@/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
  where,
} from "firebase/firestore";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 3,
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const updateInventory = async (searchTerm = "") => {
    const inventoryCollection = collection(firestore, "inventory");
    let q;

    if (searchTerm.trim() === "") {
      q = query(inventoryCollection);
    } else {
      // Assuming you have a 'name_lowercase' field in your documents for case-insensitive search
      q = query(
        inventoryCollection,
        where("name_lowercase", ">=", searchTerm.toLowerCase()),
        where("name_lowercase", "<=", searchTerm.toLowerCase() + "\uf8ff")
      );
    }

    const docs = await getDocs(q);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    const itemId = item.toLowerCase();
    const docRef = doc(collection(firestore, "inventory"), itemId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, {
        quantity: quantity + 1,
        name_lowercase: itemId,
      });
    } else {
      await setDoc(docRef, { quantity: 1, name_lowercase: itemId });
    }
    await updateInventory(searchQuery);
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, {
          quantity: quantity - 1,
          name_lowercase: item.toLowerCase(),
        });
      }
    }
    await updateInventory(searchQuery);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    updateInventory(value);
  };

  const clearSearch = () => {
    setSearchQuery("");
    updateInventory();
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display={"flex"}
      justifyContent={"center"}
      flexDirection={"column"}
      alignItems={"center"}
      gap={2}
    >
      {/* Add Item Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={"row"} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                if (itemName.trim() !== "") {
                  addItem(itemName.trim());
                  setItemName("");
                  handleClose();
                }
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* Search Bar */}
      <Box width="800px" display="flex" justifyContent="space-between">
        <Button variant="contained" onClick={handleOpen}>
          Add New Item
        </Button>
        <TextField
          id="search-bar"
          label="Search Items"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {searchQuery ? (
                  <IconButton onClick={clearSearch}>
                    <ClearIcon />
                  </IconButton>
                ) : (
                  <SearchIcon />
                )}
              </InputAdornment>
            ),
          }}
          sx={{ marginLeft: 2 }}
        />
      </Box>

      {/* Inventory List */}
      <Box border={"1px solid #333"}>
        <Box
          width="800px"
          height="100px"
          bgcolor={"#ADD8E6"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Typography variant={"h2"} color={"#333"} textAlign={"center"}>
            Inventory Items
          </Typography>
        </Box>
        <Stack width="800px" maxHeight="400px" spacing={2} overflow={"auto"}>
          {inventory.length > 0 ? (
            inventory.map(({ name, quantity }) => (
              <Box
                key={name}
                width="100%"
                minHeight="150px"
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
                bgcolor={"#f0f0f0"}
                paddingX={5}
              >
                <Typography variant={"h3"} color={"#333"} textAlign={"center"}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant={"h3"} color={"#333"} textAlign={"center"}>
                  Quantity: {quantity}
                </Typography>
                <Button variant="contained" onClick={() => removeItem(name)}>
                  Remove
                </Button>
              </Box>
            ))
          ) : (
            <Box
              width="100%"
              minHeight="150px"
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              bgcolor={"#f0f0f0"}
              paddingX={5}
            >
              <Typography variant={"h4"} color={"#333"} textAlign={"center"}>
                No items found.
              </Typography>
            </Box>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
